"use client"

import { useQueryStore } from "@/store/queryStore"

export default function Home() {
  const { tree, addRule, addGroup } = useQueryStore()

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Visual Query Builder</h1>
      <button
        className="border px-3 py-1 mr-2"
        onClick={() => addRule(tree.id)}
      >
        Add Rule
      </button>
      <button
        className="border px-3 py-1"
        onClick={() => addGroup(tree.id)}
      >
        Add Group
      </button>
      <pre className="mt-4 bg-gray-100 p-4 text-sm">
        {JSON.stringify(tree, null, 2)}
      </pre>
    </main>
  )
}
//export default function Home() {
//  return (
//    <main className="min-h-screen p-8">
//      <h1 className="text-2xl font-bold">Visual Query Builder</h1>
//    </main>
//  )
//}