// Photos used across the site, with the credit each licence asks for (shown in the footer).
// All from Wikimedia Commons under Creative Commons licences that allow reuse with attribution.
import kitchen from "@/assets/photos/kitchen.jpg";
import meal from "@/assets/photos/meal.jpg";
import thali from "@/assets/photos/thali.jpg";

export const PHOTOS = {
  kitchen: {
    src: kitchen,
    alt: "Two cooks stirring a large brass pot over a fire in a community kitchen",
    credit: { author: "jasleen_kaur", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Sikh_Indian_men_cooking_at_volunteer_run_community_kitchen,_langar_Goindwal_Sahib.jpg" },
  },
  meal: {
    src: meal,
    alt: "People seated in long rows sharing a free community meal while a volunteer serves",
    credit: { author: "shankar s.", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:The_famous_%27langar%27-_free_meals_for_one_and_all_(38938496121).jpg" },
  },
  thali: {
    src: thali,
    alt: "A steel thali with dal, rice and two vegetable dishes",
    credit: { author: "Rajeeb Dutta", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Vegetarian_thali-MA08.jpg" },
  },
} as const;
