import { describe, it, expect } from "vitest"
import { generateMongoQuery } from "@/lib/generators/mongoGenerator"
import { Group } from "@/types/query"

describe("generateMongoQuery", () => {
  it("returns an empty object when tree is empty", () => {
    const tree: Group = { id: "root", type: "group", logic: "AND", children: [] }
    expect(generateMongoQuery(tree)).toEqual({})
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
    expect(generateMongoQuery(tree)).toEqual({ status: "active" })
  })

  it("wraps multiple rules in $and", () => {
    const tree: Group = {
      id: "root",
      type: "group",
      logic: "AND",
      children: [
        { id: "r1", type: "rule", field: "age", operator: "greaterThan", value: 18 },
        { id: "r2", type: "rule", field: "country", operator: "equals", value: "Nigeria" },
      ],
    }
    expect(generateMongoQuery(tree)).toEqual({
      $and: [{ age: { $gt: 18 } }, { country: "Nigeria" }],
    })
  })

  it("wraps multiple rules in $or", () => {
    const tree: Group = {
      id: "root",
      type: "group",
      logic: "OR",
      children: [
        { id: "r1", type: "rule", field: "status", operator: "equals", value: "active" },
        { id: "r2", type: "rule", field: "status", operator: "equals", value: "banned" },
      ],
    }
    expect(generateMongoQuery(tree)).toEqual({
      $or: [{ status: "active" }, { status: "banned" }],
    })
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
    expect(generateMongoQuery(tree)).toEqual({
      $or: [
        { country: "Nigeria" },
        { $and: [{ age: { $gt: 18 } }, { status: "active" }] },
      ],
    })
  })
})