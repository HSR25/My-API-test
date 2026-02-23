import { test, expect } from '../core/auth.fixture';
import { AuthService } from '../services/auth.service';

test.describe('Refresh Token Validation', () => {

  test('Should refresh token and generate new access token', async ({
    apiClient,
    accessToken,
    refreshToken
  }) => {

    const authService = new AuthService(apiClient);

    // Step 1: Call refresh token API
    const refreshResponse = await authService.refreshToken({
      refreshToken: refreshToken
    });

    expect(refreshResponse.status()).toBe(201);

    const refreshBody = await refreshResponse.json();

    const newAccessToken = refreshBody.access_token;
    const newRefreshToken = refreshBody.refresh_token;

    // Step 2: Validate new token is generated
    expect(newAccessToken).toBeDefined();
    expect(newAccessToken).not.toBe(accessToken);

    expect(newRefreshToken).toBeDefined();
    expect(newRefreshToken).not.toBe(refreshToken);

    // Step 3: Validate new access token actually works
    const profileResponse = await authService.getProfile(newAccessToken);

    expect(profileResponse.status()).toBe(200);
  });

});
