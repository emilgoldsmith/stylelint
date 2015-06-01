import {
  ruleMessages,
  isSingleLineString
} from "../../utils"

export const ruleName = "rule-set-non-nested-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before non-nested rule set",
  rejected: "Unexpected empty line before non-nested rule set",
})

/**
 * @param {"always"|"never"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  return (root, result) => {
    root.eachRule(rule => {

      // Ignore nested rule sets
      if (rule.parent !== root) { return }

      // Ignore the first node
      if (rule === root.first) { return }

      checkRuleEmptyLineBefore(rule, expectation, result, messages)
    })
  }
}

export function checkRuleEmptyLineBefore(rule, expectation, result, msgs) {

  const expectEmptyLine = (expectation === "always"
    || expectation === "always-multi-line" && !isSingleLineString(rule.toString()))

  const rejectEmptyLine = (expectation === "never"
    || expectation === "never-multi-line" && !isSingleLineString(rule.toString()))

  const emptyLineBefore = rule.before.indexOf("\n\n") !== -1

  if (expectEmptyLine && !emptyLineBefore) {
    result.warn(msgs.expected, { node: rule })
  }
  if (rejectEmptyLine && emptyLineBefore) {
    result.warn(msgs.rejected, { node: rule })
  }
}
