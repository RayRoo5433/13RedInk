import { json } from "@sveltejs/kit";
import { APIFY_API_TOKEN } from "$env/static/private";

export async function GET() {
  const TOKEN = APIFY_API_TOKEN;
  const google = await fetch(`https://api.apify.com/v2/actors/Xb8osYTtOjlsgI6k9/runs/last/dataset/items?token=${TOKEN}`);
  const facebook = await fetch(`https://api.apify.com/v2/actors/dX3d80hsNMilEwjXG/runs/last/dataset/items?token=${TOKEN}`);

  let googleData = await google.json();
  let facebookData = await facebook.json();

  // schema Name Photo Rating Text Date Platform
  // @ts-ignore
  facebookData = facebookData.map((x) => {
    return {
      name: x.user.name,
      photo: x.user.profilePic,
      rating: x.isRecommended,
      text: x.text,
      platform: "facebook",
      date: new Date(x.date),
    };
  });

  // @ts-ignore
  googleData = googleData.map((x) => {
    return {
      name: x.name,
      photo: x.reviewerPhotoUrl,
      text: x.text,
      rating: x.stars,
      platform: "google",
      date: new Date(x.publishedAtDate),
    };
  });
  // @ts-ignore
  return json([...googleData.filter((x) => x.rating >= 4), ...facebookData.filter((x) => x.rating)]);
}
