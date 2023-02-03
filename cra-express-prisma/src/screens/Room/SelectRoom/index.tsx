import { Room } from "@prisma/client";
import { MouseEventHandler } from "react";

type Props = {
  rooms: Room[];
  onSelectRoom: MouseEventHandler<HTMLButtonElement>;
};

export function SelectRoom({ rooms, onSelectRoom }: Props) {
  return (
    <div>
      <h1>Select Room:</h1>
      {rooms.map((room) => (
        <button key={room.id} onClick={onSelectRoom} name={String(room.id)}>
          {room.name}
        </button>
      ))}
    </div>
  );
}
