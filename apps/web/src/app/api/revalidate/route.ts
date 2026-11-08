import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

type RevalidateBody = {
  secret?: string;
  path?: string;
};

export async function POST(request: NextRequest) {
  // En producción exigimos un secreto configurado. Antes caía a un valor por
  // defecto conocido, lo que permitía a cualquiera invalidar rutas.
  const validSecret =
    process.env.REVALIDATION_SECRET ||
    (process.env.NODE_ENV !== 'production' ? 'local-dev-secret' : null);

  if (!validSecret) {
    return NextResponse.json(
      { message: 'Revalidation is not configured' },
      { status: 503 },
    );
  }

  let body: RevalidateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const { secret, path } = body;

  if (secret !== validSecret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json({ message: 'Path is required' }, { status: 400 });
  }

  revalidatePath(path);

  return NextResponse.json({ revalidated: true, path });
}
