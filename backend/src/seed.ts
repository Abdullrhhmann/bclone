/**
 * Seed script to populate MongoDB with card data from seed-data/cards.json
 * Run with: ts-node src/seed.ts
 */

import mongoose from 'mongoose';
import CardModel from './models/cardModel';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Load data from backend/seed-data/cards.json
const dataFilePath = path.join(__dirname, '../seed-data/cards.json');

async function loadCardData() {
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
    const sampleCards = JSON.parse(fileContent) as any[];
    return sampleCards;
  } catch (error) {
    console.error('Error loading card data:', error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const dbURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    await mongoose.connect(dbURI);
    console.log('✓ Connected to MongoDB');

    // Clear existing cards
    await CardModel.deleteMany({});
    console.log('✓ Cleared existing cards');

    // Load original card data from cards.json
    const sampleCards = await loadCardData();
    console.log(`✓ Loaded ${sampleCards.length} cards from cards.json`);

    // Transform field names to match schema
    const transformedCards = sampleCards.map((card: any) => {
      const transformed = { ...card };
      
      // Use images field if it exists, otherwise use image-array
      if (!transformed.images || transformed.images.length === 0) {
        if (card['image-array'] && card['image-array'].length > 0) {
          transformed.images = card['image-array'];
        }
      }
      
      // Remove image-array field to avoid confusion
      delete transformed['image-array'];
      
      // Transform file_extensions_list to file_extension_list
      if (card['file_extensions_list']) {
        transformed.file_extension_list = card['file_extensions_list'];
        delete transformed['file_extensions_list'];
      }
      
      return transformed;
    });

    // Insert cards
    const result = await CardModel.insertMany(transformedCards);
    console.log(`✓ Seeded ${result.length} cards into database`);

    // Close connection
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
