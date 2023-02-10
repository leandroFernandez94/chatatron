import { Room } from "@prisma/client";
import { MouseEventHandler } from "react";
import styles from "./SelectRoom.module.css";

type Props = {
  rooms: Room[];
  onSelectRoom: MouseEventHandler<HTMLButtonElement>;
};

export function SelectRoom({ rooms, onSelectRoom }: Props) {
  return (
    <section className={styles.selectRoomSection}>
      <h1>Select Room:</h1>
      <div className={styles.roomsContainer}>
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={onSelectRoom}
            name={String(room.id)}
            className={styles.roomButton}
          >
            {room.name}
          </button>
        ))}
      </div>
    </section>
  );
}
