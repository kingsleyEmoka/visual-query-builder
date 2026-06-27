"use client"

import { useQueryStore } from "@/store/queryStore"
import { GroupBlock } from "./GroupBlock"
import { validateTree } from "@/lib/validateTree"
import { useKeyboardShortcuts } from "@/lib/useKeyboardShortcuts"

export function QueryBuilder() {
  const { tree } = useQueryStore()
  const errors = validateTree(tree)

  useKeyboardShortcuts()

  return (
    <div className="max-w-3xl">
      <GroupBlock group={tree} isRoot errors={errors} />
    </div>
  )
}