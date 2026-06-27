"use client"

import { useRef, useState } from "react"
import { useQueryStore } from "@/store/queryStore"
import { downloadJSON, parseImportedJSON } from "@/lib/exportImport"

export function ExportImportPanel() {
  const { tree, loadTree } = useQueryStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)

  function handleExport() {
    downloadJSON(tree)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = parseImportedJSON(reader.result as string)
      if (result) {
        loadTree(result)
        setImportError(null)
      } else {
        setImportError("Invalid query file. Please upload a valid exported JSON.")
      }
    }
    reader.readAsText(file)

    e.target.value = "" // allow re-uploading the same file later
  }

  return (
    <div className="mt-4 flex items-center gap-2">
      <button
  className="border rounded px-3 py-1 text-sm bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
  onClick={handleExport}
>
  Export JSON
</button>

<button
  className="border rounded px-3 py-1 text-sm bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
  onClick={() => fileInputRef.current?.click()}
>
  Import JSON
</button>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {importError && <p className="text-xs text-red-500">{importError}</p>}
    </div>
  )
}