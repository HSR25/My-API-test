import { faker } from '@faker-js/faker';

export interface ProductData {
    title: string;
    price: number;
    description: string;
    categoryId: string | number;
    images: string[];
}

export interface UpdateProductData {
    title: string;
    price: number;
    images: string[];
}

export interface CategoryData {
    name: string;
    image: string;
}

export interface UpdateCategoryData {
    name: string;
    image: string;
}

export function generateProductData(categoryId: string | number): ProductData {
    return {
        title: `${faker.commerce.productName()} ${faker.string.alphanumeric(4)}`,
        price: parseFloat(faker.commerce.price({ min: 1, max: 1000, dec: 0 })),
        description: faker.commerce.productDescription(),
        categoryId: typeof categoryId === 'string' ? parseInt(categoryId) : categoryId,
        images: [`https://picsum.photos/seed/${faker.string.alphanumeric(8)}/640/480`],
    };
}

export function generateUpdateProductData(): UpdateProductData {
    return {
        title: `Updated ${faker.commerce.productName()} ${faker.string.alphanumeric(4)}`,
        price: parseFloat(faker.commerce.price({ min: 1, max: 1000, dec: 0 })),
        images: [`https://picsum.photos/seed/${faker.string.alphanumeric(8)}/640/480`],
    };
}

export function generateCategoryData(): CategoryData {
    return {
        name: `${faker.commerce.department()} ${faker.string.alphanumeric(6)}`,
        image: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/640/480`,
    };
}

export function generateUpdateCategoryData(): UpdateCategoryData {
    return {
        name: `Updated ${faker.commerce.department()} ${faker.string.alphanumeric(6)}`,
        image: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/640/480`,
    };
}
