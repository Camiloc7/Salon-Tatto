'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Server Action para revalidar la caché de rutas o etiquetas específicas.
 * Esto permite limpiar la caché estática de Next.js inmediatamente tras hacer cambios en el admin.
 */

export async function clearCacheByTag(tag: string) {
  revalidateTag(tag);
}

export async function clearCacheByPath(path: string, type?: 'layout' | 'page') {
  revalidatePath(path, type);
}
