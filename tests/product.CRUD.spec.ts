import { test, expect } from '../core/auth.fixture';
import { ProductService } from '../services/product.service';
import { allure } from 'allure-playwright';

import {
    addProductMutation,
    getProductQuery,
    updateProductMutation,
    deleteProductMutation,
} from '../Graph QL/product.queries';

test.describe('Product CRUD Operations', () => {

    test('validate product creation, retrieval, update and deletion', async ({ apiClient }) => {

        const productService = new ProductService(apiClient);
        let createdProductId: string;
        createdProductId = '416'; // Hardcoding product ID for testing purposes, as the API does not actually create products.


        // // Create Product
        // const createResponse = await productService.sendRequest(
        //     addProductMutation, {
        //         title: 'Just for automation testing',
        //         price: 100.20,
        //         description: 'A product created during automation testing',
        //         categoryId: 13,
        //         images: ['https://placeimg.com/640/480/any']
        //     }
        // );

        // console.log('Create Product Response Status:', createResponse.status());
        // console.log('Create Product Response Body:', await createResponse.json());
        // expect(createResponse.status()).toBe(200);

        // const createBody = await createResponse.json();
        // expect (createBody.data.addProduct).toBeDefined();
        // createdProductId = createBody.data.addProduct.id;
        // expect(createdProductId).toBeDefined();
        // console.log('Created Product ID:', createdProductId);

        // Get Product
        const getResponse = await productService.sendRequest(
            getProductQuery, { id: createdProductId }
        );

        const getBody = await getResponse.json();
        console.log('Get Product Response Status:', getResponse.status());
        console.log('Get Product Response Body:', getBody);
        expect(getBody.errors).toBeUndefined();
        expect(getBody.data.product.id).toBe(createdProductId);
        expect(getBody.data.product.title).toBe('Mediocre Concrete Bag 28effa');

        // Update Product
        const updateResponse = await productService.sendRequest(
            updateProductMutation, {
            id: createdProductId,
            title: 'This is an Updated Product Title',
            price: 150.50,
            images: ['https://placeimg.com/640/480/any']
        }
        );

        const updateBody = await updateResponse.json();
        console.log('Update Product Response Status:', updateResponse.status());
        console.log('Update Product Response Body:', updateBody);
        expect(updateBody.errors).toBeUndefined();
        expect(updateBody.data.updateProduct.id).toBe(createdProductId);
        expect(updateBody.data.updateProduct.title).toBe('This is an Updated Product Title');
        expect(updateBody.data.updateProduct.price).toBe(150.50);

        //Get Updated Product
        const getUpdatedResponse = await productService.sendRequest(
            getProductQuery, { id: createdProductId }
        );

        const getUpdatedBody = await getUpdatedResponse.json();
        console.log('Get Updated Product Response Status:', getUpdatedResponse.status());
        console.log('Get Updated Product Response Body:', getUpdatedBody);
        expect(getUpdatedBody.data.product.id).toBe(createdProductId);
        expect(getUpdatedBody.data.product.title).toBe('This is an Updated Product Title');

        // Delete Product
        const deleteResponse = await productService.sendRequest(
            deleteProductMutation, { id: createdProductId }
        );
        const deleteBody = await deleteResponse.json();
        console.log('Delete Product Response Status:', deleteResponse.status());
        console.log('Delete Product Response Body:', deleteBody);
        expect(deleteBody.errors).toBeUndefined();
        expect(deleteBody.data.deleteProduct).toBe(true);

        // Get Deleted Product
        const getDeletedResponse = await productService.sendRequest(
            getProductQuery, { id: createdProductId }
        );
        const getDeletedBody = await getDeletedResponse.json();
        console.log('Get Deleted Product Response Status:', getDeletedResponse.status());
        console.log('Get Deleted Product Response Body:', getDeletedBody);
        expect(getDeletedBody.errors).toBeDefined();
        expect(getDeletedBody.errors[0].message).toContain("Cannot destructure property 'url' of 'request' as it is undefined.");
    });

});

test.describe('Negative Tests for Product Operations', () => {

    test.only('Should return error for invalid product ID', async ({ apiClient }) => {

        allure.feature('Products');
        allure.story('Get Product - Negative Validation');
        allure.severity('normal');
        allure.owner('Harshit Ravi');
        allure.tag('regression');
        allure.tag('negative');

        const productService = new ProductService(apiClient);

        let invalidProductId: string;
        invalidProductId = '9999'; // Assuming this ID does not exist in the system for negative testing.

        await allure.step('Attempt to retrieve product with invalid ID and validate error response', async () => {
            const getResponse = await productService.sendRequest(
                getProductQuery, { id: invalidProductId }
            );
            const getBody = await getResponse.json();
            console.log('Get Product with Invalid ID Response Status:', getResponse.status());
            console.log('Get Product with Invalid ID Response Body:', getBody);

            await allure.step('Validate response status is 200 (GraphQL standard)', async () => {
                expect(getResponse.status()).toBe(200);
            });

            await allure.step('Validate GraphQL error exists', async () => {
                expect(getBody.errors).toBeDefined();
                expect(getBody.data).toBeNull();
            });

            await allure.step('Validate correct backend error message', async () => {
                expect(getBody.errors[0].message)
                    .toContain('Cannot destructure property');
            });

            await allure.step('Attach invalid product response', async () => {
                allure.attachment(
                    'Invalid Product Response',
                    JSON.stringify(getBody, null, 2),
                    'application/json'
                );
            });
        });
    });

        test('Should return error when trying to delete a non-existent product', async ({ apiClient }) => {
            const productService = new ProductService(apiClient);

            let nonExistentProductId: string;
            nonExistentProductId = '9999'; // Assuming this ID does not exist in the system for negative testing.

            const deleteResponse = await productService.sendRequest(
                deleteProductMutation, { id: nonExistentProductId }
            );
            const deleteBody = await deleteResponse.json();
            console.log('Delete Non-Existent Product Response Status:', deleteResponse.status());
            console.log('Delete Non-Existent Product Response Body:', deleteBody);
            expect(deleteBody.errors).toBeDefined();
            expect(deleteBody.errors[0].message).toContain("Cannot destructure property 'url' of 'request' as it is undefined.");
        });

        test('Should return error when trying to update a product with invalid data', async ({ apiClient }) => {
            const productService = new ProductService(apiClient);
            let createdProductId: string;
            createdProductId = '126'; // Using the same hardcoded product ID for testing purposes.
            const updateResponse = await productService.sendRequest(
                updateProductMutation, {
                id: createdProductId,
                title: '1212', // Invalid title
                price: -3.4, // Invalid price
                images: ['https://placeimg.com/640/480/any'] // Valid image URL to isolate the invalid fields for testing
            }
            );
            const updateBody = await updateResponse.json();
            console.log('Update Product with Invalid Data Response Status:', updateResponse.status());
            console.log('Update Product with Invalid Data Response Body:', updateBody);
            expect(updateBody.errors).toBeDefined();
            expect(updateBody.errors[0].message).toContain("Bad Request Exception");

        });

    });