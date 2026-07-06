export const TASKS_RETURN = {
  returnTo: '/mentor/tasks',
  returnLabel: 'Back to tasks',
} as const

export type ReturnNavigationState = {
  returnTo?: string
  returnLabel?: string
}

export function resolveBackNavigation(
  state: unknown,
  defaultTo: string,
  defaultLabel: string
) {
  const nav = state as ReturnNavigationState | null
  return {
    to: nav?.returnTo ?? defaultTo,
    label: nav?.returnLabel ?? defaultLabel,
  }
}
