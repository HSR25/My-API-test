export const addProductMutation = `
mutation AddProduct($title: String!, $price:Float!, $description: String!, $categoryId: Float!, $images: [String!]!) {
addProduct(data: {title: $title, 
price: $price, 
description: $description,
categoryId: $categoryId, 
images: $images
}) {
id
title
price
description
}
}
`;  

export const getProductQuery = `
query GetProduct($id: ID!) {
  product(id: $id) {
  id
  title
  price
  description
}
}
`;

export const updateProductMutation = ` 
mutation UpdateProduct($id: ID!, $title: String, $price:Float, $images: [String!]) {
updateProduct(id: $id, changes: {
title: $title, 
price: $price,
images: $images
}) {
id
title
price
}   
}
`;

export const deleteProductMutation = `
mutation DeleteProduct($id: ID!) {
deleteProduct(id: $id)
}
`;


