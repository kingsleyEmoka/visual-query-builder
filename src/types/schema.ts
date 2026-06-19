export type FieldType = "string" | "number" | "boolean" | "enum" | "date"

export type SchemaField = {
  name: string
  label: string
  type: FieldType
  enumOptions?: string[] // only used when type is "enum"
}

export type Schema = SchemaField[]