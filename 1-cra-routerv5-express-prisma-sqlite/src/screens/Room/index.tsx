import { useContext, useEffect, useState } from "react";
import { Route, useHistory } from "react-router-dom";
import StoreContext from "../../contexts/StoreContext";
import { routes } from "../../Router";
import ActiveRoomScreen from "./ActiveRoom";
import { SelectRoom } from "./SelectRoom";

export default function RoomScreen() {
  const { rooms, activeUser, loadUserRooms, activeRoom } =
    useContext(StoreContext);

  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [errorLoading, setErrorLoading] = useState<string | null>(null);
  const history = useHistory();

  const showSelection = !activeRoom;

  async function loadRooms() {
    try {
      setIsLoadingRooms(true);
      setErrorLoading(null);
      if (!activeUser) throw new Error("No active user :(");
      await loadUserRooms();
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

  async function onSelectRoom(e: React.MouseEvent<HTMLButtonElement>) {
    const roomId = e.currentTarget.name;
    if (roomId) {
      history.push(`/rooms/${roomId}`);
    }
  }

  if (isLoadingRooms) return <p>Loading...</p>;

  if (errorLoading) return <p>{errorLoading}</p>;

  return (
    <div>
      {showSelection && (
        <SelectRoom rooms={rooms} onSelectRoom={onSelectRoom} />
      )}
      <Route path={routes.room}>
        <ActiveRoomScreen />
      </Route>
    </div>
  );
}
