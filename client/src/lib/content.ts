import { trpc } from "@/lib/trpc";
import {
  articles as demoArticles,
  attorneys as demoAttorneys,
  practiceAreas as demoPractices,
} from "@/data/site";

export function usePublicContent() {
  const query = trpc.publicSite.content.useQuery(undefined, {
    retry: false,
    staleTime: 30_000,
  });
  const data = query.data;
  const hasManagedContent = data?.configured === true;
  const practices = hasManagedContent
    ? data!.practices.map(p => ({
        slug: p.slug,
        title: p.title,
        short: p.summary,
        overview: p.overview,
        services: p.services as string[],
        challenges: p.challenges as string[],
        assistance: p.assistance as string[],
        faqs: p.faqs as { question: string; answer: string }[],
        image: p.imageUrl || undefined,
        demo: p.isDemo,
      }))
    : demoPractices;
  const attorneys = hasManagedContent
    ? data!.attorneys.map(p => ({
        slug: p.slug,
        name: p.fullName,
        title: p.title,
        specialty: p.specialty,
        bio: p.summary,
        fullBio: p.biography,
        education: p.education as string[],
        credentials: p.credentials as string[],
        experience: p.experience as string[],
        languages: p.languages as string[],
        photo: p.photoUrl || undefined,
        demo: p.isDemo,
      }))
    : demoAttorneys;
  const articles = hasManagedContent
    ? data!.articles.map(p => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        excerpt: p.excerpt,
        date: p.date,
        author: p.author,
        image: p.imageUrl || undefined,
        body: p.body as string[],
        demo: p.isDemo,
      }))
    : demoArticles;
  const categories = hasManagedContent ? data!.categories.map(c => c.name) : [];
  return {
    practices,
    attorneys,
    articles,
    categories,
    isLoading: query.isLoading,
  };
}
