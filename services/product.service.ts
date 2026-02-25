import { APIClient } from "../core/apiClient";

export class ProductService {
    constructor(private apiClient: APIClient) { }

    async sendRequest(query: string, variables?: any) {
        return this.apiClient.getContext().post('/graphql', {
            data:{ 
            query,
            variables
            }
        });
    }
}

