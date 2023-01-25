import React from "react";
import LoginScreen from "./screens/Login";
import SelectRoomScreen from "./screens/SelectRoom";
import ActiveRoom from "./screens/ActiveRoom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

export default function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={LoginScreen} />
        <Route path="/select-room">
          <SelectRoomScreen />
        </Route>
        <Route path="/room/:roomId">
          <ActiveRoom />
        </Route>
        <Route path="">
          <Redirect to="/login" />
        </Route>
      </Switch>
    </Router>
  );
}
