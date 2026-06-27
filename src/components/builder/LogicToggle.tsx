"use client"

import { useQueryStore } from "@/store/queryStore"

type LogicToggleProps = {
  groupId: string
  logic: "AND" | "OR"
}

export function LogicToggle({ groupId, logic }: LogicToggleProps) {
  const { updateGroupLogic } = useQueryStore()

  return (
    <div className="inline-flex border rounded overflow-hidden dark:border-gray-700">
      <button
        className={`px-3 py-1 text-sm ${
          logic === "AND"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
        }`}
        onClick={() => updateGroupLogic(groupId, "AND")}
      >
        AND
      </button>
      <button
        className={`px-3 py-1 text-sm ${
          logic === "OR"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
        }`}
        onClick={() => updateGroupLogic(groupId, "OR")}
      >
        OR
      </button>
    </div>
  )
}