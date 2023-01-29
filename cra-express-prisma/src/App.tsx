import React from "react";
import useStoreContextValue from "./hooks/useStoreContextValue";
import StoreContext from "./contexts/StoreContext";
import Router from "./Router";

function App() {
  const storeContextValue = useStoreContextValue();

  return (
    <StoreContext.Provider value={storeContextValue}>
      <Router />
    </StoreContext.Provider>
  );
}

export default App;
