import { describe, it, expect } from "vitest"
import { filterDataset } from "@/lib/filterDataset"
import { Group } from "@/types/query"

const mockData = [
  { id: "1", name: "Ada", age: 24, country: "Nigeria", status: "active" },
  { id: "2", name: "Tom", age: 45, country: "UK", status: "banned" },
  { id: "3", name: "Sarah", age: 19, country: "USA", status: "active" },
]

describe("filterDataset", () => {
  it("returns all rows when the tree has no children", () => {
    const tree: Group = { id: "root", type: "group", logic: "AND", children: [] }
    expect(filterDataset(tree, mockData)).toHaveLength(3)
  })

  it("filters rows matching a single equals rule", () => {
    const tree: Group = {
      id: "root",
      type: "group",
      logic: "AND",
      children: [
        { id: "r1", type: "rule", field: "country", operator: "equals", value: "Nigeria" },
      ],
    }
    const result = filterDataset(tree, mockData)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Ada")
  })

  it("applies AND logic correctly across two rules", () => {
    const tree: Group = {
      id: "root",
      type: "group",
      logic: "AND",
      children: [
        { id: "r1", type: "rule", field: "age", operator: "greaterThan", value: 20 },
        { id: "r2", type: "rule", field: "status", operator: "equals", value: "active" },
      ],
    }
    const result = filterDataset(tree, mockData)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Ada")
  })

  it("applies OR logic correctly across two rules", () => {
    const tree: Group = {
      id: "root",
      type: "group",
      logic: "OR",
      children: [
        { id: "r1", type: "rule", field: "status", operator: "equals", value: "banned" },
        { id: "r2", type: "rule", field: "country", operator: "equals", value: "USA" },
      ],
    }
    const result = filterDataset(tree, mockData)
    expect(result).toHaveLength(2)
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
            { id: "r2", type: "rule", field: "age", operator: "greaterThan", value: 40 },
            { id: "r3", type: "rule", field: "status", operator: "equals", value: "banned" },
          ],
        },
      ],
    }
    const result = filterDataset(tree, mockData)
    expect(result).toHaveLength(2) // Ada (Nigeria) + Tom (age>40 AND banned)
  })

  it("treats a rule with no field selected as always passing", () => {
    const tree: Group = {
      id: "root",
      type: "group",
      logic: "AND",
      children: [
        { id: "r1", type: "rule", field: "", operator: "equals", value: "" },
      ],
    }
    expect(filterDataset(tree, mockData)).toHaveLength(3)
  })
})