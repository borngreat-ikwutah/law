import "dotenv/config";
import { eq } from "drizzle-orm";
import { articles } from "../client/src/data/site";
import { blogPosts } from "../drizzle/schema";
import { getDb } from "../server/db";

const articleSlug = "preparing-for-a-first-legal-consultation";

async function ensureFourthDemoArticle() {
  const article = articles.find(item => item.slug === articleSlug);
  if (!article) throw new Error(`Demo article ${articleSlug} is missing.`);

  const db = await getDb();
  if (!db)
    throw new Error(
      "DATABASE_URL is not available; the demo article was not added."
    );

  try {
    const existing = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.slug, articleSlug))
      .limit(1);
    if (existing.length) {
      console.log(
        "Fourth demo article already exists; no records were changed."
      );
      return;
    }

    await db.insert(blogPosts).values({
      slug: article.slug,
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      content: JSON.stringify(article.body),
      author: article.author,
      imageUrl: article.image ?? null,
      status: "published",
      publishedAt: new Date(`${article.date}T12:00:00.000Z`),
      isDemo: true,
    });
    console.log(`Added the published demo article: ${article.title}`);
  } finally {
    const client = (db as unknown as { $client?: { end: () => Promise<void> } })
      .$client;
    await client?.end();
  }
}

ensureFourthDemoArticle().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
