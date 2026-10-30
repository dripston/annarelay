import { beforeEach, describe, expect, it } from "vitest";
import { db } from "../src/db/db";
import { getRecipient, listDemandRows } from "../src/db/repo";
import { STANDING_NOTE } from "../src/db/seed";
import { nowMs } from "../src/domain/clock";
import { createDemand } from "../src/domain/intake";
import { refreshStandingNeeds } from "../src/domain/standingNeeds";
import { assignmentsOf, makeOffer, reset } from "./helpers";

const live = (rid: string) => listDemandRows().filter((d) => d.recipient_id === rid && (d.status === "open" || d.status === "partially_matched"));

describe("standing needs", () => {
  beforeEach(reset);

  it("expires requests from earlier days and opens today's for every shelter", () => {
    // age every seeded request: their deadline is now in the past
    db.prepare("UPDATE demands SET needed_by = ? WHERE status = 'open'").run(new Date(nowMs() - 3600_000).toISOString());
    const r = refreshStandingNeeds();
    expect(r.expired).toBe(5);
    expect(r.created).toBe(5);
    const hope = live("rc_hope");
    expect(hope).toHaveLength(1);
    expect(hope[0]).toMatchObject({ people_count: 20, diet: "veg", notes: STANDING_NOTE });
    expect(Date.parse(hope[0].needed_by)).toBeGreaterThan(nowMs());
  });

  it("does nothing while today's requests are still current", () => {
    expect(refreshStandingNeeds()).toEqual({ expired: 0, created: 0 });
  });

  it("makes stale requests matchable again, so offers get matched", () => {
    db.prepare("UPDATE demands SET needed_by = ? WHERE status = 'open'").run(new Date(nowMs() - 3600_000).toISOString());
    const before = makeOffer(20, "veg");
    expect(assignmentsOf(before)).toHaveLength(0); // nobody needs food: every request expired
    refreshStandingNeeds();
    expect(assignmentsOf(makeOffer(20, "veg")).length).toBeGreaterThan(0);
  });

  it("remembers a shelter's latest need and retires today's automatic request", () => {
    createDemand({
      recipient_id: "rc_dawn", people_count: 30, diet: "veg", needed_by: new Date(nowMs() + 3 * 3600_000).toISOString(),
      max_distance_km: 5, notes: null, raw_transcript: null,
    });
    expect(getRecipient("rc_dawn")).toMatchObject({ standing_people: 30, standing_diet: "veg" });
    const dawn = live("rc_dawn");
    expect(dawn).toHaveLength(1);
    expect(dawn[0].people_count).toBe(30);
  });

  it("doesn't open a second request after today's was fulfilled", () => {
    db.prepare("UPDATE demands SET status = 'fulfilled', meals_matched = people_count WHERE recipient_id = 'rc_hope'").run();
    expect(refreshStandingNeeds().created).toBe(0);
  });
});
