import request from "./request";

export async function logout(): Promise<void> {
  try {
    await request("/logout", {
      method: "POST",
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to logout");
  }
}
