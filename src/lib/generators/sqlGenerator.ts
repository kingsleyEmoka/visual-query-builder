import { Group, QueryNode, Rule } from "@/types/query"

function formatValue(value: Rule["value"]): string {
  if (typeof value === "string") return `'${value}'`
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE"
  if (Array.isArray(value)) return `(${value.map(formatValue).join(", ")})`
  return String(value)
}

function generateRuleSQL(rule: Rule): string {
  const { field, operator, value } = rule

  switch (operator) {
    case "equals":
      return `${field} = ${formatValue(value)}`
    case "notEquals":
      return `${field} != ${formatValue(value)}`
    case "contains":
      return `${field} LIKE '%${value}%'`
    case "startsWith":
      return `${field} LIKE '${value}%'`
    case "greaterThan":
      return `${field} > ${formatValue(value)}`
    case "lessThan":
      return `${field} < ${formatValue(value)}`
    case "inArray":
      return `${field} IN ${formatValue(value)}`
    case "between":
      if (Array.isArray(value) && value.length === 2) {
        return `${field} BETWEEN ${value[0]} AND ${value[1]}`
      }
      return `${field} BETWEEN ? AND ?`
    default:
      return ""
  }
}

function generateGroupSQL(group: Group): string {
  const clauses = group.children
    .map((child) => generateNodeSQL(child))
    .filter((clause) => clause !== "")

  if (clauses.length === 0) return ""

  const joined = clauses.join(` ${group.logic} `)
  return clauses.length > 1 ? `(${joined})` : joined
}

function generateNodeSQL(node: QueryNode): string {
  return node.type === "rule" ? generateRuleSQL(node) : generateGroupSQL(node)
}

export function generateSQL(tree: Group, tableName: string = "users"): string {
  const whereClause = generateGroupSQL(tree)
  if (!whereClause) return `SELECT * FROM ${tableName}`
  return `SELECT * FROM ${tableName}\nWHERE ${whereClause}`
}