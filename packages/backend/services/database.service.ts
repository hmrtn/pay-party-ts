import { Express as ExpressApp } from "express";
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { env } from "process";

export const collections: { parties?: mongoDB.Collection } = {};

export async function connectToDatabase() {
  // Pulls in the .env file so it can be accessed from process.env. No path as .env is in root, the default location
  dotenv.config();

  // Create a new MongoDB client with the connection string from .env
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.DB_CONN_STRING
  );

  await client.connect();

  // Connect to the database with the name specified in .env
  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  // Apply schema validation to the collection
  await applySchemaValidation(db);

  const partyCollection: mongoDB.Collection = db.collection(
    process.env.PARTIES_COLLECTION_NAME
  );

  // Persist the connection to the party collection
  collections.parties = partyCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collection: ${partyCollection.collectionName}`
  );
}
// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Game model, even if added elsewhere.
async function applySchemaValidation(db: mongoDB.Db) {
  const jsonSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "desc"],
      additionalProperties: false,
      properties: {
        _id: {},
        version: "string",
        name: {
          bsonType: "string",
          description: "'name' is required and is a string",
        },
        desc: {
          bsonType: "string",
          description: "'desc' is required and is a string",
        },
        fundAmount: {
          bsonType: "number",
          description: "'fundAmount' is a number",
        },
        fundType: {
          bsonType: "string",
          description: "'fundType' is a string",
        },
        strategy: {
          bsonType: "string",
          description: "'strategy' is a string",
        },
      },
    },
  };

  // Try applying the modification to the collection, if the collection doesn't exist, create it
  await db
    .command({
      collMod: process.env.PARTIES_COLLECTION_NAME,
      validator: jsonSchema,
    })
    .catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection(process.env.PARTIES_COLLECTION_NAME, {
          validator: jsonSchema,
        });
      }
    });
}
