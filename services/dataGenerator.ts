import { faker } from '@faker-js/faker';

const VALID_CATEGORY_IDS: number[] = [30]



export interface ProductData {
    title: string;
    price: number;
    description: string;
    categoryId: number;
    images: string[];
}

export interface UpdateProductData {
    title: string;
    price: number;
    images: string[];
}

export function generateProductData(): ProductData {
    return {
        title: `${faker.commerce.productName()} ${faker.string.alphanumeric(4)}`,
        price: parseFloat(faker.commerce.price({ min: 1, max: 1000, dec: 0 })),
        description: faker.commerce.productDescription(),
        categoryId: faker.helpers.arrayElement(VALID_CATEGORY_IDS),
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
