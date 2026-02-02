import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import CardModel from './models/cardModel';
import dotenv from 'dotenv';

dotenv.config();

// Placeholder images for cards
const placeholderImages = [
  'https://images.unsplash.com/photo-1561070791-fc7e457fba2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  'https://images.unsplash.com/photo-1552738527-c99854e756f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  'https://images.unsplash.com/photo-1575321351661-a1d89bedf554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  'https://images.unsplash.com/photo-1487260211189-670c54da558d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  'https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  'https://images.unsplash.com/photo-1633269540827-728aabbb7646?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
];

interface CardData {
  [key: string]: any;
  'image-array'?: string[];
}

async function seedDatabase() {
  let connection: typeof mongoose | null = null;

  try {
    // Connect to MongoDB
    const dbURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    connection = await mongoose.connect(dbURI);
    console.log('✓ Connected to MongoDB');

    // Read the images.js file
    const filePath = path.resolve('../frontend/src/data/content/images.js');
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Images data file not found at: ${filePath}`);
    }

    console.log('✓ Reading images.js file...');
    let fileContent = fs.readFileSync(filePath, 'utf-8');

    // Remove the export statement and convert to plain JS object
    fileContent = fileContent.replace('export const data = ', '');
    if (fileContent.endsWith(';')) {
      fileContent = fileContent.slice(0, -1);
    }

    // Safely evaluate the array
    let cardsData: CardData[] = [];
    try {
      cardsData = eval('(' + fileContent + ')');
    } catch (e) {
      throw new Error(`Failed to parse data: ${(e as Error).message}`);
    }

    console.log(`✓ Loaded ${cardsData.length} cards from images.js`);

    // Validate and transform data
    console.log('✓ Validating and transforming data...');
    cardsData = cardsData.map((card: CardData, index: number) => {
      const transformed: any = { ...card };
      
      // Transform field names: "image-array" -> "images"
      if (card['image-array'] && card['image-array'].length > 0) {
        transformed.images = card['image-array'];
      } else {
        // Assign placeholder image based on card index
        transformed.images = [placeholderImages[index % placeholderImages.length]];
      }
      
      delete transformed['image-array'];

      // Ensure required fields have default values
      transformed.likes = transformed.likes || 0;
      transformed.views = transformed.views || 0;
      transformed.imageTitle = transformed.imageTitle || `Card ${index + 1}`;
      transformed.creatorName = transformed.creatorName || 'Anonymous';

      return transformed;
    });

    // Get current count
    const currentCount = await CardModel.countDocuments();
    console.log(`✓ Current cards in database: ${currentCount}`);

    // Clear existing cards
    console.log('✓ Clearing existing cards...');
    const deleteResult = await CardModel.deleteMany({});
    console.log(`✓ Deleted ${deleteResult.deletedCount} old cards`);

    // Insert all cards in batches
    const batchSize = 1000;
    let insertedTotal = 0;

    console.log('✓ Seeding cards in batches...');
    for (let i = 0; i < cardsData.length; i += batchSize) {
      const batch = cardsData.slice(i, i + batchSize);
      const batchStart = i + 1;
      const batchEnd = Math.min(i + batchSize, cardsData.length);

      try {
        const result = await CardModel.insertMany(batch, { ordered: false });
        insertedTotal += result.length;
        console.log(`  ├─ Batch ${batchStart}-${batchEnd}: ${result.length} cards inserted`);
      } catch (batchError) {
        console.error(`  ├─ Batch ${batchStart}-${batchEnd} had errors, continuing...`);
        // Continue with next batch even if one fails
      }
    }

    // Verify final count
    const finalCount = await CardModel.countDocuments();
    console.log(`\n✓ Seeding complete!`);
    console.log(`  ├─ Total cards inserted: ${insertedTotal}`);
    console.log(`  └─ Final database count: ${finalCount}`);

    if (finalCount !== cardsData.length) {
      console.warn(`⚠️  Warning: Expected ${cardsData.length} cards but found ${finalCount}`);
    }

    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Seeding failed:', error);
    if (connection) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

// Run the seed
seedDatabase();
