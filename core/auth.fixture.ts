import { test as base } from '@playwright/test';
import { APIClient } from './apiClient';
import { AuthService } from '../services/auth.service';
import { validLoginCredentials, validLoginCredentials2 } from '../testData/auth.data';

type AuthFixtures = {
  apiClient: APIClient;
  accessToken: string;
  refreshToken: string;
};

export const test = base.extend<AuthFixtures>({
  apiClient: async ({}, use) => {
    const client = new APIClient();
    await client.init('https://api.escuelajs.co');
    await use(client);
  },

  accessToken: async ({ apiClient }, use) => {
    const authService = new AuthService(apiClient);

    const response = await authService.login(validLoginCredentials);
    const body = await response.json();

    await use(body.access_token);
  },

  refreshToken: async ({ apiClient }, use) => {
    const authService = new AuthService(apiClient);

    const response = await authService.login(validLoginCredentials);
    const body = await response.json();

    await use(body.refresh_token);
  }
});

export const expect = base.expect;

