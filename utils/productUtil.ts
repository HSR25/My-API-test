import { expect } from '@playwright/test';
import * as generateData from '../services/dataGenerator';
import { ProductService } from '../services/product.service';

export class ProductFlow {
    private createdProductId: string = '';

    constructor(
        private productData: generateData.ProductData,
        private updateData: generateData.UpdateProductData
    ) {}

    validateCreate(status: number, body: any): void {
        expect(status).toBe(200);
        expect(body.errors).toBeUndefined();
        expect(body.data.addProduct.title).toBe(this.productData.title);
        expect(body.data.addProduct.price).toBe(this.productData.price);
        this.createdProductId = body.data.addProduct.id;
    }

    validateGet(body: any): void {
        expect(body.errors).toBeUndefined();
        expect(body.data.product.id).toBe(this.createdProductId);
        expect(body.data.product.title).toBe(this.productData.title);
        expect(body.data.product.price).toBe(this.productData.price);
    }

    validateUpdate(body: any): void {
        expect(body.errors).toBeUndefined();
        expect(body.data.updateProduct.id).toBe(this.createdProductId);
        expect(body.data.updateProduct.title).toBe(this.updateData.title);
        expect(body.data.updateProduct.price).toBe(this.updateData.price);
    }

    validateGetUpdated(body: any): void {
        expect(body.errors).toBeUndefined();
        expect(body.data.product.id).toBe(this.createdProductId);
        expect(body.data.product.title).toBe(this.updateData.title);
        expect(body.data.product.price).toBe(this.updateData.price);
    }

    validateDelete(body: any): void {
        expect(body.errors).toBeUndefined();
        expect(body.data.deleteProduct).toBe(true);
    }

    validateGetDeleted(body: any): void {
        expect(body.errors).toBeDefined();
        expect(body.errors[0].message).toContain("Cannot destructure property 'url' of 'request' as it is undefined.");
    }

    getCreatedProductId(): string {
        return this.createdProductId;
    }

    async executeCreate(productService: ProductService, mutation: string, variables: any): Promise<string> {
        const response = await productService.sendRequest(mutation, variables);
        const body = await response.json();
        console.log('Create Product Response Status:', response.status());
        console.log('Create Product Response Body:', body);
        this.validateCreate(response.status(), body);
        return this.createdProductId;
    }

    async executeGet(productService: ProductService, query: string): Promise<void> {
        const response = await productService.sendRequest(query, { id: this.createdProductId });
        const body = await response.json();
        console.log('Get Product Response Status:', response.status());
        console.log('Get Product Response Body:', body);
        this.validateGet(body);
    }

    async executeUpdate(productService: ProductService, mutation: string, variables: any): Promise<void> {
        const response = await productService.sendRequest(mutation, {
            id: this.createdProductId,
            ...variables
        });
        const body = await response.json();
        console.log('Update Product Response Status:', response.status());
        console.log('Update Product Response Body:', body);
        this.validateUpdate(body);
    }

    async executeGetUpdated(productService: ProductService, query: string): Promise<void> {
        const response = await productService.sendRequest(query, { id: this.createdProductId });
        const body = await response.json();
        console.log('Get Updated Product Response Status:', response.status());
        console.log('Get Updated Product Response Body:', body);
        this.validateGetUpdated(body);
    }

    async executeDelete(productService: ProductService, mutation: string): Promise<void> {
        const response = await productService.sendRequest(mutation, { id: this.createdProductId });
        const body = await response.json();
        console.log('Delete Product Response Status:', response.status());
        console.log('Delete Product Response Body:', body);
        this.validateDelete(body);
    }

    async executeGetDeleted(productService: ProductService, query: string): Promise<void> {
        const response = await productService.sendRequest(query, { id: this.createdProductId });
        const body = await response.json();
        console.log('Get Deleted Product Response Status:', response.status());
        console.log('Get Deleted Product Response Body:', body);
        this.validateGetDeleted(body);
    }}