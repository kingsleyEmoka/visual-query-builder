"use client"

import { useQueryStore } from "@/store/queryStore"
import { GroupBlock } from "./GroupBlock"
import { validateTree } from "@/lib/validateTree"

export function QueryBuilder() {
  const { tree } = useQueryStore()
  const errors = validateTree(tree)

  return (
    <div className="max-w-3xl">
      <GroupBlock group={tree} isRoot errors={errors} />
    </div>
  )
}