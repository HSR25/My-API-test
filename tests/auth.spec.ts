import { test, expect } from '../core/auth.fixture';
import { AuthService } from '../services/auth.service';
import { validateSchema } from '../utils/schemaValidator';
import { loginSchema } from '../schemas/login.schema';
import { profileSchema } from '../schemas/profile.schema';
import { validLoginCredentials, invalidLoginCredentials, validLoginCredentials2 } from '../testData/auth.data';

test.describe.serial('Authentication API - Regression Suite', () => {

  test('LOGIN - Should return valid access token', async ({ apiClient }) => {

    const authService = new AuthService(apiClient);

    const response = await authService.login(validLoginCredentials2);



    const body = await response.json();
    console.log('Login Response Body:', body);

        expect([200, 201]).toContain(response.status());

    expect(body.access_token).toBeDefined();
    expect(typeof body.access_token).toBe('string');

    const isValid = validateSchema(loginSchema, body);
    expect(isValid).toBe(true);
    validateSchema(loginSchema, body);
  });

  test('LOGIN - Invalid password should return 401', async ({ apiClient }) => {

    const authService = new AuthService(apiClient);

    const response = await authService.login(invalidLoginCredentials);

    expect(response.status()).toBe(401);
  });

  test('PROFILE - Should return user profile with valid token', async ({ apiClient }) => {

    const authService = new AuthService(apiClient);
    const loginResponse = await authService.login(validLoginCredentials2);
    const loginBody = await loginResponse.json();
    const authToken = loginBody.access_token;

    const response = await authService.getProfile(authToken);
    console.log('Profile Response Status:', response.status());

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Profile Response Body:', body);

    const isValid = validateSchema(profileSchema, body);
    expect(isValid).toBe(true);
  });

  test('PROFILE - Without token should return 401', async ({ apiClient }) => {

    const response = await apiClient
      .getContext()
      .get('/api/v1/auth/profile');

    expect(response.status()).toBe(401);
  });

});