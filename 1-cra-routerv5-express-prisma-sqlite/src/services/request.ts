const defaultOptions = {
  credentials: "include" as RequestCredentials,
};

export default function request(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  return fetch(`${process.env.REACT_APP_BE_URL}${url}`, {
    ...defaultOptions,
    ...options,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .catch((error) => {
      throw error;
    });
}
