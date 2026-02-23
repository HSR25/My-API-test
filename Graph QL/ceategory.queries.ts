export const getCategoriesQuery = 
`query GetCategories($id: ID!) {
    category(id: $id) {
      id
      name
      image
    }
  }`;

export const addCategoryMutation = `
mutation AddCategory($name: String!, $image: String!) {
  addCategory(data: {
  name: $name, 
  image: $image
  }) {
    id
    name
    image
  }
}`;

export const updateCategoryMutation = `
mutation UpdateCategory($id: ID!, $name: String,) {
  updateCategory(id: $id, 
  changes: {
  name: $name,  
    }) {
    id
    name
    image
  }
}`; 

export const deleteCategoryMutation = `
mutation DeleteCategory($id: ID!) {
  deleteCategory(id: $id)
}
`;  