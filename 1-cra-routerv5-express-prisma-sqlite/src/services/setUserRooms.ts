import request from "./request";

export async function setUserRooms(userId: number, roomIds: number[]) {
  try {
    await request(`/set-user-rooms/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomIds }),
    });
  } catch (error) {
    console.error(error);
    throw new Error("Rooms not set");
  }
}
