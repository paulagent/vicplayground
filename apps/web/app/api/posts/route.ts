import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

const apiBaseUrl = process.env.INTERNAL_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333';

function redirectToHome(request: Request, params: Record<string, string>) {
  const url = new URL('/', request.url);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const categoryId = Number(formData.get('categoryId'));
  const title = String(formData.get('title') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();

  if (!Number.isInteger(categoryId) || title.length < 3 || body.length < 3) {
    return redirectToHome(request, { error: 'Please fill out all fields before posting.' });
  }

  const response = await fetch(`${apiBaseUrl}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ categoryId, title, body }),
    cache: 'no-store'
  });

  if (!response.ok) {
    let message = 'Unable to publish your story right now.';

    try {
      const payload = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(payload.message) && payload.message.length > 0) {
        message = payload.message[0];
      } else if (typeof payload.message === 'string') {
        message = payload.message;
      }
    } catch {
      // Keep the fallback message when the API response is not JSON.
    }

    return redirectToHome(request, { error: message });
  }

  revalidatePath('/');
  return redirectToHome(request, { success: '1' });
}
