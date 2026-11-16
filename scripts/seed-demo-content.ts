import "dotenv/config";
import { getDb } from "../server/db";
import {
  articles,
  attorneys,
  categories,
  practiceAreas,
} from "../client/src/data/site";
import {
  attorneys as attorneyTable,
  blogCategories,
  blogPosts,
  practiceAreas as practiceTable,
} from "../drizzle/schema";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function seedDemoContent() {
  const db = await getDb();
  if (!db)
    throw new Error(
      "DATABASE_URL is not available; the demo content was not seeded."
    );
  try {
    const [
      existingPractices,
      existingAttorneys,
      existingPosts,
      existingCategories,
    ] = await Promise.all([
      db.select({ id: practiceTable.id }).from(practiceTable).limit(1),
      db.select({ id: attorneyTable.id }).from(attorneyTable).limit(1),
      db.select({ id: blogPosts.id }).from(blogPosts).limit(1),
      db.select({ id: blogCategories.id }).from(blogCategories).limit(1),
    ]);
    if (
      existingPractices.length ||
      existingAttorneys.length ||
      existingPosts.length ||
      existingCategories.length
    ) {
      console.log(
        "Demo seed skipped: at least one CMS table already contains content. No records were changed."
      );
      return;
    }

    await db.transaction(async tx => {
      await tx.insert(practiceTable).values(
        practiceAreas.map((item, sortOrder) => ({
          slug: item.slug,
          title: item.title,
          summary: item.short,
          overview: item.overview,
          services: JSON.stringify(item.services),
          challenges: JSON.stringify(item.challenges),
          assistance: JSON.stringify(item.assistance),
          faqs: JSON.stringify(item.faqs),
          imageUrl: item.image ?? null,
          isDemo: true,
          published: true,
          sortOrder,
        }))
      );
      await tx.insert(attorneyTable).values(
        attorneys.map((item, sortOrder) => ({
          slug: item.slug,
          fullName: item.name,
          title: item.title,
          specialty: item.specialty,
          summary: item.bio,
          biography: item.fullBio,
          education: JSON.stringify(item.education),
          credentials: JSON.stringify(item.credentials),
          experience: JSON.stringify(item.experience),
          languages: JSON.stringify(item.languages),
          photoUrl: item.photo ?? null,
          isDemo: true,
          published: true,
          sortOrder,
        }))
      );
      await tx
        .insert(blogCategories)
        .values(categories.map(name => ({ name, slug: slugify(name) })));
      await tx.insert(blogPosts).values(
        articles.map(item => ({
          slug: item.slug,
          title: item.title,
          category: item.category,
          excerpt: item.excerpt,
          content: JSON.stringify(item.body),
          author: item.author,
          imageUrl: item.image ?? null,
          status: "published" as const,
          publishedAt: new Date(`${item.date}T12:00:00.000Z`),
          isDemo: true,
        }))
      );
    });
    console.log(
      `Seeded ${practiceAreas.length} clearly labeled demo practice areas, ${attorneys.length} demo attorney, ${articles.length} demo articles and ${categories.length} categories.`
    );
  } finally {
    const client = (db as unknown as { $client?: { end: () => Promise<void> } })
      .$client;
    await client?.end();
  }
}

seedDemoContent().catch(error => {
  console.error(
    "Demo content seed failed without changing existing content.",
    error instanceof Error ? error.message : "unknown error"
  );
  process.exitCode = 1;
});
