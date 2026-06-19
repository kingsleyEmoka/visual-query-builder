import { Schema, SchemaField, FieldType } from "@/types/schema"

export function getFieldByName(schema: Schema, fieldName: string): SchemaField | undefined {
  return schema.find((field) => field.name === fieldName)
}

export function getFieldType(schema: Schema, fieldName: string): FieldType | undefined {
  return getFieldByName(schema, fieldName)?.type
}

import { OPERATORS_BY_FIELD_TYPE, Operator } from "@/types/operators"

export function getOperatorsForField(schema: Schema, fieldName: string): Operator[] {
  const fieldType = getFieldType(schema, fieldName)
  if (!fieldType) return []
  return OPERATORS_BY_FIELD_TYPE[fieldType]
}

export type InputKind = "text" | "number" | "select" | "date" | "boolean"

export function getInputKindForField(schema: Schema, fieldName: string): InputKind {
  const fieldType = getFieldType(schema, fieldName)
  switch (fieldType) {
    case "number":
      return "number"
    case "enum":
      return "select"
    case "date":
      return "date"
    case "boolean":
      return "boolean"
    default:
      return "text"
  }
}