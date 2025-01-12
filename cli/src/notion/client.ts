import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY is required");
}

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error("NOTION_DATABASE_ID is required");
}

export const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const DATABASE_ID = process.env.NOTION_DATABASE_ID;
