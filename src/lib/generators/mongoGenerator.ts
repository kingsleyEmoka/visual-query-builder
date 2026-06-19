import { Group, QueryNode, Rule } from "@/types/query"

function generateRuleMongo(rule: Rule): Record<string, unknown> {
  const { field, operator, value } = rule

  switch (operator) {
    case "equals":
      return { [field]: value }
    case "notEquals":
      return { [field]: { $ne: value } }
    case "contains":
      return { [field]: { $regex: value, $options: "i" } }
    case "startsWith":
      return { [field]: { $regex: `^${value}`, $options: "i" } }
    case "greaterThan":
      return { [field]: { $gt: value } }
    case "lessThan":
      return { [field]: { $lt: value } }
    case "inArray":
      return { [field]: { $in: Array.isArray(value) ? value : [value] } }
    case "between":
      if (Array.isArray(value) && value.length === 2) {
        return { [field]: { $gte: value[0], $lte: value[1] } }
      }
      return {}
    default:
      return {}
  }
}

function generateGroupMongo(group: Group): Record<string, unknown> {
  const clauses = group.children
    .map((child) => generateNodeMongo(child))
    .filter((clause) => Object.keys(clause).length > 0)

  if (clauses.length === 0) return {}
  if (clauses.length === 1) return clauses[0]

  const operator = group.logic === "AND" ? "$and" : "$or"
  return { [operator]: clauses }
}

function generateNodeMongo(node: QueryNode): Record<string, unknown> {
  return node.type === "rule" ? generateRuleMongo(node) : generateGroupMongo(node)
}

export function generateMongoQuery(tree: Group): Record<string, unknown> {
  return generateGroupMongo(tree)
}