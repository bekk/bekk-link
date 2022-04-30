import type { HeadersFunction, MetaFunction } from "@remix-run/server-runtime";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Bekk Link",
  viewport: "width=device-width,initial-scale=1",
});

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control": "s-maxage=43200, stale-while-revalidate=86400",
  };
};


export default function App() {
  return (
    <html lang="nb-no">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
