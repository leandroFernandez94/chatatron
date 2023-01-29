import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import StoreContext from "../contexts/StoreContext";
import { login } from "../services/login";
import { getUserEmail, saveUserEmail } from "../utils/localstorage";

export default function LoginScreen() {
  const { setActiveUser } = useContext(StoreContext);

  const history = useHistory();

  const [isLogingIn, setIsLogingIn] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);

  async function loginWithEmail(email: string) {
    const user = await login(email);
    saveUserEmail(user.email);
    setActiveUser(user);
    return user;
  }

  useEffect(() => {
    const alreadyLoggedInEmail = getUserEmail();
    if (alreadyLoggedInEmail) {
      loginWithEmail(alreadyLoggedInEmail).then(() => {
        history.push("/select-room");
      });
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLogingIn(true);
      const email = (e.currentTarget.elements[0] as HTMLInputElement).value;
      await loginWithEmail(email);
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
