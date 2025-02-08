import PostForm from "@/components/PostForm";
import Posts from "@/components/posts";


export default function Home() {
  // const news = await fetchLatestNews()
  // console.log(news);
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">پست‌ها</h1>
      <PostForm />

      <Posts />
    </div>
  );
}