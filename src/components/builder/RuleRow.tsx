"use client"

import { Rule } from "@/types/query"
import { Operator } from "@/types/operators"
import { ValidationError } from "@/types/validation"
import { useQueryStore } from "@/store/queryStore"
import { USER_SCHEMA } from "@/lib/schema/userSchema"
import { getOperatorsForField, getInputKindForField } from "@/lib/schema/schemaHelpers"

type RuleRowProps = {
  rule: Rule
  errors?: ValidationError[]
}

export function RuleRow({ rule, errors = [] }: RuleRowProps) {
  const { updateRule, removeNode } = useQueryStore()

  const operators = rule.field ? getOperatorsForField(USER_SCHEMA, rule.field) : []
  const inputKind = rule.field ? getInputKindForField(USER_SCHEMA, rule.field) : "text"
  const ruleErrors = errors.filter((e) => e.nodeId === rule.id)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 p-2 border rounded bg-white">
        <select
          className="border rounded px-2 py-1"
          value={rule.field}
          onChange={(e) => updateRule(rule.id, { field: e.target.value, operator: "equals", value: "" })}
        >
          <option value="">Select field</option>
          {USER_SCHEMA.map((field) => (
            <option key={field.name} value={field.name}>
              {field.label}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-2 py-1"
          value={rule.operator}
          disabled={!rule.field}
          onChange={(e) => updateRule(rule.id, { operator: e.target.value as Operator })}
        >
          {operators.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>

        {inputKind === "boolean" ? (
          <select
            className="border rounded px-2 py-1"
            value={String(rule.value)}
            onChange={(e) => updateRule(rule.id, { value: e.target.value === "true" })}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        ) : (
          <input
            type={inputKind === "number" ? "number" : inputKind === "date" ? "date" : "text"}
            className="border rounded px-2 py-1"
            value={String(rule.value)}
            onChange={(e) => updateRule(rule.id, { value: e.target.value })}
          />
        )}

        <button
          className="text-red-500 px-2"
          onClick={() => removeNode(rule.id)}
        >
          ✕
        </button>
      </div>

      {ruleErrors.map((err, i) => (
        <p key={i} className="text-xs text-red-500 ml-2">
          {err.message}
        </p>
      ))}
    </div>
  )
}