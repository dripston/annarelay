// Standing needs: AnnaRelay remembers what each shelter usually needs (people, diet) and keeps one
// live request open for it every day, so food can be matched without the shelter re-posting daily.
// A shelter's last real request (call, form or Telegram) becomes its new standing need.
import { db, tx } from "../db/db";
import { insertDemand, listRecipientRows } from "../db/repo";
import { demandDeadline, RECIPIENTS, STANDING_NOTE } from "../db/seed";
import { nowMs } from "./clock";
import type { Diet, RecipientRow } from "./types";

export { STANDING_NOTE } from "../db/seed";

/** The remembered need, falling back to the seeded one (and a default for judge shelters). */
export function standingNeedOf(r: RecipientRow): { people: number; diet: Diet } | null {
  if (r.standing_people && r.standing_people > 0) return { people: r.standing_people, diet: r.standing_diet ?? "any" };
  const seeded = RECIPIENTS.find((s) => s.id === r.id)?.demand;
  if (seeded) return { people: seeded.people, diet: seeded.diet };
  if (r.id.startsWith("rc_judge_")) return { people: 20, diet: "any" };
  return null;
}

/** Remember a shelter's latest need, and retire today's automatic request it replaces. */
export function rememberNeed(recipientId: string, people: number, diet: Diet): void {
  db.prepare("UPDATE recipients SET standing_people = ?, standing_diet = ? WHERE id = ?").run(people, diet, recipientId);
  db.prepare("UPDATE demands SET status = 'expired' WHERE recipient_id = ? AND status = 'open' AND meals_matched = 0 AND notes = ?")
    .run(recipientId, STANDING_NOTE);
}

/**
 * Expire requests whose deadline has passed, then open today's request for every shelter that has
 * a standing need but nothing current (a request fulfilled today counts as current: no second helping).
 */
export function refreshStandingNeeds(now = nowMs()): { expired: number; created: number } {
  return tx(() => {
    const iso = new Date(now).toISOString();
    const expired = db
      .prepare("UPDATE demands SET status = 'expired' WHERE status IN ('open', 'partially_matched') AND needed_by <= ?")
      .run(iso).changes;
    const current = db.prepare("SELECT COUNT(*) AS n FROM demands WHERE recipient_id = ? AND status != 'expired' AND needed_by > ?");
    let created = 0;
    for (const r of listRecipientRows()) {
      const need = standingNeedOf(r);
      if (!need || (current.get(r.id, iso) as { n: number }).n > 0) continue;
      insertDemand({
        recipient_id: r.id, people_count: need.people, diet: need.diet, needed_by: demandDeadline(now),
        max_distance_km: 5, notes: STANDING_NOTE, raw_transcript: null,
      });
      created += 1;
    }
    return { expired, created };
  });
}
