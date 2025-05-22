const { faker } = require('@faker-js/faker');
const db = require('./models').default;
const { Category, Recipe } = db;

const NUM_CATEGORIES = 100;
const NUM_RECIPES = 100000;

async function seedDatabase() {
  await db.sequelize.sync({ force: true }); 

  console.log(`Seeding ${NUM_CATEGORIES} categories...`);
  const categoryNames = new Set();
  const categories = [];

  while (categoryNames.size < NUM_CATEGORIES) {
    const name = `${faker.word.adjective()} ${faker.word.noun()} Dishes`;
    if (!categoryNames.has(name)) {
      categoryNames.add(name);
      const category = await Category.create({
        name,
        description: faker.lorem.sentence()
      });
      categories.push(category);
    }
  }

  console.log(`Seeding ${NUM_RECIPES} recipes...`);
  const recipes = [];
  for (let i = 0; i < NUM_RECIPES; i++) {
    recipes.push({
      name: `${faker.word.adjective()} ${faker.word.noun()}`,
      kcal: faker.number.int({ min: 50, max: 900 }),
      time: `${faker.number.int({ min: 5, max: 120 })} min`,
      image: faker.image.urlPicsumPhotos({ width: 640, height: 480 }),
      CategoryId: categories[Math.floor(Math.random() * NUM_CATEGORIES)].id
    });

    if (recipes.length >= 1000) {
      await Recipe.bulkCreate(recipes);
      recipes.length = 0;
    }
    if (i % 10000 === 0) console.log(`Inserted ${i} recipes...`);
  }

  if (recipes.length > 0) {
    await Recipe.bulkCreate(recipes);
  }

  console.log("Seeding completed!");
}

seedDatabase().catch(console.error);
