import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const linksData = { linksData: "links" };
  console.log("linksData::", linksData);
  return json(linksData);
}

export default function Links() {
  const data = useLoaderData<typeof loader>();
  console.log("links data::", data);
  return <h1>links</h1>;
}
