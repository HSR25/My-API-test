import { test, expect } from '../core/auth.fixture';
import { CategoryService } from '../services/category.service';
import { categoryCreateData, categoryUpdateData } from '../testData/category.data';
import { validateCategorySchema } from '../utils/categorySchemavalidator';
import { createCategorySchema,
    updateCategorySchema,
    getCategoriesSchema,
    deleteCategorySchema
} from '../schemas/category.schema';

import {
    getCategoriesQuery,
    addCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation
} from '../Graph QL/ceategory.queries';
import { validateSchema } from '../utils/schemaValidator';

test.describe.serial('Category CRUD Operations', () => {
    let createdCategoryId: string;

    test('validate category creation, retrieval, update and deletion', async ({ apiClient }) => {
        const categoryService = new CategoryService(apiClient);

        // Create Category
        const createResponse = await categoryService.sendRequest(
            addCategoryMutation, { name: categoryCreateData.name, image: categoryCreateData.image }
        );
        console.log('Create Category Response Status:', createResponse.status());
        console.log('Create Category Response Body:', await createResponse.json());

        expect(createResponse.status()).toBe(200);

        const createBody = await createResponse.json();
        expect(createBody.data.addCategory).toBeDefined();
        createdCategoryId = createBody.data?.addCategory?.id;
        expect(createdCategoryId).toBeDefined();

        validateCategorySchema(createCategorySchema, createBody);
        if (validateSchema(createCategorySchema, createBody)) {
            console.log('Response schema validation passed for category creation');
        } else {
            console.error('Response schema validation failed for category creation');
        }
    
        expect(createBody.data.addCategory.name).toBe(categoryCreateData.name);
        expect(createBody.data.addCategory.image).toBe(categoryCreateData.image);
        console.log('Created Category ID:', createdCategoryId);
    });

    // Get Category
    test('Should retrieve the created category', async ({ apiClient }) => {

        const categoryService = new CategoryService(apiClient);
        const getResponse = await categoryService.sendRequest(
            getCategoriesQuery, { id: createdCategoryId }
        );
        console.log('Get Category Response Status:', getResponse.status());
        console.log('Get Category Response Body:', await getResponse.json());
        expect(getResponse.status()).toBe(200);
        const getBody = await getResponse.json();
        expect(getBody.data.category.id).toBe(createdCategoryId);
        expect(getBody.data.category.name).toBe(categoryCreateData.name);
        expect(getBody.data.category.image).toBe(categoryCreateData.image);
        validateCategorySchema(getCategoriesSchema, getBody);
    });

    // Update Category
    test('Should update the created category', async ({ apiClient }) => {
        const categoryService = new CategoryService(apiClient);
        const updateResponse = await categoryService.sendRequest(
            updateCategoryMutation, {
            id: createdCategoryId,
            name: categoryUpdateData.name,
            image: categoryUpdateData.image
        }
        );
        console.log('Update Category Response Status:', updateResponse.status());
        console.log('Update Category Response Body:', await updateResponse.json());
        expect(updateResponse.status()).toBe(200);
        const updateBody = await updateResponse.json();
        expect(updateBody.data.updateCategory.id).toBe(createdCategoryId);
        expect(updateBody.data.updateCategory.name).toBe(categoryUpdateData.name);
        expect(updateBody.data.updateCategory.image).toBe(categoryUpdateData.image);
        validateCategorySchema(updateCategorySchema, updateBody);
    });

    // Delete Category
    test('Should delete the created category', async ({ apiClient }) => {
        const categoryService = new CategoryService(apiClient);
        const deleteResponse = await categoryService.sendRequest(
            deleteCategoryMutation, { id: createdCategoryId }
        );
        console.log('Delete Category Response Status:', deleteResponse.status());
        console.log('Delete Category Response Body:', await deleteResponse.json());
        expect(deleteResponse.status()).toBe(200);
        const deleteBody = await deleteResponse.json();
        expect(deleteBody.data.deleteCategory).toBe(true);
        validateCategorySchema(deleteCategorySchema, deleteBody);
    });

    test('Should return error when trying to retrieve deleted category', async ({ apiClient }) => {
        const categoryService = new CategoryService(apiClient);
        const getResponse = await categoryService.sendRequest(
            getCategoriesQuery, { id: createdCategoryId }
        );
        console.log('Get Deleted Category Response Status:', getResponse.status());
        console.log('Get Deleted Category Response Body:', await getResponse.json());
        expect(getResponse.status()).toBe(200);
        const getBody = await getResponse.json();
        expect(getBody.data).toBeNull();
        expect(getBody.errors).toBeDefined();
    });

    test('Should return error when trying to update deleted category', async ({ apiClient }) => {
        const categoryService = new CategoryService(apiClient);
        const updateResponse = await categoryService.sendRequest(
            updateCategoryMutation, {
            id: createdCategoryId,  
            name: categoryUpdateData.name,
            image: categoryUpdateData.image
        } 
        );
        console.log('Update Deleted Category Response Status:', updateResponse.status());
        console.log('Update Deleted Category Response Body:', await updateResponse.json());
        expect(updateResponse.status()).toBe(200);
        const updateBody = await updateResponse.json();
        expect(updateBody.data.updateCategory).toBeNull();
        expect(updateBody.errors).toBeDefined();
    });

    test('Should return error when trying to delete already deleted category', async ({ apiClient }) => {   
        const categoryService = new CategoryService(apiClient);
        const deleteResponse = await categoryService.sendRequest(
            deleteCategoryMutation, { id: createdCategoryId }
        );
        console.log('Delete Already Deleted Category Response Status:', deleteResponse.status());
        console.log('Delete Already Deleted Category Response Body:', await deleteResponse.json());
        expect(deleteResponse.status()).toBe(200);
        const deleteBody = await deleteResponse.json();
        expect(deleteBody.data.deleteCategory).toBe(false);
        expect(deleteBody.errors).toBeDefined();
    });

    test('Should return error when trying to create category with missing fields', async ({ apiClient }) => {       
        const categoryService = new CategoryService(apiClient); 
        const createResponse = await categoryService.sendRequest(
            addCategoryMutation, { name: categoryCreateData.name } // Missing image field
        );
        console.log('Create Category with Missing Fields Response Status:', createResponse.status());   
        console.log('Create Category with Missing Fields Response Body:', await createResponse.json());
        expect(createResponse.status()).toBe(200);
        const createBody = await createResponse.json();
        expect(createBody.data.addCategory).toBeNull();
        expect(createBody.errors).toBeDefined();
    });
        
    test('Should return error when trying to create category with invalid data types', async ({ apiClient }) => {   
        const categoryService = new CategoryService(apiClient);

        const createResponse = await categoryService.sendRequest(   
            addCategoryMutation, { name: 12345, image: 'not-a-url' } // Invalid data types  
        );
        console.log('Create Category with Invalid Data Types Response Status:', createResponse.status());
        console.log('Create Category with Invalid Data Types Response Body:', await createResponse.json());
        expect(createResponse.status()).toBe(200);
        const createBody = await createResponse.json();
        expect(createBody.data.addCategory).toBeNull();
        expect(createBody.errors).toBeDefined();
    }); 
});