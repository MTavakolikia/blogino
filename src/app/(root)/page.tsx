import HeroCarousel from "@/components/root/HeroCarousel";
import NewsByCategory from "@/components/posts/NewsByCategory";

export default async function Home() {






  return (
    <div className="container mx-auto px-6 py-8">

      <HeroCarousel />
      <NewsByCategory />
    </div>
  );
}
