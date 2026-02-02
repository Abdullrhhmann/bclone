import fs from 'fs';
import path from 'path';

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

async function convertToJSON() {
  try {
    // Read the images.js file
    const filePath = path.resolve('../frontend/src/data/content/images.js');
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Images data file not found at: ${filePath}`);
    }

    console.log('✓ Reading images.js file...');
    let fileContent = fs.readFileSync(filePath, 'utf-8');

    // Remove the export statement
    fileContent = fileContent.replace('export const data = ', '');
    if (fileContent.endsWith(';')) {
      fileContent = fileContent.slice(0, -1);
    }

    // Evaluate the array
    let cardsData: any[] = [];
    try {
      cardsData = eval('(' + fileContent + ')');
    } catch (e) {
      throw new Error(`Failed to parse data: ${(e as Error).message}`);
    }

    console.log(`✓ Loaded ${cardsData.length} cards`);

    // Transform data
    console.log('✓ Transforming data...');
    const transformedCards = cardsData.map((card: any, index: number) => {
      const transformed: any = { ...card };
      
      // Transform field names: "image-array" -> "images"
      if (card['image-array'] && card['image-array'].length > 0) {
        transformed.images = card['image-array'];
      } else {
        transformed.images = [placeholderImages[index % placeholderImages.length]];
      }
      
      delete transformed['image-array'];

      // Ensure required fields
      transformed.likes = transformed.likes || 0;
      transformed.views = transformed.views || 0;
      transformed.imageTitle = transformed.imageTitle || `Card ${index + 1}`;
      transformed.creatorName = transformed.creatorName || 'Anonymous';

      return transformed;
    });

    // Create output directory
    const outputDir = path.resolve('./seed-data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write to JSON file
    const outputPath = path.join(outputDir, 'cards.json');
    fs.writeFileSync(outputPath, JSON.stringify(transformedCards, null, 2));
    
    console.log(`\n✓ Conversion complete!`);
    console.log(`✓ File saved to: ${outputPath}`);
    console.log(`✓ Total cards: ${transformedCards.length}`);
    console.log(`\n📌 To import into MongoDB Compass:`);
    console.log(`1. Open MongoDB Compass`);
    console.log(`2. Go to database "behance" > collection "cards"`);
    console.log(`3. Click "Add Data" > "Import File"`);
    console.log(`4. Select: ${outputPath}`);
    console.log(`5. Choose "Import as JSON"`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Conversion failed:', error);
    process.exit(1);
  }
}

convertToJSON();
