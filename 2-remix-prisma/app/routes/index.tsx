import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export async function loader() {
  const indexData = { data: "index data" };
  console.log("indexData::", indexData);
  return json(indexData);
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  console.log("root data::", data);
  return (
    <div className="border border-red-200 hover:bg">
      <h1>Welcome!</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
