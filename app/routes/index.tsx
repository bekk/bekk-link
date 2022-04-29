import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction, LinksFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import fontsCss from "./fonts.css";
import css from "./index.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: fontsCss },
    { rel: "stylesheet", href: css },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const originalUrl = formData.get("originalUrl");
  const slug = formData.get("slug");

  if (!originalUrl || typeof originalUrl !== "string") {
    return json(
      { error: "originalUrl er påkrevd, din hacker" },
      { status: 400 }
    );
  }
  if (!slug || typeof slug !== "string") {
    return json({ error: "slug er påkrevd, hoodietryne" }, { status: 400 });
  }

  const lowercaseSlug = slug.toLowerCase();

  try {
    const exists = await prisma.link.findFirst({
      where: {
        slug: {
          equals: lowercaseSlug,
        },
      },
    });
    if (exists) {
      return json({ error: "Slug finnes allerede" }, { status: 400 });
    }
    await prisma.link.create({
      data: { originalUrl, slug: lowercaseSlug },
    });
    return json({ success: true, slug: lowercaseSlug });
  } catch (error) {
    console.error(error);
    return json({ error }, { status: 500 });
  }
};

export default function LandingPage() {
  const actionData = useActionData();
  return (
    <div className="root">
      <main className="container">
        <h1 className="hero">Bekk.link</h1>
        <p className="description">
          Bekk.link er Bekk sin egen lenkeforkorter.
        </p>
        <h2 className="heading">Registrer ny lenke</h2>
        <Form method="post">
          <div className="form-group">
            <label htmlFor="originalUrl">Original URL</label>
            <input
              type="url"
              id="originalUrl"
              name="originalUrl"
              required
              placeholder="https://bekk.no"
            />
          </div>
          <div className="form-group">
            <label htmlFor="slug">Forkortes til bekk.link/…?</label>
            <input
              id="slug"
              name="slug"
              required
              aria-invalid={actionData?.error === "Slug finnes allerede"}
            />
            {actionData?.error && (
              <div className="error">{actionData.error}</div>
            )}
          </div>
          <button className="button" type="submit">
            {actionData?.success ? "Suksess!" : "Registrer"}
          </button>
        </Form>
      </main>
    </div>
  );
}
