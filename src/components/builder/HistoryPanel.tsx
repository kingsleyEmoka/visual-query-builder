"use client"

import { useQueryStore } from "@/store/queryStore"

export function HistoryPanel() {
  const { history, restoreFromHistory } = useQueryStore()

  if (history.length === 0) {
    return <p className="text-sm text-gray-400 mt-4">No history yet.</p>
  }

  return (
    <div className="mt-4">
      <h2 className="font-semibold mb-2">History</h2>
      <ul className="flex flex-col gap-1">
        {history.map((snapshot, index) => (
          <li key={index} className="flex items-center justify-between border rounded px-2 py-1 text-sm">
            <span>Snapshot {history.length - index} ({snapshot.children.length} top-level item(s))</span>
            <button
              className="text-blue-500"
              onClick={() => restoreFromHistory(index)}
            >
              Restore
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}