import { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import StoreContext from "../../contexts/StoreContext";
import { routes } from "../../Router";
import styles from "./Login.module.css";

export default function LoginScreen({ isSignUp }: { isSignUp?: boolean }) {
  const { login, signUp } = useContext(StoreContext);

  const history = useHistory();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const email = (e.currentTarget.elements[0] as HTMLInputElement).value;
      await login(email);
      history.push(routes.selectRoom);
    } catch (err) {
      if (err instanceof Error) {
        setHasError(err.message);
      } else {
        setHasError("Something went wrong X(");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const name = (e.currentTarget.elements[0] as HTMLInputElement).value;
      const email = (e.currentTarget.elements[1] as HTMLInputElement).value;
      await signUp(name, email);
      history.push(routes.selectInitialRooms);
    } catch (err) {
      if (err instanceof Error) {
        setHasError(err.message);
      } else {
        setHasError("Something went wrong X(");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonText = isSubmitting
    ? "Loading..."
    : isSignUp
    ? "Sign Up"
    : "Login";

  return (
    <section className={styles.loginSection}>
      <div className={styles.loginCard}>
        <h1>{isSignUp ? "Sign Up" : "Login"}</h1>
        <form
          onSubmit={isSignUp ? onSignUp : onLogin}
          className={styles.loginForm}
        >
          {isSignUp && (
            <input
              className={styles.loginInput}
              type="text"
              placeholder="Enter your name"
            />
          )}
          <input
            className={styles.loginInput}
            type="email"
            placeholder="Enter your email"
          />
          <div className={styles.submitContainer}>
            <button type="submit" className={styles.submitButton}>
              {buttonText}
            </button>
            <Link to={isSignUp ? routes.login : routes.signup}>
              or {isSignUp ? "login" : "signup"}
            </Link>
          </div>
          {hasError && <p className={styles.error}>{hasError}</p>}
        </form>
      </div>
    </section>
  );
}
