"use client"

import { Group } from "@/types/query"
import { useQueryStore } from "@/store/queryStore"
import { RuleRow } from "./RuleRow"
import { LogicToggle } from "./LogicToggle"

type GroupBlockProps = {
  group: Group
  isRoot?: boolean
}

export function GroupBlock({ group, isRoot = false }: GroupBlockProps) {
  const { addRule, addGroup, removeNode } = useQueryStore()

  return (
    <div className={`p-3 border rounded ${isRoot ? "bg-gray-50" : "bg-blue-50 border-blue-200"}`}>
      <div className="flex items-center gap-2 mb-2">
        <LogicToggle groupId={group.id} logic={group.logic} />

        <button
          className="text-sm border rounded px-2 py-1 bg-white"
          onClick={() => addRule(group.id)}
        >
          + Rule
        </button>

        <button
          className="text-sm border rounded px-2 py-1 bg-white"
          onClick={() => addGroup(group.id)}
        >
          + Group
        </button>

        {!isRoot && (
          <button
            className="text-sm text-red-500 ml-auto"
            onClick={() => removeNode(group.id)}
          >
            ✕ Remove Group
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 ml-4">
        {group.children.length === 0 && (
          <p className="text-sm text-gray-400">No conditions yet. Add a rule or group.</p>
        )}

        {group.children.map((child) =>
          child.type === "rule" ? (
            <RuleRow key={child.id} rule={child} />
          ) : (
            <GroupBlock key={child.id} group={child} />
          )
        )}
      </div>
    </div>
  )
}