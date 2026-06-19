import { Schema } from "@/types/schema"

export const USER_SCHEMA: Schema = [
  { name: "name", label: "Name", type: "string" },
  { name: "age", label: "Age", type: "number" },
  { name: "status", label: "Status", type: "enum", enumOptions: ["active", "inactive", "banned"] },
  { name: "country", label: "Country", type: "string" },
  { name: "createdAt", label: "Created At", type: "date" },
  { name: "isVerified", label: "Verified", type: "boolean" },
]