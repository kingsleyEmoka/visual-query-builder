import { Group } from "@/types/query"

export function exportTreeToJSON(tree: Group): string {
  return JSON.stringify(tree, null, 2)
}

export function downloadJSON(tree: Group, filename: string = "query.json") {
  const json = exportTreeToJSON(tree)
  const blob = new Blob([json], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}

export function parseImportedJSON(jsonString: string): Group | null {
  try {
    const parsed = JSON.parse(jsonString)
    // Basic shape validation — not bulletproof, but catches obvious garbage
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      parsed.type === "group" &&
      Array.isArray(parsed.children) &&
      typeof parsed.id === "string" &&
      (parsed.logic === "AND" || parsed.logic === "OR")
    ) {
      return parsed as Group
    }
    return null
  } catch {
    return null
  }
}