/** After sign-in, land on the hub profile so people see they are in. */
export async function pathAfterLogin(): Promise<"/studio"> {
  return "/studio";
}
