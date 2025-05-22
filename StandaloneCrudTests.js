

const baseUrl = "http://localhost:3001/api";

async function createCategory() {
    try {
        const response = await fetch(`${baseUrl}/categories`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Standalone Test Category", description: "Test description" })
        });
        const data = await response.json();
        console.log("Created Category:", data);
        return data;
    } catch (error) {
        console.error("Error creating category:", error);
    }
}

async function createRecipe(categoryId) {
    try {
        const response = await fetch(`${baseUrl}/recipes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Standalone Test Recipe",
                kcal: 100,
                time: "15 minutes",
                image: "https://via.placeholder.com/150",
                CategoryId: categoryId
            })
        });
        const data = await response.json();
        console.log("Created Recipe:", data);
        return data;
    } catch (error) {
        console.error("Error creating recipe:", error);
    }
}

async function updateRecipe(recipeId) {
    try {
        const response = await fetch(`${baseUrl}/recipes/${recipeId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Updated Standalone Test Recipe", kcal: 200, time: "20 minutes" })
        });
        const data = await response.json();
        console.log("Updated Recipe:", data);
        if (data.name === "Updated Standalone Test Recipe" && data.kcal === 200 && data.time === "20 minutes") {
            console.log("Recipe update verification passed");
        } else {
            console.error("Recipe update verification failed", data);
        }
    } catch (error) {
        console.error("Error updating recipe:", error);
    }
}

async function updateCategory(categoryId) {
    try {
        const response = await fetch(`${baseUrl}/categories/${categoryId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Updated Test Category", description: "Updated description" })
        });
        const data = await response.json();
        console.log("Updated Category:", data);
        if (data.name === "Updated Test Category" && data.description === "Updated description") {
            console.log("Category update verification passed");
        } else {
            console.error("Category update verification failed", data);
        }
    } catch (error) {
        console.error("Error updating category:", error);
    }
}

async function deleteRecipe(recipeId) {
    try {
        const response = await fetch(`${baseUrl}/recipes/${recipeId}`, {
            method: "DELETE"
        });
        console.log("Deleted Recipe:", response.status);
    } catch (error) {
        console.error("Error deleting recipe:", error);
    }
}

async function deleteCategory(categoryId) {
    try {
        const response = await fetch(`${baseUrl}/categories/${categoryId}`, {
            method: "DELETE"
        });
        console.log("Deleted Category:", response.status);
    } catch (error) {
        console.error("Error deleting category:", error);
    }
}

async function runTests() {
    const category = await createCategory();
    const recipe = await createRecipe(category.id);
    await updateRecipe(recipe.id);
    await updateCategory(category.id);
    await deleteRecipe(recipe.id);
    await deleteCategory(category.id);
}

runTests();
