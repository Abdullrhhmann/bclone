/**
 * Seed script to populate MongoDB with original card data from frontend
 * Run with: ts-node src/seed.ts
 */

import mongoose from 'mongoose';
import CardModel from './models/cardModel';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Load data from frontend images.js file
const dataFilePath = path.join(__dirname, '../../../frontend/src/data/content/images.js');

async function loadCardData() {
  try {
    // Read the file
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
    
    // Extract the data array using regex
    const dataMatch = fileContent.match(/export const data = \[([\s\S]*)\];/);
    if (!dataMatch) {
      throw new Error('Could not extract data from images.js');
    }
    
    // Parse the extracted data
    const dataStr = '[' + dataMatch[1] + ']';
    const sampleCards = eval(dataStr) as any[];
    
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

    // Load original card data from frontend
    const sampleCards = await loadCardData();
    console.log(`✓ Loaded ${sampleCards.length} cards from frontend data`);

    // Transform field names to match schema (image-array -> images, etc)
    const transformedCards = sampleCards.map((card: any) => {
      const transformed = { ...card };
      if (card['image-array']) {
        transformed.images = card['image-array'];
        delete transformed['image-array'];
      }
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
