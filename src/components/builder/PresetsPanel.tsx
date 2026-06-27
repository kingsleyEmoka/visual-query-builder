"use client"

import { useState } from "react"
import { useQueryStore } from "@/store/queryStore"

export function PresetsPanel() {
  const { presets, savePreset, loadPreset, deletePreset } = useQueryStore()
  const [presetName, setPresetName] = useState("")

  function handleSave() {
    if (!presetName.trim()) return
    savePreset(presetName.trim())
    setPresetName("")
  }

  return (
    <div className="mt-4">
      <h2 className="font-semibold mb-2">Saved Presets</h2>

      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Preset name"
          className="border rounded px-2 py-1 text-sm flex-1 dark:bg-gray-800 dark:border-grey-700 dark:text-white"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
        />
        <button
          className="border rounded px-3 py-1 text-sm bg-white dark:bg-gray-800 dark:border-gray-700"
          onClick={handleSave}
        >
          Save Current Query
        </button>
      </div>

      {presets.length === 0 ? (
        <p className="text-sm text-gray-400">No saved presets yet.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {presets.map((preset) => (
            <li key={preset.id} className="flex items-center justify-between border rounded px-2 py-1 text-sm">
              <span>{preset.name}</span>
              <div className="flex gap-2">
                <button className="text-blue-500" onClick={() => loadPreset(preset.id)}>
                  Load
                </button>
                <button className="text-red-500" onClick={() => deletePreset(preset.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}