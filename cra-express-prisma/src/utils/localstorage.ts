const userEmailKey = "userEmail";

export const getUserEmail = () => localStorage.getItem(userEmailKey);

export const saveUserEmail = (email: string | undefined) =>
  email
    ? localStorage.setItem(userEmailKey, email)
    : localStorage.removeItem(userEmailKey);
