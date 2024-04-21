import { DataSource } from "typeorm";
import { Entities, migrations } from "@veramo/data-store";

/**
 * Initializes the database with the specified configuration.
 * 
 * @returns A promise that resolves when the database is successfully initialized.
 */
export const initializeDatabase = () => {
  const DATABASE_FILE = "valyuDID.sqlite";

  return new DataSource({
    type: "sqlite",
    database: DATABASE_FILE,
    synchronize: false,
    migrations,
    migrationsRun: true,
    logging: ["error", "info", "warn"],
    entities: Entities,
  }).initialize();
}

// Export this to use in the DID provider class
export const dbConnection = await initializeDatabase();