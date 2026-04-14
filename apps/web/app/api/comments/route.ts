import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

const apiBaseUrl = process.env.INTERNAL_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333';

function redirectToPost(request: Request, postId: string, params: Record<string, string>) {
  const url = new URL(`/posts/${postId}`, request.url);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const postId = String(formData.get('postId') ?? '').trim();
  const authorName = String(formData.get('authorName') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();

  if (!postId || body.length < 1 || (authorName.length > 0 && authorName.length < 2)) {
    return redirectToPost(request, postId, { error: 'Please add a nickname and comment before posting.' });
  }

  const response = await fetch(`${apiBaseUrl}/api/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ authorName, body }),
    cache: 'no-store'
  });

  if (!response.ok) {
    let message = 'Unable to publish your reply right now.';

    try {
      const payload = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(payload.message) && payload.message.length > 0) {
        message = payload.message[0];
      } else if (typeof payload.message === 'string') {
        message = payload.message;
      }
    } catch {
      // Keep fallback copy when the API response is not JSON.
    }

    return redirectToPost(request, postId, { error: message });
  }

  revalidatePath(`/posts/${postId}`);
  revalidatePath('/');
  return redirectToPost(request, postId, { success: '1' });
}
