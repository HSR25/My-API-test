import { test, expect } from '../core/auth.fixture';
import { ProductService } from '../services/product.service';
import * as generateData from '../services/dataGenerator';
import { ProductFlow } from '../utils/productUtil';
import * as productQeries from '../Graph QL/product.queries';

test.describe('Product CRUD Operations', () => {

    test('validate product creation, retrieval, update and deletion', async ({ apiClient }) => {

        const productService = new ProductService(apiClient);
        const productData = generateData.generateProductData();
        const updateData = generateData.generateUpdateProductData();
        const Productflow = new ProductFlow(productData, updateData);

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
