import Link from 'next/link';
import { notFound } from 'next/navigation';

type Category = {
  id: number;
  slug: string;
  nameZh: string;
  nameEn: string;
};

type CommentItem = {
  id: number;
  authorName: string | null;
  body: string;
  createdAt: string;
  user: {
    displayName: string;
  } | null;
};

type PostItem = {
  id: number;
  title: string;
  body: string;
  authorName: string | null;
  createdAt: string;
  category: Category;
  user: {
    displayName: string;
  } | null;
  comments: CommentItem[];
  _count: {
    comments: number;
  };
};

const apiBaseUrl = process.env.INTERNAL_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333';

function formatPostTime(value: string) {
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}

function displayName(authorName: string | null | undefined, fallback: string | undefined) {
  return authorName?.trim() || fallback || 'Vic Guest';
}

function avatarLetter(name: string) {
  return name.slice(0, 1).toUpperCase();
}

async function getPost(id: string) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/posts/${id}`, { cache: 'no-store' });
    if (response.status === 404) return null;
    if (!response.ok) return null;
    return (await response.json()) as PostItem;
  } catch {
    return null;
  }
}

export default async function PostDetailPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { error?: string; success?: string };
}) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  const postAuthor = displayName(post.authorName, post.user?.displayName);

  return (
    <>
      <header className="site-header">
        <div className="site-shell header-inner">
          <div className="brand-lockup">
            <Link href="/" className="brand-mark">
              Vic playground
            </Link>
            <span className="brand-tagline">Victoria stories, tips, and outdoor finds</span>
          </div>
          <nav className="top-nav" aria-label="Primary">
            <Link href="/">Home</Link>
            <a href="#reply-form">Reply</a>
          </nav>
        </div>
      </header>

      <main className="site-shell page-grid">
        <section className="main-column">
          <article className="panel detail-panel">
            <div className="detail-meta">
              <Link href="/" className="node-link">
                {post.category.nameEn}
              </Link>
              <span>•</span>
              <span>{postAuthor}</span>
              <span>•</span>
              <span>{formatPostTime(post.createdAt)}</span>
            </div>
            <h1 className="detail-title">{post.title}</h1>
            <div className="detail-body">{post.body}</div>
          </article>

          <section className="panel comments-panel">
            <div className="section-head">
              <h2>{post._count.comments} replies</h2>
              <span>Anonymous replies are open</span>
            </div>

            {post.comments.length === 0 ? (
              <div className="empty-state">
                <h3>No replies yet</h3>
                <p>Start the discussion with a local tip or follow-up question.</p>
              </div>
            ) : (
              <div className="comment-list">
                {post.comments.map((comment) => {
                  const name = displayName(comment.authorName, comment.user?.displayName);

                  return (
                    <article key={comment.id} className="comment-row">
                      <div className="topic-avatar">{avatarLetter(name)}</div>
                      <div className="comment-content">
                        <div className="topic-meta">
                          <span>{name}</span>
                          <span>•</span>
                          <span>{formatPostTime(comment.createdAt)}</span>
                        </div>
                        <p className="comment-body">{comment.body}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="panel composer-panel" id="reply-form">
            <div className="section-head">
              <h2>Reply to this topic</h2>
              <span>No sign-in required</span>
            </div>

            {searchParams?.error ? <p className="form-message form-message-error">{searchParams.error}</p> : null}
            {searchParams?.success ? <p className="form-message form-message-success">Your reply is live.</p> : null}

            <form action="/api/comments" method="post" className="story-form">
              <input type="hidden" name="postId" value={String(post.id)} />
              <div className="form-row">
                <label className="field field-compact">
                  <span>Nickname</span>
                  <input name="authorName" type="text" minLength={2} maxLength={40} placeholder="HarbourWalker" />
                </label>
              </div>
              <label className="field">
                <span>Reply</span>
                <textarea name="body" minLength={1} maxLength={1200} rows={5} placeholder="Add a useful follow-up, route detail, or question." required />
              </label>
              <div className="composer-footer">
                <span>Leave nickname blank to post as Vic Guest.</span>
                <button type="submit" className="submit-button">
                  Publish reply
                </button>
              </div>
            </form>
          </section>
        </section>

        <aside className="sidebar-column">
          <section className="panel sidebar-panel">
            <div className="sidebar-title">Topic info</div>
            <dl className="stats-list">
              <div>
                <dt>Node</dt>
                <dd>{post.category.nameZh}</dd>
              </div>
              <div>
                <dt>Replies</dt>
                <dd>{post._count.comments}</dd>
              </div>
              <div>
                <dt>Author</dt>
                <dd>{postAuthor}</dd>
              </div>
            </dl>
          </section>

          <section className="panel sidebar-panel">
            <div className="sidebar-title">Navigation</div>
            <div className="sidebar-links">
              <Link href="/">Back to index</Link>
              <a href="#reply-form">Reply to topic</a>
            </div>
          </section>
        </aside>
      </main>
    </>
  );
}
