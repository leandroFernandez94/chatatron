import React from "react";
import LoginScreen from "./screens/Login";
import RoomScreen from "./screens/Room";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import StoreContext from "./contexts/StoreContext";
import { SelectInitialRooms } from "./screens/SelectInitialRooms";

export enum routes {
  login = "/login",
  signup = "/sign-up",
  selectInitialRooms = "/select-initial-rooms",
  selectRoom = "/rooms",
  room = "/rooms/:roomId",
}

export default function AppRouter() {
  const context = React.useContext(StoreContext);

  // dont route until we have bootstrapped the app context
  if (!context.bootstrapped) return null;

  return (
    <Router>
      <Switch>
        <Route path={routes.login}>
          <LoginScreen />
        </Route>
        <Route path={routes.signup}>
          <LoginScreen isSignUp />
        </Route>
        <Route path={routes.selectInitialRooms}>
          <SelectInitialRooms />
        </Route>
        <Route path={routes.selectRoom}>
          <RoomScreen />
        </Route>
        <Route path="">
          <Redirect to={routes.login} />
        </Route>
      </Switch>
    </Router>
  );
}
