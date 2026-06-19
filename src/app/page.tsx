import { QueryBuilder } from "@/components/builder/QueryBuilder"

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Visual Query Builder</h1>
      <QueryBuilder />
    </main>
  )
}