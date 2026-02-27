import { expect } from '@playwright/test';
import * as generateData from '../services/dataGenerator';
import { CategoryService } from '../services/category.service';

export class CategoryFlow {
    private createdCategoryId: string = '';

    constructor(
        private categoryData: generateData.CategoryData,
        private updateData: generateData.UpdateCategoryData
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
        categoryService: CategoryService,
        query: string,
        variables: any,
        operationName: string
    ) {
        const response = await categoryService.sendRequest(query, variables);
        const body = await response.json();
        console.log(`${operationName} Response Status:`, response.status());
        console.log(`${operationName} Response Body:`, body);
        return { response, body };
    }

    validateCreate(status: number, body: any): void {
        expect(status).toBe(200);
        this.assertNoErrors(body);
        this.assertFields(body.data.addCategory, this.categoryData, ['name', 'image']);
        this.createdCategoryId = body.data.addCategory.id;
    }

    validateGet(body: any): void {
        this.assertNoErrors(body);
        expect(body.data.category.id).toBe(this.createdCategoryId);
        this.assertFields(body.data.category, this.categoryData, ['name', 'image']);
    }

    validateUpdate(body: any): void {
        this.assertNoErrors(body);
        expect(body.data.updateCategory.id).toBe(this.createdCategoryId);
        this.assertFields(body.data.updateCategory, this.updateData, ['name']);
    }

    validateGetUpdated(body: any): void {
        this.assertNoErrors(body);
        expect(body.data.category.id).toBe(this.createdCategoryId);
        this.assertFields(body.data.category, this.updateData, ['name']);
    }

    validateDelete(body: any): void {
        this.assertNoErrors(body);
        expect(body.data.deleteCategory).toBe(true);
    }

    validateGetDeleted(body: any): void {
        this.assertErrorExists(body, "Cannot destructure property 'url' of 'request' as it is undefined.");
    }

    getCreatedCategoryId(): string {
        return this.createdCategoryId;
    }

    async executeCreate(categoryService: CategoryService, mutation: string, variables: any): Promise<string> {
        const { response, body } = await this.executeAndLog(categoryService, mutation, variables, 'Create Category');
        this.validateCreate(response.status(), body);
        return this.createdCategoryId;
    }

    async executeGet(categoryService: CategoryService, query: string): Promise<void> {
        const { body } = await this.executeAndLog(categoryService, query, { id: this.createdCategoryId }, 'Get Category');
        this.validateGet(body);
    }

    async executeUpdate(categoryService: CategoryService, mutation: string, variables: any): Promise<void> {
        const { body } = await this.executeAndLog(
            categoryService,
            mutation,
            { id: this.createdCategoryId, ...variables },
            'Update Category'
        );
        this.validateUpdate(body);
    }

    async executeGetUpdated(categoryService: CategoryService, query: string): Promise<void> {
        const { body } = await this.executeAndLog(categoryService, query, { id: this.createdCategoryId }, 'Get Updated Category');
        this.validateGetUpdated(body);
    }

    async executeDelete(categoryService: CategoryService, mutation: string): Promise<void> {
        const { body } = await this.executeAndLog(categoryService, mutation, { id: this.createdCategoryId }, 'Delete Category');
        this.validateDelete(body);
    }

    async executeGetDeleted(categoryService: CategoryService, query: string): Promise<void> {
        const { body } = await this.executeAndLog(categoryService, query, { id: this.createdCategoryId }, 'Get Deleted Category');
        this.validateGetDeleted(body);
    }
}
