import { test, expect, request } from '@playwright/test';
import { ProductService } from '../services/product.service';

test('validate basic test', async ({request}) => {

    const ProdutID = 'P123'
    const ProductQuantity = 10;

    async function getInventory(request: any, productId: string): Promise<any> {
        const response = await request.get(`http://localhost:3000/inventory/${productId}`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        return body.stock;
    }

    async function createOrder(request: any, productId: string, quantity: number): Promise<void> {
        const response = await request.post('http://localhost:3000/orders', {
            data: { 
                productId,
                quantity
            }
        });
        expect(response.status()).toBe(201);
        const BodyAfterOrder = await response.json();
    }

    const beforeStock = await getInventory(request, ProdutID);
    await createOrder(request, ProdutID, ProductQuantity);
    const updatedStock = await getInventory(request, ProdutID);

    try {
        expect(updatedStock).toBe(beforeStock - ProductQuantity);
    } catch (error) {
        console.error('Assertion failed:', error);
        throw error; // Rethrow to ensure the test fails
    }

}); 