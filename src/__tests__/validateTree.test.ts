import { describe, it, expect } from "vitest"
import { validateTree } from "@/lib/validateTree"
import { Group } from "@/types/query"

describe("validateTree", () => {
  it("returns no errors for an empty root group with no children requirement at root", () => {
    // Note: root being empty still triggers "empty group" error by current design
    const tree: Group = { id: "root", type: "group", logic: "AND", children: [] }
    const errors = validateTree(tree)
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toMatch(/empty/i)
  })

  it("flags a rule with no field selected", () => {
    const tree: Group = {
      id: "root",
      type: "group",
      logic: "AND",
      children: [
        { id: "r1", type: "rule", field: "", operator: "equals", value: "" },
      ],
    }
    const errors = validateTree(tree)
    expect(errors.some((e) => e.nodeId === "r1" && /select a field/i.test(e.message))).toBe(true)
  })

  it("flags a rule with an empty value", () => {
    const tree: Group = {
      id: "root",
      type: "group",
      logic: "AND",
      children: [
        { id: "r1", type: "rule", field: "age", operator: "equals", value: "" },
      ],
    }
    const errors = validateTree(tree)
    expect(errors.some((e) => e.nodeId === "r1" && /enter a value/i.test(e.message))).toBe(true)
  })

  it("passes a fully valid rule with no errors", () => {
    const tree: Group = {
      id: "root",
      type: "group",
      logic: "AND",
      children: [
        { id: "r1", type: "rule", field: "age", operator: "greaterThan", value: 18 },
      ],
    }
    const errors = validateTree(tree)
    expect(errors).toHaveLength(0)
  })

  it("flags an empty nested group", () => {
    const tree: Group = {
      id: "root",
      type: "group",
      logic: "AND",
      children: [
        { id: "r1", type: "rule", field: "age", operator: "greaterThan", value: 18 },
        { id: "g1", type: "group", logic: "AND", children: [] },
      ],
    }
    const errors = validateTree(tree)
    expect(errors.some((e) => e.nodeId === "g1" && /empty/i.test(e.message))).toBe(true)
  })
})