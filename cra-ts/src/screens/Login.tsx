import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import StoreContext from "../contexts/StoreContext";
import { login } from "../services/login";

export default function LoginScreen() {
  const { setActiveUser } = useContext(StoreContext);

  const history = useHistory();

  const [isLogingIn, setIsLogingIn] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLogingIn(true);
      const email = (e.currentTarget.elements[0] as HTMLInputElement).value;
      const user = await login(email);
      setActiveUser(user);
      history.push("/select-room");
    } catch (err) {
      if (err instanceof Error) {
        setHasError(err.message);
      } else {
        setHasError("Something went wrong X(");
      }
    } finally {
      setIsLogingIn(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <input type="email" placeholder="Enter your email" />
        <button type="submit">{isLogingIn ? "Loading..." : "Login"}</button>
        {hasError && <p>{hasError}</p>}
      </form>
    </div>
  );
}
