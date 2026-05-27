/**
 * React Query keys for shared entities.
 * Living here (entities layer) so both features/* (modals) and entities/* (CRUD hooks)
 * can reference them without violating FSD layering rules.
 */
export const usersQueryKey = ["users"] as const;
export const campaignsQueryKey = ["campaigns"] as const;
