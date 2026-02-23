import { request, APIRequestContext } from '@playwright/test';

export class APIClient {
  private context!: APIRequestContext;

  async init(baseURL: string) {
    this.context = await request.newContext({
      baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json'
      }
    });
  }

  getContext(): APIRequestContext {
    return this.context;
  }
}
