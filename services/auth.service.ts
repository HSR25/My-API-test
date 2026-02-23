import { APIClient } from '../core/apiClient';

export class AuthService {
    constructor(private apiClient: APIClient) { }

    async login(payload: { email: string; password: string }) {
        return this.apiClient.getContext().post('/api/v1/auth/login', {
            data: payload
        });
    }

    async getProfile(token: string) {
        return this.apiClient.getContext().get('/api/v1/auth/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    async refreshToken(payload: { refreshToken: string }) {
        return this.apiClient.getContext().post(
            '/api/v1/auth/refresh-token',
            {
                data: payload
            }
        );
    }
}
