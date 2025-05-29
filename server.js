const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models"); 
const { Category, Recipe } = db;
const cors = require("cors");

const app = express();
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());

const openPaths = ["/api/login", "/api/register", "/api/statistics/avg-kcal-per-category","/favicon.ico"];

app.use((req, res, next) => {
  // Check if the path is in openPaths
  if (openPaths.includes(req.path)) {
    return next();
  }
  
  // For GET requests to /api/recipes and /api/categories, allow without auth
  if (req.method === "GET" && (req.path.startsWith("/api/recipes") || req.path.startsWith("/api/categories"))) {
    return next();
  }
  
  // For all other requests, require authentication
  authenticate(req, res, next);
});

// LogAction function
const logAction = async (userId, action, entity) => {
  try {
    await db.Log.create({
      userId,
      action,
      entity
    });
  } catch (err) {
    console.error("Failed to log action:", err);
  }
};


// Test Route
app.get("/", (req, res) => {
  res.send("API is working!");
});
// Get all categories
app.get("/api/categories", async (req, res) => {
  try {
    const { sort, order } = req.query;
    const orderBy = [];

    if (sort) {
      const validFields = ["name", "createdAt"];
      if (validFields.includes(sort)) {
        orderBy.push([sort, order === "desc" ? "DESC" : "ASC"]);
      }
    }

    const categories = await Category.findAll({
      order: orderBy,
      include: [{ model: Recipe, as: "recipes" }]
    });

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch categories." });
  }
});


// Get a single category
app.get("/api/categories/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Recipe, as: "recipes" }]
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch category." });
  }
});

// Create a new category
app.post("/api/categories", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required." });
    }
    const category = await Category.create({ name, description });
    await logAction(req.user.userId, "CREATE", "Category");

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create category." });
  }
});

// Update a category
app.put("/api/categories/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    category.name = name || category.name;
    category.description = description || category.description;
    await category.save();
    await logAction(req.user.userId, "UPDATE", "Category");
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update category." });
  }
});

// Delete a category
app.delete("/api/categories/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    await category.destroy();
    await logAction(req.user.userId, "DELETE", "Category");

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete category." });
  }
});
// Get all recipes
app.get("/api/recipes", async (req, res) => {
  try {
      const { search, sort = "name", order = "asc", page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      const where = {};
      const orderBy = [];

      // Only filter by user if authenticated
      if (req.user && req.user.userId) {
          where.UserId = req.user.userId;
      }

      // Search by name
      if (search) {
          where.name = {
              [db.Sequelize.Op.like]: `%${search}%`
          };
      }

      // Sorting
      const validSortFields = ["name", "kcal", "time"];
      if (validSortFields.includes(sort)) {
          orderBy.push([sort, order.toUpperCase()]);
      }

      const { count, rows } = await Recipe.findAndCountAll({
          where,
          order: orderBy,
          offset,
          limit: parseInt(limit),
          include: [
              {
                  model: Category,
                  as: "category",  
                  attributes: ["id", "name"] 
              }
          ]
      });

      res.json({
          total: count,
          recipes: rows
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch recipes." });
  }
});


// Get a single recipe
app.get("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [{ model: Category, as: "category" }]
    });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch recipe." });
  }
});

// Add a new recipe
app.post("/api/recipes", async (req, res) => {
  try {
      const { name, kcal, time, image, CategoryId } = req.body;

      const recipe = await Recipe.create({
          name,
          kcal,
          time,
          image,
          CategoryId,
          UserId: req.user.userId
      });

      await logAction(req.user.userId, "CREATE", "Recipe");

      const fullRecipe = await Recipe.findOne({
          where: { id: recipe.id },
          include: [{ model: Category, as: "category" }]
      });

      res.status(201).json(fullRecipe);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create recipe." });
  }
});


// Update a recipe
app.patch("/api/recipes/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const { name, kcal, time, image, CategoryId } = req.body;

      const recipe = await Recipe.findByPk(id);
      if (!recipe) {
          return res.status(404).json({ message: "Recipe not found" });
      }

      recipe.name = name;
      recipe.kcal = kcal;
      recipe.time = time;
      recipe.image = image;
      recipe.CategoryId = CategoryId;


      await recipe.save();
      
      await logAction(req.user.userId, "UPDATE", "Recipe");

      const updatedRecipe = await Recipe.findByPk(id, {
          include: [{ model: Category, as: "category" }],
      });

      res.json(updatedRecipe);
  } catch (error) {
      console.error("Failed to update recipe:", error);
      res.status(500).json({ message: "Failed to update recipe." });
  }
});

// Delete a recipe
app.delete("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }
    await recipe.destroy();
    await logAction(req.user.userId, "DELETE", "Recipe");

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete recipe." });
  }
});

// Sync the database (only for the first time)
db.sequelize.sync().then(() => {

  console.log("Database synced!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Silver part
app.get("/api/statistics/avg-kcal-per-category", async (req, res) => {
  try {
    const results = await db.sequelize.query(`
      SELECT c.name AS category, AVG(r.kcal) AS avgKcal
      FROM Recipes r
      JOIN Categories c ON r.CategoryId = c.id
      GROUP BY c.name
      ORDER BY avgKcal DESC;
    `);

    res.json(results[0]);
  } catch (error) {
    console.error("Failed to compute avg kcal per category:", error);
    res.status(500).json({ message: "Error generating statistics." });
  }
});
// Gold part
//--register
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = 'secret-key'; 

app.post("/api/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      email,
      password: hashedPassword,
      role: role || 'user'
    });
    res.status(201).json({ message: "User registered", userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});
//--login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});
//--middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; 
    console.log("Authenticated user:", decoded);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};