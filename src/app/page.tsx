"use client"

import { QueryBuilder } from "@/components/builder/QueryBuilder"
import { ResultsPanel } from "@/components/builder/ResultsPanel"
import { useQueryStore } from "@/store/queryStore"
import { generateSQL } from "@/lib/generators/sqlGenerator"
import { generateMongoQuery } from "@/lib/generators/mongoGenerator"

export default function Home() {
  const { tree } = useQueryStore()

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Visual Query Builder</h1>
      <QueryBuilder />

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold mb-1">SQL</h2>
          <pre className="bg-gray-100 p-3 text-sm whitespace-pre-wrap">
            {generateSQL(tree)}
          </pre>
        </div>
        <div>
          <h2 className="font-semibold mb-1">MongoDB</h2>
          <pre className="bg-gray-100 p-3 text-sm whitespace-pre-wrap">
            {JSON.stringify(generateMongoQuery(tree), null, 2)}
          </pre>
        </div>
      </div>
      <ResultsPanel />
    </main>
  )
}