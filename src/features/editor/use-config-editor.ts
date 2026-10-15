"use client"

import { useState } from "react"
import type { AnimationConfig } from "@/features/animations/model"
import { changedFields, type FieldValue, updateConfigField } from "./editor-state"

/** Holds an editable copy of a preset config. Invalid updates are ignored. */
export function useConfigEditor(initial: AnimationConfig) {
  const [config, setConfig] = useState(initial)

  function setField(key: string, value: FieldValue) {
    setConfig((current) => {
      const result = updateConfigField(current, key, value)
      return result.success ? result.config : current
    })
  }

  return {
    config,
    setField,
    reset: () => setConfig(initial),
    changed: changedFields(config, initial),
  }
}
