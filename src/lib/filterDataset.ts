import { Group, QueryNode, Rule } from "@/types/query"

function evaluateRule(rule: Rule, row: Record<string, unknown>): boolean {
  const { field, operator, value } = rule
  if (!field) return true // no field selected yet, treat as passing

  const rowValue = row[field]

  switch (operator) {
    case "equals":
      return String(rowValue) === String(value)
    case "notEquals":
      return String(rowValue) !== String(value)
    case "contains":
      return String(rowValue).toLowerCase().includes(String(value).toLowerCase())
    case "startsWith":
      return String(rowValue).toLowerCase().startsWith(String(value).toLowerCase())
    case "greaterThan":
      return Number(rowValue) > Number(value)
    case "lessThan":
      return Number(rowValue) < Number(value)
    case "inArray":
      return Array.isArray(value) && value.map(String).includes(String(rowValue))
    case "between":
      if (Array.isArray(value) && value.length === 2) {
        return Number(rowValue) >= Number(value[0]) && Number(rowValue) <= Number(value[1])
      }
      return true
    default:
      return true
  }
}

function evaluateGroup(group: Group, row: Record<string, unknown>): boolean {
  if (group.children.length === 0) return true

  const results = group.children.map((child) => evaluateNode(child, row))

  return group.logic === "AND"
    ? results.every((r) => r)
    : results.some((r) => r)
}

function evaluateNode(node: QueryNode, row: Record<string, unknown>): boolean {
  return node.type === "rule" ? evaluateRule(node, row) : evaluateGroup(node, row)
}

export function filterDataset<T extends Record<string, unknown>>(
  tree: Group,
  dataset: T[]
): T[] {
  return dataset.filter((row) => evaluateGroup(tree, row))
}