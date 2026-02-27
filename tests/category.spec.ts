import { test, expect } from '../core/auth.fixture';
import { CategoryService } from '../services/category.service';
import * as generateData from '../services/dataGenerator';
import { CategoryFlow } from '../utils/categoryUtil';
import * as categoryQueries from '../Graph QL/ceategory.queries';

test.describe.only('Category CRUD Operations', () => {
    let categoryService: CategoryService;
    let categoryData: generateData.CategoryData;
    let updateData: generateData.UpdateCategoryData;
    let categoryFlow: CategoryFlow;

    test.beforeEach(async ({ apiClient }) => {
        categoryService = new CategoryService(apiClient);
        categoryData = generateData.generateCategoryData();
        updateData = generateData.generateUpdateCategoryData();
        categoryFlow = new CategoryFlow(categoryData, updateData);
    });

    test('validate category creation, retrieval, update and deletion @sanity', async ({ apiClient }) => {

        // Create Category
        const createdCategoryId = await categoryFlow.executeCreate(categoryService, categoryQueries.addCategoryMutation, categoryData);
        console.log('Created Category ID:', createdCategoryId);

        // Get Category
        await categoryFlow.executeGet(categoryService, categoryQueries.getCategoriesQuery);

        // Update Category
        await categoryFlow.executeUpdate(categoryService, categoryQueries.updateCategoryMutation, updateData);

        // Get Updated Category
        await categoryFlow.executeGetUpdated(categoryService, categoryQueries.getCategoriesQuery);

        // Delete Category
        await categoryFlow.executeDelete(categoryService, categoryQueries.deleteCategoryMutation);

        // Get Deleted Category
        await categoryFlow.executeGetDeleted(categoryService, categoryQueries.getCategoriesQuery);
    });

});