import { test, expect } from '../core/auth.fixture';
import { ProductService } from '../services/product.service';
import * as generateData from '../services/dataGenerator';
import { ProductFlow } from '../utils/productUtil';
import * as productQeries from '../Graph QL/product.queries';
import { CategoryService } from '../services/category.service';
import * as categoryQueries from '../Graph QL/ceategory.queries';
import { CategoryFlow } from '../utils/categoryUtil';

test.describe.only('Product CRUD Operations', () => {
    let productService: ProductService;
    let productData: generateData.ProductData;
    let updateData: generateData.UpdateProductData;
    let Productflow: ProductFlow;
    let categoryService: CategoryService;
    let categoryData: generateData.CategoryData;
    let categoryFlow: CategoryFlow;

    test.beforeEach(async ({ apiClient }) => {
        productService = new ProductService(apiClient);
        categoryService = new CategoryService(apiClient);
        categoryData = generateData.generateCategoryData();
        updateData = generateData.generateUpdateProductData();
        categoryFlow = new CategoryFlow(categoryData, generateData.generateUpdateCategoryData());
    });

    test('validate product creation, retrieval, update and deletion  @sanity', async ({ apiClient }) => {

        // Create Category for Product
        const createdCategoryId = await categoryFlow.executeCreate(categoryService, categoryQueries.addCategoryMutation, categoryData);
        console.log('Created Category ID:', createdCategoryId);

        // Generate product data with the created category ID
        productData = generateData.generateProductData(createdCategoryId);
        Productflow = new ProductFlow(productData, updateData);

        // Create Product
        const createdProductId = await Productflow.executeCreate(productService, productQeries.addProductMutation, productData);
        console.log('Created Product ID:', createdProductId);

        // Get Product
        await Productflow.executeGet(productService, productQeries.getProductQuery);

        // Update Product
        await Productflow.executeUpdate(productService, productQeries.updateProductMutation, updateData);

        // Get Updated Product
        await Productflow.executeGetUpdated(productService, productQeries.getProductQuery);

        // Delete Product
        await Productflow.executeDelete(productService, productQeries.deleteProductMutation);

        // Get Deleted Product
        await Productflow.executeGetDeleted(productService, productQeries.getProductQuery);
    });

});
