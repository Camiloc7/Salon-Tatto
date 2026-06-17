export const ROLES = {
  ADMIN: 'admin',
  ARTIST: 'artist',
  USER: 'user',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  CREATE_ARTIST: 'create:artist',
  UPDATE_ARTIST: 'update:artist',
  DELETE_ARTIST: 'delete:artist',
  CREATE_BLOG: 'create:blog',
  UPDATE_BLOG: 'update:blog',
  DELETE_BLOG: 'delete:blog',
  MANAGE_SETTINGS: 'manage:settings',
  MANAGE_USERS: 'manage:users',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ARTIST]: [
    PERMISSIONS.CREATE_ARTIST,
    PERMISSIONS.UPDATE_ARTIST,
    PERMISSIONS.CREATE_BLOG,
    PERMISSIONS.UPDATE_BLOG,
  ],
  [ROLES.USER]: [],
};

export const PAGINATION_DEFAULT_LIMIT = 20;
export const PAGINATION_MAX_LIMIT = 100;
