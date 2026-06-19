import { Operator } from "./operators"

export type RuleValue = string | number | boolean | string[] | [number, number]

export type Rule = {
  id: string
  type: "rule"
  field: string
  operator: Operator
  value: RuleValue
}

export type LogicType = "AND" | "OR"

export type Group = {
  id: string
  type: "group"
  logic: LogicType
  children: QueryNode[]
}

export type QueryNode = Rule | Group