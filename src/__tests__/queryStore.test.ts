import { describe, it, expect, beforeEach } from "vitest"
import { useQueryStore } from "@/store/queryStore"

describe("useQueryStore", () => {
  beforeEach(() => {
    // Reset the store to a clean state before each test
    useQueryStore.setState({
      tree: { id: "root", type: "group", logic: "AND", children: [] },
      history: [],
      presets: [],
    })
  })

  it("starts with an empty root group", () => {
    const { tree } = useQueryStore.getState()
    expect(tree.children).toHaveLength(0)
  })

  it("addRule adds a rule to the target group", () => {
    const { tree, addRule } = useQueryStore.getState()
    addRule(tree.id)
    const updatedTree = useQueryStore.getState().tree
    expect(updatedTree.children).toHaveLength(1)
    expect(updatedTree.children[0].type).toBe("rule")
  })

  it("addGroup adds a nested group to the target group", () => {
    const { tree, addGroup } = useQueryStore.getState()
    addGroup(tree.id)
    const updatedTree = useQueryStore.getState().tree
    expect(updatedTree.children).toHaveLength(1)
    expect(updatedTree.children[0].type).toBe("group")
  })

  it("removeNode removes the correct rule", () => {
    const { tree, addRule, removeNode } = useQueryStore.getState()
    addRule(tree.id)
    const ruleId = useQueryStore.getState().tree.children[0].id
    removeNode(ruleId)
    expect(useQueryStore.getState().tree.children).toHaveLength(0)
  })

  it("updateRule updates field, operator, and value", () => {
    const { tree, addRule, updateRule } = useQueryStore.getState()
    addRule(tree.id)
    const ruleId = useQueryStore.getState().tree.children[0].id
    updateRule(ruleId, { field: "age", operator: "greaterThan", value: 18 })
    const updatedRule = useQueryStore.getState().tree.children[0]
    expect(updatedRule).toMatchObject({ field: "age", operator: "greaterThan", value: 18 })
  })

  it("updateGroupLogic toggles AND/OR", () => {
    const { tree, updateGroupLogic } = useQueryStore.getState()
    updateGroupLogic(tree.id, "OR")
    expect(useQueryStore.getState().tree.logic).toBe("OR")
  })

  it("reorderChildren swaps the order of two rules", () => {
    const { tree, addRule, updateRule, reorderChildren } = useQueryStore.getState()
    addRule(tree.id)
    addRule(tree.id)

    const [first, second] = useQueryStore.getState().tree.children
    updateRule(first.id, { field: "first" })
    updateRule(second.id, { field: "second" })

    reorderChildren(tree.id, 0, 1)

    const reordered = useQueryStore.getState().tree.children
    expect((reordered[0] as any).field).toBe("second")
    expect((reordered[1] as any).field).toBe("first")
  })

  it("savePreset and loadPreset correctly save and restore a tree", () => {
    const { tree, addRule, savePreset, loadPreset } = useQueryStore.getState()
    addRule(tree.id)
    savePreset("My Preset")

    const preset = useQueryStore.getState().presets[0]
    expect(preset.name).toBe("My Preset")

    // Reset tree, then load the preset back
    useQueryStore.setState({ tree: { id: "root", type: "group", logic: "AND", children: [] } })
    loadPreset(preset.id)

    expect(useQueryStore.getState().tree.children).toHaveLength(1)
  })

  it("undo restores the most recent history snapshot", () => {
    const { tree, addRule, undo } = useQueryStore.getState()
    addRule(tree.id) // pushes empty tree to history, adds 1 rule
    expect(useQueryStore.getState().tree.children).toHaveLength(1)

    undo()
    expect(useQueryStore.getState().tree.children).toHaveLength(0)
  })
})