import { create } from "zustand"
import { Group, QueryNode, Rule } from "@/types/query"
import { Operator } from "@/types/operators"
import { generateId } from "@/lib/generateId"

type Preset = {
  id: string
  name: string
  tree: Group
}

type QueryStore = {
  tree: Group
  history: Group[]
   presets: Preset[]
  // ...existing actions...
  theme: "light" | "dark"
toggleTheme: () => void
  undo: () => void
  loadTree: (tree: Group) => void
  savePreset: (name: string) => void
  loadPreset: (presetId: string) => void
  deletePreset: (presetId: string) => void
  addRule: (groupId: string) => void
  addGroup: (groupId: string) => void
  removeNode: (nodeId: string) => void
  updateRule: (
    ruleId: string,
    changes: Partial<Pick<Rule, "field" | "operator" | "value">>
  ) => void
  updateGroupLogic: (groupId: string, logic: "AND" | "OR") => void
  resetTree: () => void
  reorderChildren: (parentId: string, oldIndex: number, newIndex: number) => void
  pushHistory: () => void
  restoreFromHistory: (index: number) => void
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

function reorderChildrenInTree(
  tree: Group,
  parentId: string,
  oldIndex: number,
  newIndex: number
): Group {
  if (tree.id === parentId) {
    const newChildren = [...tree.children]
    const [moved] = newChildren.splice(oldIndex, 1)
    newChildren.splice(newIndex, 0, moved)
    return { ...tree, children: newChildren }
  }
  return {
    ...tree,
    children: tree.children.map((child) =>
      child.type === "group" ? reorderChildrenInTree(child, parentId, oldIndex, newIndex) : child
    ),
  }
}

const initialTree: Group = createEmptyGroup("AND")

export const useQueryStore = create<QueryStore>((set, get) => ({
  tree: initialTree,
  history: [],
  presets: [],

theme: "light",

toggleTheme: () =>
  set((state) => ({
    theme: state.theme === "light" ? "dark" : "light",
  })),

loadTree: (tree) => set({ tree }),

undo: () =>
  set((state) => {
    if (state.history.length === 0) return {}
    const [mostRecent, ...rest] = state.history
    return { tree: mostRecent, history: rest }
  }),

savePreset: (name) =>
  set((state) => ({
    presets: [...state.presets, { id: generateId(), name, tree: state.tree }],
  })),

loadPreset: (presetId) =>
  set((state) => {
    const preset = state.presets.find((p) => p.id === presetId)
    return preset ? { tree: preset.tree } : {}
  }),

deletePreset: (presetId) =>
  set((state) => ({
    presets: state.presets.filter((p) => p.id !== presetId),
  })),

  // ...all your existing actions stay exactly as they are...

 pushHistory: () =>
    set((state) => ({
      history: [state.tree, ...state.history].slice(0, 10), // Keep only the last 10 states
    })),
  
  restoreFromHistory: (index) =>
    set((state) => ({
      tree: state.history[index],
    })),

  resetTree: () => set({ tree: createEmptyGroup("AND") }),

  addRule: (groupId) => {
    get().pushHistory() // Save current state before making changes
    set((state) => ({
      tree: addChildToGroup(state.tree, groupId, createEmptyRule()),
    }))
  },

  addGroup: (groupId) => {
    get().pushHistory() // Save current state before making changes
    set((state) => ({
      tree: addChildToGroup(state.tree, groupId, createEmptyGroup()),
    }))
  },

  removeNode: (nodeId) => {
    get().pushHistory() // Save current state before making changes
    set((state) => ({
      tree: removeNodeFromTree(state.tree, nodeId),
    }))
  },

  updateRule: (ruleId, changes) =>
    set((state) => ({
      tree: updateRuleInTree(state.tree, ruleId, changes),
    })),

  updateGroupLogic: (groupId, logic) =>
    set((state) => ({
      tree: updateGroupLogicInTree(state.tree, groupId, logic),
    })),

  reorderChildren: (parentId, oldIndex, newIndex) =>
    set((state) => ({
      tree: reorderChildrenInTree(state.tree, parentId, oldIndex, newIndex),
    })),
}))