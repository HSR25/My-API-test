import { expect } from '@playwright/test';
import * as generateData from '../services/dataGenerator';
import { ProductService } from '../services/product.service';

export class ProductFlow {
    private createdProductId: string = '';

    constructor(
        private productData: generateData.ProductData,
        private updateData: generateData.UpdateProductData
    ) {}

    private assertNoErrors(body: any): void {
        expect(body.errors).toBeUndefined();
    }

    private assertErrorExists(body: any, message: string): void {
        expect(body.errors).toBeDefined();
        expect(body.errors[0].message).toContain(message);
    }

    private assertFields(actual: any, expected: any, fields: string[]): void {
        fields.forEach(field => {
            expect(actual[field]).toBe(expected[field]);
        });
    }

    private async executeAndLog(
        productService: ProductService,
        query: string,
        variables: any,
        operationName: string
    ) {
        const response = await productService.sendRequest(query, variables);
        const body = await response.json();
        console.log(`${operationName} Response Status:`, response.status());
        console.log(`${operationName} Response Body:`, body);
        return { response, body };
    }

    validateCreate(status: number, body: any): void {
        expect(status).toBe(200);
        this.assertNoErrors(body);
        this.assertFields(body.data.addProduct, this.productData, ['title', 'price']);
        this.createdProductId = body.data.addProduct.id;
    }

    validateGet(body: any): void {
        this.assertNoErrors(body);
        expect(body.data.product.id).toBe(this.createdProductId);
        this.assertFields(body.data.product, this.productData, ['title', 'price']);
    }

    validateUpdate(body: any): void {
        this.assertNoErrors(body);
        expect(body.data.updateProduct.id).toBe(this.createdProductId);
        this.assertFields(body.data.updateProduct, this.updateData, ['title', 'price']);
    }

    validateGetUpdated(body: any): void {
        this.assertNoErrors(body);
        expect(body.data.product.id).toBe(this.createdProductId);
        this.assertFields(body.data.product, this.updateData, ['title', 'price']);
    }

    validateDelete(body: any): void {
        this.assertNoErrors(body);
        expect(body.data.deleteProduct).toBe(true);
    }

    validateGetDeleted(body: any): void {
        this.assertErrorExists(body, "Cannot destructure property 'url' of 'request' as it is undefined.");
    }

    getCreatedProductId(): string {
        return this.createdProductId;
    }

    async executeCreate(productService: ProductService, mutation: string, variables: any): Promise<string> {
        const { response, body } = await this.executeAndLog(productService, mutation, variables, 'Create Product');
        this.validateCreate(response.status(), body);
        return this.createdProductId;
    }

    async executeGet(productService: ProductService, query: string): Promise<void> {
        const { body } = await this.executeAndLog(productService, query, { id: this.createdProductId }, 'Get Product');
        this.validateGet(body);
    }

    async executeUpdate(productService: ProductService, mutation: string, variables: any): Promise<void> {
        const { body } = await this.executeAndLog(
            productService,
            mutation,
            { id: this.createdProductId, ...variables },
            'Update Product'
        );
        this.validateUpdate(body);
    }

    async executeGetUpdated(productService: ProductService, query: string): Promise<void> {
        const { body } = await this.executeAndLog(productService, query, { id: this.createdProductId }, 'Get Updated Product');
        this.validateGetUpdated(body);
    }

    async executeDelete(productService: ProductService, mutation: string): Promise<void> {
        const { body } = await this.executeAndLog(productService, mutation, { id: this.createdProductId }, 'Delete Product');
        this.validateDelete(body);
    }

    async executeGetDeleted(productService: ProductService, query: string): Promise<void> {
        const { body } = await this.executeAndLog(productService, query, { id: this.createdProductId }, 'Get Deleted Product');
        this.validateGetDeleted(body);
    }
}