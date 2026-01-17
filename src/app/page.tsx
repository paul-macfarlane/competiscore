import { Button } from "@/components/ui/button"
import { db } from "@/db";

export default async function Home() {
  const posts = await db.query.postsTable.findMany();

  return (
    <div className="flex items-center justify-center h-screen">
      <Button>Click me</Button>
      
      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </div>
  )
}