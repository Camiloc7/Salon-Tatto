export const ROLES = ['admin', 'editor'] as const;
export type RoleName = (typeof ROLES)[number];

export const ROLE_HIERARCHY: Record<RoleName, number> = {
  admin: 100,
  editor: 50,
};

export const ROLE_PERMISSIONS: Record<RoleName, string[]> = {
  admin: ['*'],
  editor: ['content:read', 'content:write', 'content:publish', 'seo:read', 'seo:write'],
};
