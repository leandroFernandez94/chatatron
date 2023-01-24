import { useContext } from "react";
import StoreContext from "../contexts/StoreContext";
import { login } from "../services/login";

export default function LoginScreen() {
  const { setActiveUser } = useContext(StoreContext);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const email = (e.currentTarget.elements[0] as HTMLInputElement).value;
      const user = await login(email);
      setActiveUser(user);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <input type="email" placeholder="Enter your email" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
