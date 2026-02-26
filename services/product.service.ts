import { APIClient } from "../core/apiClient";

export class ProductService {
  constructor(private apiClient: APIClient) {}

  async sendRequest(query: string, variables?: any) {
    const context = this.apiClient.getContext();
    if (!context) {
      throw new Error("APIClient context is not initialized");
    }
    return context.post("/graphql", {
      data: {
        query,
        variables,
      },
    });
  }
}
