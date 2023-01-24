import React, { useContext } from "react";
import LoginScreen from "./screens/Login";
import SelectRoomScreen from "./screens/SelectRoom";
import ActiveRoom from "./screens/ActiveRoom";
import StoreContext from "./contexts/StoreContext";

export default function Router() {
  const store = useContext(StoreContext);

  if (!store.activeUser) {
    return <LoginScreen />;
  }

  if (!store.activeRoom) {
    return <SelectRoomScreen />;
  }

  return <ActiveRoom />;
}
