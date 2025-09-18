import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.slug;
  if (typeof slug !== "string") {
    throw new Error("slug needs to be a string");
  }
  const match = await prisma.link.findFirst({
    where: { slug: { equals: slug.toLowerCase() } },
  });

  if (!match) {
    throw new Response("Link not found", { status: 404 });
  }

  await prisma.link.delete({
    where: { id: match.id },
  });

  return redirect("/");
};
