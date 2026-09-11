/** Only this login sees Owner desk in the menu and may open the desk. */
export const HUB_OWNER_EMAIL = "danielgueli@mac.com";

export function isHubOwnerEmail(email?: string | null) {
  return (email ?? "").trim().toLowerCase() === HUB_OWNER_EMAIL;
}
