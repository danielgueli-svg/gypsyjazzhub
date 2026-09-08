import { getMyProfile } from "@/lib/api";

/** First login has no profile yet → add something. Later logins stay on the site. */
export async function pathAfterLogin(): Promise<"/studio" | "/add" | "/"> {
  try {
    const profile = await getMyProfile();
    return profile ? "/" : "/add";
  } catch {
    return "/add";
  }
}
