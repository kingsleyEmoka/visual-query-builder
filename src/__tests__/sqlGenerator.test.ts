import { describe, it, expect } from "vitest"
import { generateSQL } from "@/lib/generators/sqlGenerator"
import { Group } from "@/types/query"

describe("generateSQL", () => {
  it("returns a basic SELECT with no WHERE clause when tree is empty", () => {
    const tree: Group = { id: "root", type: "group", logic: "AND", children: [] }
    expect(generateSQL(tree)).toBe("SELECT * FROM users")
  })

  it("generates a simple equals condition", () => {
    const tree: Group = {
      id: "root",
      type: "group",
      logic: "AND",
      children: [
        { id: "r1", type: "rule", field: "status", operator: "equals", value: "active" },
      ],
    }
    expect(generateSQL(tree)).toBe("SELECT * FROM users\nWHERE status = 'active'")
  })

  it("joins multiple rules with AND", () => {
    const tree: Group = {
      id: "root",
      type: "group",
      logic: "AND",
      children: [
        { id: "r1", type: "rule", field: "age", operator: "greaterThan", value: 18 },
        { id: "r2", type: "rule", field: "country", operator: "equals", value: "Nigeria" },
      ],
    }
    expect(generateSQL(tree)).toBe(
      "SELECT * FROM users\nWHERE (age > 18 AND country = 'Nigeria')"
    )
  })

  it("joins multiple rules with OR", () => {
    const tree: Group = {
      id: "root",
      type: "group",
      logic: "OR",
      children: [
        { id: "r1", type: "rule", field: "status", operator: "equals", value: "active" },
        { id: "r2", type: "rule", field: "status", operator: "equals", value: "banned" },
      ],
    }
    expect(generateSQL(tree)).toBe(
      "SELECT * FROM users\nWHERE (status = 'active' OR status = 'banned')"
    )
  })

  it("handles nested groups correctly", () => {
    const tree: Group = {
      id: "root",
      type: "group",
      logic: "OR",
      children: [
        { id: "r1", type: "rule", field: "country", operator: "equals", value: "Nigeria" },
        {
          id: "g1",
          type: "group",
          logic: "AND",
          children: [
            { id: "r2", type: "rule", field: "age", operator: "greaterThan", value: 18 },
            { id: "r3", type: "rule", field: "status", operator: "equals", value: "active" },
          ],
        },
      ],
    }
    expect(generateSQL(tree)).toBe(
      "SELECT * FROM users\nWHERE (country = 'Nigeria' OR (age > 18 AND status = 'active'))"
    )
  })
})