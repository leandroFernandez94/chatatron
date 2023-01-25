import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import StoreContext from "../contexts/StoreContext";
import fetchRooms from "../services/fetchRooms";

export default function SelectRoomScreen() {
  const { rooms, setActiveRoom, activeUser, setRooms } =
    useContext(StoreContext);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [errorLoading, setErrorLoading] = useState<string | null>(null);
  const history = useHistory();

  async function loadRooms() {
    try {
      setIsLoadingRooms(true);
      setErrorLoading(null);
      const rooms = await fetchRooms(activeUser);
      setRooms(rooms);
    } catch (err) {
      if (err instanceof Error) {
        setErrorLoading(err.message);
      } else {
        setErrorLoading("Something went wrong X(");
      }
    } finally {
      setIsLoadingRooms(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  function onSelectRoom(e: React.MouseEvent<HTMLButtonElement>) {
    const roomId = e.currentTarget.name;
    if (roomId) {
      setActiveRoom(roomId);
      history.push(`/room/${roomId}`);
    }
  }

  return (
    <div>
      <h1>Select Room:</h1>
      {rooms.map((room) => {
        return (
          <button key={room.id} onClick={onSelectRoom} name={room.id}>
            {room.name}
          </button>
        );
      })}
      {isLoadingRooms && <p>Loading...</p>}
      {errorLoading && <p>{errorLoading}</p>}
    </div>
  );
}
