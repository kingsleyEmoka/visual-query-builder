"use client"

import { useEffect } from "react"
import { useQueryStore } from "@/store/queryStore"

export function useKeyboardShortcuts() {
  const { tree, addRule, addGroup, undo } = useQueryStore()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isModifierPressed = e.ctrlKey || e.metaKey // Cmd on Mac, Ctrl on Windows

      if (isModifierPressed && e.key.toLowerCase() === "z") {
        e.preventDefault()
        undo()
      }

      if (isModifierPressed && e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault()
        addRule(tree.id)
      }

      if (isModifierPressed && e.shiftKey && e.key.toLowerCase() === "g") {
        e.preventDefault()
        addGroup(tree.id)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [tree.id, addRule, addGroup, undo])
}