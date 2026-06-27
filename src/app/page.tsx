"use client"

import { QueryBuilder } from "@/components/builder/QueryBuilder"
import { ResultsPanel } from "@/components/builder/ResultsPanel"
import { useQueryStore } from "@/store/queryStore"
import { generateSQL } from "@/lib/generators/sqlGenerator"
import { generateMongoQuery } from "@/lib/generators/mongoGenerator"
import { HistoryPanel } from "@/components/builder/HistoryPanel"
import { PresetsPanel } from "@/components/builder/PresetsPanel"
import { ExportImportPanel } from "@/components/builder/ExportImportPanel"

export default function Home() {
  const { tree, theme, toggleTheme } = useQueryStore()

  return (
    <main className="min-h-screen p-8 bg-white dark:bg-gray-900 dark:text-white transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Visual Query Builder</h1>
        <button
          className="border rounded px-3 py-1 text-sm bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
          onClick={toggleTheme}
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      <QueryBuilder />

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold mb-1">SQL</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 text-sm whitespace-pre-wrap">
            {generateSQL(tree)}
          </pre>
        </div>
        <div>
          <h2 className="font-semibold mb-1">MongoDB</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 text-sm whitespace-pre-wrap">
            {JSON.stringify(generateMongoQuery(tree), null, 2)}
          </pre>
        </div>
      </div>

      <HistoryPanel />
      <PresetsPanel />
      <ExportImportPanel />
      <ResultsPanel />
    </main>
  )
}