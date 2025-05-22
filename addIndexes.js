import { sequelize } from './models';

async function addIndexes() {
  try {
    await sequelize.query(`CREATE INDEX idx_category_id ON Recipes (CategoryId);`);
    await sequelize.query(`CREATE INDEX idx_category_name ON Categories (name);`);
    console.log("Indexes created successfully.");
  } catch (error) {
    console.error("Failed to create indexes:", error);
  }
}

addIndexes();
