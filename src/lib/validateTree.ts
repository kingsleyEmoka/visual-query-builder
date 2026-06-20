import { Group, QueryNode, Rule } from "@/types/query"
import { ValidationError } from "@/types/validation"
import { getFieldType } from "@/lib/schema/schemaHelpers"
import { USER_SCHEMA } from "@/lib/schema/userSchema"

const STRING_ONLY_OPERATORS = ["contains", "startsWith"]
const NUMERIC_OPERATORS = ["greaterThan", "lessThan", "between"]

function validateRule(rule: Rule): ValidationError[] {
  const errors: ValidationError[] = []

  if (!rule.field) {
    errors.push({ nodeId: rule.id, message: "Please select a field." })
    return errors // no point checking further without a field
  }

  const fieldType = getFieldType(USER_SCHEMA, rule.field)

  if (STRING_ONLY_OPERATORS.includes(rule.operator) && fieldType !== "string") {
    errors.push({
      nodeId: rule.id,
      message: `"${rule.operator}" can only be used on text fields.`,
    })
  }

  if (NUMERIC_OPERATORS.includes(rule.operator) && fieldType !== "number" && fieldType !== "date") {
    errors.push({
      nodeId: rule.id,
      message: `"${rule.operator}" can only be used on number or date fields.`,
    })
  }

  if (rule.value === "" || rule.value === null || rule.value === undefined) {
    errors.push({ nodeId: rule.id, message: "Please enter a value." })
  }

  if (rule.operator === "between") {
    const isValidRange = Array.isArray(rule.value) && rule.value.length === 2
    if (!isValidRange) {
      errors.push({ nodeId: rule.id, message: '"between" requires two values.' })
    }
  }

  return errors
}

function validateGroup(group: Group): ValidationError[] {
  const errors: ValidationError[] = []

  if (group.children.length === 0) {
    errors.push({ nodeId: group.id, message: "This group is empty. Add a rule or remove it." })
    return errors
  }

  for (const child of group.children) {
    errors.push(...validateNode(child))
  }

  return errors
}

function validateNode(node: QueryNode): ValidationError[] {
  return node.type === "rule" ? validateRule(node) : validateGroup(node)
}

export function validateTree(tree: Group): ValidationError[] {
  return validateGroup(tree)
}