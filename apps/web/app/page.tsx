import Link from 'next/link';

type Category = {
  id: number;
  slug: string;
  nameZh: string;
  nameEn: string;
};

type PostItem = {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  category: Category;
  user: {
    displayName: string;
  } | null;
  authorName: string | null;
  _count: {
    comments: number;
  };
};

const apiBaseUrl = process.env.INTERNAL_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333';

async function getCategories() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/categories`, { cache: 'no-store' });
    if (!response.ok) return [];
    return (await response.json()) as Category[];
  } catch {
    return [];
  }
}

async function getPosts() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/posts`, { cache: 'no-store' });
    if (!response.ok) return [];
    return (await response.json()) as PostItem[];
  } catch {
    return [];
  }
}

function formatPostTime(value: string) {
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}

function excerpt(value: string) {
  return value.length > 140 ? `${value.slice(0, 137)}...` : value;
}

function displayName(authorName: string | null | undefined, fallback: string | undefined) {
  return authorName?.trim() || fallback || 'Vic Guest';
}

function avatarLetter(name: string) {
  return name.slice(0, 1).toUpperCase();
}

export default async function HomePage({
  searchParams
}: {
  searchParams?: { error?: string; success?: string };
}) {
  const [categories, posts] = await Promise.all([getCategories(), getPosts()]);
  const errorMessage = searchParams?.error;
  const successMessage = searchParams?.success ? 'Your post is live.' : '';
  const featuredPosts = posts.slice(0, 8);

  return (
    <>
      <header className="site-header">
        <div className="site-shell header-inner">
          <div className="brand-lockup">
            <a href="/" className="brand-mark">
              Vic playground
            </a>
            <span className="brand-tagline">Victoria stories, tips, and outdoor finds</span>
          </div>
          <nav className="top-nav" aria-label="Primary">
            <a href="/">Home</a>
            <a href="#topics">Topics</a>
            <a href="#post-form">Post</a>
          </nav>
        </div>
      </header>

      <main className="site-shell page-grid">
        <section className="main-column">
          <section className="panel hero-panel">
            <div className="hero-copy">
              <h1>Vic playground = a place to share and explore</h1>
              <p>
                Anonymous posting is open for now. Share a trail note, pet-friendly stop, craft idea, or
                local event tip without waiting for Google auth.
              </p>
            </div>
            <div className="hero-actions">
              <a href="#post-form" className="action-link">
                Post a story
              </a>
              <span>{posts.length} community posts</span>
            </div>
          </section>

          <section className="panel tabs-panel" id="topics">
            <div className="tabs-heading">Popular nodes</div>
            <div className="tab-list">
              {categories.map((category) => (
                <a key={category.id} href={`#category-${category.slug}`} className="tab-pill">
                  {category.nameZh}
                </a>
              ))}
            </div>
          </section>

          <section className="panel composer-panel" id="post-form">
            <div className="section-head">
              <h2>Post something now</h2>
              <span>No sign-in required</span>
            </div>

            {errorMessage ? <p className="form-message form-message-error">{errorMessage}</p> : null}
            {successMessage ? <p className="form-message form-message-success">{successMessage}</p> : null}

            <form action="/api/posts" method="post" className="story-form">
              <div className="form-row">
                <label className="field field-compact">
                  <span>Node</span>
                  <select name="categoryId" defaultValue={categories[0]?.id ?? ''} required>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nameZh} / {category.nameEn}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field field-wide">
                  <span>Title</span>
                  <input
                    name="title"
                    type="text"
                    minLength={3}
                    maxLength={120}
                    placeholder="Best sunset walk in Esquimalt"
                    required
                  />
                </label>
              </div>

              <label className="field">
                <span>Content</span>
                <textarea
                  name="body"
                  minLength={3}
                  maxLength={4000}
                  rows={5}
                  placeholder="Share the route, timing, what to bring, and anything a first-time visitor should know."
                  required
                />
              </label>

              <div className="composer-footer">
                <span>Posts are published as Vic Guest for now.</span>
                <button type="submit" className="submit-button" disabled={categories.length === 0}>
                  Publish anonymously
                </button>
              </div>
            </form>
          </section>

          <section className="panel topics-panel">
            <div className="section-head">
              <h2>Latest topics</h2>
              <span>{posts.length} topics</span>
            </div>

            {posts.length === 0 ? (
              <div className="empty-state">
                <h3>No stories yet</h3>
                <p>Be the first person to add a Victoria trail note, pet stop, or local recommendation.</p>
              </div>
            ) : (
              <div className="topic-list">
                {posts.map((post) => (
                  <article key={post.id} className="topic-row" id={`category-${post.category.slug}`}>
                    <div className="topic-avatar" aria-hidden="true">
                      {avatarLetter(displayName(post.authorName, post.user?.displayName))}
                    </div>
                    <div className="topic-content">
                      <div className="topic-title-row">
                        <Link href={`/posts/${post.id}`} className="topic-title">
                          {post.title}
                        </Link>
                        <span className="reply-chip">{post._count.comments}</span>
                      </div>
                      <p className="topic-excerpt">{excerpt(post.body)}</p>
                      <div className="topic-meta">
                        <a href={`#category-${post.category.slug}`} className="node-link">
                          {post.category.nameEn}
                        </a>
                        <span>•</span>
                        <span>{displayName(post.authorName, post.user?.displayName)}</span>
                        <span>•</span>
                        <span>{formatPostTime(post.createdAt)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>

        <aside className="sidebar-column">
          <section className="panel sidebar-panel">
            <div className="sidebar-title">Vic playground</div>
            <p className="sidebar-copy">A simple board for Victoria residents to trade outdoor notes and local discoveries.</p>
            <a href="#post-form" className="sidebar-button">
              Create a topic
            </a>
          </section>

          <section className="panel sidebar-panel">
            <div className="sidebar-title">Community status</div>
            <dl className="stats-list">
              <div>
                <dt>Nodes</dt>
                <dd>{categories.length}</dd>
              </div>
              <div>
                <dt>Topics</dt>
                <dd>{posts.length}</dd>
              </div>
              <div>
                <dt>Latest sample</dt>
                <dd>{featuredPosts[0]?.category.nameZh ?? 'Ready'}</dd>
              </div>
            </dl>
          </section>

          <section className="panel sidebar-panel">
            <div className="sidebar-title">Recent nodes</div>
            <div className="sidebar-links">
              {categories.map((category) => (
                <a key={category.id} href={`#category-${category.slug}`}>
                  {category.nameZh}
                </a>
              ))}
            </div>
          </section>

          <section className="panel sidebar-panel">
            <div className="sidebar-title">Posting guide</div>
            <ul className="sidebar-list">
              <li>Keep titles short and specific.</li>
              <li>Share real locations, timing, and useful details.</li>
              <li>No login needed until auth is ready.</li>
            </ul>
          </section>
        </aside>
      </main>
    </>
  );
}
