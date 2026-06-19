import { create } from "zustand"
import { Group, QueryNode, Rule } from "@/types/query"
import { Operator } from "@/types/operators"
import { generateId } from "@/lib/generateId"

type QueryStore = {
  tree: Group
  addRule: (groupId: string) => void
  addGroup: (groupId: string) => void
  removeNode: (nodeId: string) => void
  updateRule: (
    ruleId: string,
    changes: Partial<Pick<Rule, "field" | "operator" | "value">>
  ) => void
  updateGroupLogic: (groupId: string, logic: "AND" | "OR") => void
  resetTree: () => void
}

function createEmptyRule(): Rule {
  return {
    id: generateId(),
    type: "rule",
    field: "",
    operator: "equals" as Operator,
    value: "",
  }
}

function createEmptyGroup(logic: "AND" | "OR" = "AND"): Group {
  return {
    id: generateId(),
    type: "group",
    logic,
    children: [],
  }
}

function addChildToGroup(tree: Group, groupId: string, newChild: QueryNode): Group {
  if (tree.id === groupId) {
    return { ...tree, children: [...tree.children, newChild] }
  }
  return {
    ...tree,
    children: tree.children.map((child) =>
      child.type === "group" ? addChildToGroup(child, groupId, newChild) : child
    ),
  }
}

function removeNodeFromTree(tree: Group, nodeId: string): Group {
  return {
    ...tree,
    children: tree.children
      .filter((child) => child.id !== nodeId)
      .map((child) =>
        child.type === "group" ? removeNodeFromTree(child, nodeId) : child
      ),
  }
}

function updateRuleInTree(
  tree: Group,
  ruleId: string,
  changes: Partial<Pick<Rule, "field" | "operator" | "value">>
): Group {
  return {
    ...tree,
    children: tree.children.map((child) => {
      if (child.type === "rule" && child.id === ruleId) {
        return { ...child, ...changes }
      }
      if (child.type === "group") {
        return updateRuleInTree(child, ruleId, changes)
      }
      return child
    }),
  }
}

function updateGroupLogicInTree(tree: Group, groupId: string, logic: "AND" | "OR"): Group {
  if (tree.id === groupId) {
    return { ...tree, logic }
  }
  return {
    ...tree,
    children: tree.children.map((child) =>
      child.type === "group" ? updateGroupLogicInTree(child, groupId, logic) : child
    ),
  }
}

const initialTree: Group = createEmptyGroup("AND")

export const useQueryStore = create<QueryStore>((set) => ({
  tree: initialTree,

  addRule: (groupId) =>
    set((state) => ({
      tree: addChildToGroup(state.tree, groupId, createEmptyRule()),
    })),

  addGroup: (groupId) =>
    set((state) => ({
      tree: addChildToGroup(state.tree, groupId, createEmptyGroup()),
    })),

  removeNode: (nodeId) =>
    set((state) => ({
      tree: removeNodeFromTree(state.tree, nodeId),
    })),

  updateRule: (ruleId, changes) =>
    set((state) => ({
      tree: updateRuleInTree(state.tree, ruleId, changes),
    })),

  updateGroupLogic: (groupId, logic) =>
    set((state) => ({
      tree: updateGroupLogicInTree(state.tree, groupId, logic),
    })),

  resetTree: () => set({ tree: createEmptyGroup("AND") }),
}))