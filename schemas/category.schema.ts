export const createCategorySchema = {
    type: "object",
    required: ["data"],
    properties: {
        data: {
            type: "object",
            required: ["addCategory"],
            properties: {
                addCategory: {
                    type: "object",
                    required: ["id", "name", "image"],
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        image: { type: "string" }
                    }
                }
            }
        }
    }
};


export const updateCategorySchema = {
    type: "object",
    required: ["data"],
    properties: {
        data: {
            type: "object",
            required: ["updateCategory"],
            properties: {
                updateCategory: {
                    type: "object",
                    required: ["id", "name", "image"],
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        image: { type: "string" }
                    }
                }
            }
        }
    }
};

export const getCategoriesSchema = {
    type: "object",
    required: ["data"],
    properties: {
        data: {
            type: "object",
            required: ["category"],
            properties: {
                category: {
                    type: "object",
                    required: ["id", "name", "image"],
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        image: { type: "string" }
                    }
                }
            }
        }
    }
};

export const deleteCategorySchema = {
    type: "object",
    required: ["data"], 
    properties: {
        data: {
            type: "object",
            required: ["deleteCategory"],
            properties: {
                deleteCategory: {type : "boolean"}
            }
        }
    }
};