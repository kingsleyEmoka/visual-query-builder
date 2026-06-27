"use client"

import { useState, memo } from "react"
import { Group } from "@/types/query"
import { ValidationError } from "@/types/validation"
import { useQueryStore } from "@/store/queryStore"
import { RuleRow } from "./RuleRow"
import { LogicToggle } from "./LogicToggle"
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type GroupBlockProps = {
  group: Group
  isRoot?: boolean
  errors?: ValidationError[]
}

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-1">
      <button
        type="button"
        className="cursor-grab text-gray-400 px-1 pt-2 select-none"
        {...attributes}
        {...listeners}
      >
        ☰
      </button>
      <div className="flex-1 animate-fade-in">{children}</div>
    </div>
  )
}

function GroupBlockComponent({ group, isRoot = false, errors = [] }: GroupBlockProps) {
  const { addRule, addGroup, removeNode, reorderChildren } = useQueryStore()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const groupErrors = errors.filter((e) => e.nodeId === group.id)

  const sensors = useSensors(useSensor(PointerSensor))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = group.children.findIndex((c) => c.id === active.id)
    const newIndex = group.children.findIndex((c) => c.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      reorderChildren(group.id, oldIndex, newIndex)
    }
  }

  return (
    <div className={`p-3 border rounded ${isRoot ? "bg-gray-50 dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"}`}>
      <div className="flex items-center gap-2 mb-2">
        <button
          className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-white"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? "▶" : "▼"}
        </button>

        <LogicToggle groupId={group.id} logic={group.logic} />

        <button
          className="text-sm border rounded px-2 py-1 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          onClick={() => addRule(group.id)}
        >
          + Rule
        </button>

        <button
          className="text-sm border rounded px-2 py-1 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
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

      {groupErrors.map((err, i) => (
        <p key={i} className="text-xs text-red-500 mb-2">
          {err.message}
        </p>
      ))}

      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isCollapsed ? "opacity-0 max-h-0" : "opacity-100 max-h-[2000px]"
        }`}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={group.children.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2 ml-4">
              {group.children.length === 0 && (
                <p className="text-sm text-gray-400">No conditions yet. Add a rule or group.</p>
              )}

              {group.children.map((child) => (
                <SortableItem key={child.id} id={child.id}>
                  {child.type === "rule" ? (
                    <RuleRow rule={child} errors={errors} />
                  ) : (
                    <GroupBlock group={child} errors={errors} />
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {isCollapsed && (
        <p className="text-xs text-gray-400 ml-4">
          {group.children.length} condition(s) hidden
        </p>
      )}
    </div>
  )
}

export const GroupBlock = memo(GroupBlockComponent)