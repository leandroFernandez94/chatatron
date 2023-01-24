import { useContext, useEffect } from "react";
import StoreContext from "../contexts/StoreContext";
import fetchRooms from "../services/fetchRooms";

export default function SelectRoomScreen() {
  const { activeUser, rooms, setRooms, setActiveRoom } =
    useContext(StoreContext);

  useEffect(() => {
    fetchRooms(activeUser).then((rooms) => {
      setRooms(rooms);
    });
  }, []);

  function onSelectRoom(e: React.MouseEvent<HTMLButtonElement>) {
    const roomName = e.currentTarget.name;
    const room = rooms.find((room) => room.name === roomName);
    if (room) {
      setActiveRoom(room);
    }
  }

  return (
    <div>
      <h1>Select Room:</h1>
      {rooms.map((room) => {
        return (
          <button key={room.id} onClick={onSelectRoom} name={room.name}>
            {room.name}
          </button>
        );
      })}
    </div>
  );
}
