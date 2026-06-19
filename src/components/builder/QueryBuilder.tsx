"use client"

import { useQueryStore } from "@/store/queryStore"
import { GroupBlock } from "./GroupBlock"

export function QueryBuilder() {
  const { tree } = useQueryStore()

  return (
    <div className="max-w-3xl">
      <GroupBlock group={tree} isRoot />
    </div>
  )
}