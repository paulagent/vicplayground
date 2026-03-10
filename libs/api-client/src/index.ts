export interface ApiClientOptions {
  baseUrl: string;
}

export class ApiClient {
  constructor(private readonly options: ApiClientOptions) {}

  async getPosts() {
    const response = await fetch(`${this.options.baseUrl}/api/posts`, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  }
}
