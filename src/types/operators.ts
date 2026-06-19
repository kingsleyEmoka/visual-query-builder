export type Operator =
  | "equals"
  | "notEquals"
  | "contains"
  | "startsWith"
  | "greaterThan"
  | "lessThan"
  | "inArray"
  | "between"

// Defines which operators are valid for each field type
export const OPERATORS_BY_FIELD_TYPE: Record<FieldTypeKey, Operator[]> = {
  string: ["equals", "notEquals", "contains", "startsWith", "inArray"],
  number: ["equals", "notEquals", "greaterThan", "lessThan", "between", "inArray"],
  boolean: ["equals", "notEquals"],
  enum: ["equals", "notEquals", "inArray"],
  date: ["equals", "notEquals", "greaterThan", "lessThan", "between"],
}

type FieldTypeKey = "string" | "number" | "boolean" | "enum" | "date"