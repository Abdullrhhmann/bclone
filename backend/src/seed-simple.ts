#!/usr/bin/env node
/**
 * Simple seed script - Extract first 20 cards from frontend data
 */

import mongoose from 'mongoose';
import CardModel from './models/cardModel';
import dotenv from 'dotenv';

dotenv.config();

// Original data from frontend (first batch of cards)
const originalData = [
  {
    "imageTitle": "Modern Abstract Shapes",
    "creatorName": "John Doe",
    "likes": 3421,
    "views": 7824,
    "sort_by": "Most Discussed",
    "type": "vector",
    "price_type": "free",
    "category": "template",
    "file_extension": ".ai",
    "availability": "full time",
    "country": "USA",
    "tools": ["Photoshop", "Illustrator", "InDesign"],
    "color_of_the_image": "#FF5733",
    "colors_used": ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF"],
    "tools_list": ["Photoshop", "Illustrator", "InDesign", "Sketch", "Figma", "CorelDRAW"],
    "countries_list": ["USA", "Canada", "UK", "Germany", "France", "India", "Japan", "China"],
    "file_extension_list": [".ai", ".psd", ".indd", ".sketch", ".fig"],
    "images": ["https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080", "https://images.unsplash.com/photo-1633269540827-728aabbb7646?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"]
  },
  {
    "imageTitle": "Elegant Serif Fonts",
    "creatorName": "Jane Smith",
    "likes": 231,
    "views": 564,
    "sort_by": "Recommended",
    "type": "font",
    "price_type": "paid",
    "category": "template",
    "file_extension": ".psd",
    "availability": "freelance",
    "country": "UK",
    "tools": ["Photoshop", "Illustrator", "Figma"],
    "color_of_the_image": "#33FF57",
    "colors_used": ["#33FF57", "#3357FF", "#FF33A1"],
    "tools_list": ["Photoshop", "Illustrator", "Figma", "Sketch"],
    "countries_list": ["UK", "Germany", "France", "India", "Japan"],
    "file_extension_list": [".psd", ".sketch", ".fig", ".svg"],
    "images": ["https://images.unsplash.com/photo-1589877929074-9dd46c7e8cca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080", "https://images.unsplash.com/photo-1589153954586-953af22510a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"]
  },
  {
    "imageTitle": "Geometric Patterns",
    "creatorName": "David Brown",
    "likes": 980,
    "views": 1587,
    "sort_by": "Most Followed",
    "type": "template",
    "price_type": "subscription",
    "category": "vector",
    "file_extension": ".svg",
    "availability": "full time",
    "country": "Germany",
    "tools": ["Illustrator", "InDesign", "Figma"],
    "color_of_the_image": "#3357FF",
    "colors_used": ["#3357FF", "#FF33A1", "#A133FF"],
    "tools_list": ["Illustrator", "InDesign", "Figma", "Sketch", "Canva"],
    "countries_list": ["Germany", "France", "India", "Japan", "China"],
    "file_extension_list": [".svg", ".png", ".jpg"],
    "images": ["https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080", "https://images.unsplash.com/photo-1496167117681-944f702be1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"]
  },
  {
    "imageTitle": "Vibrant Typography",
    "creatorName": "Emily Johnson",
    "likes": 654,
    "views": 1234,
    "sort_by": "Curated",
    "type": "vector",
    "price_type": "free",
    "category": "font",
    "file_extension": ".png",
    "availability": "freelance",
    "country": "USA",
    "tools": ["Photoshop", "Figma", "Canva"],
    "color_of_the_image": "#FF33A1",
    "colors_used": ["#FF33A1", "#A133FF", "#FFFF00"],
    "tools_list": ["Photoshop", "Figma", "Canva", "Sketch", "GIMP"],
    "countries_list": ["USA", "Canada", "UK", "Germany", "France"],
    "file_extension_list": [".png", ".jpg", ".gif"],
    "images": ["https://images.unsplash.com/photo-1684346605600-2000784b5075?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080", "https://images.unsplash.com/photo-1561458087-728463545e0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"]
  },
  {
    "imageTitle": "Minimalist Posters",
    "creatorName": "Michael Lee",
    "likes": 102,
    "views": 345,
    "sort_by": "Most Viewed",
    "type": "template",
    "price_type": "paid",
    "category": "vector",
    "file_extension": ".jpg",
    "availability": "full time",
    "country": "India",
    "tools": ["Illustrator", "InDesign", "Sketch"],
    "color_of_the_image": "#A133FF",
    "colors_used": ["#A133FF", "#FFFF00", "#00FFFF"],
    "tools_list": ["Illustrator", "InDesign", "Sketch", "Figma", "CorelDRAW"],
    "countries_list": ["India", "Japan", "China", "Brazil", "Australia"],
    "file_extension_list": [".jpg", ".gif", ".eps"],
    "images": ["https://images.unsplash.com/photo-1487260211189-670c54da558d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080", "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"]
  },
  {
    "imageTitle": "Bright Color Palettes",
    "creatorName": "Sophia Garcia",
    "likes": 874,
    "views": 1978,
    "sort_by": "Most Recent",
    "type": "font",
    "price_type": "subscription",
    "category": "template",
    "file_extension": ".gif",
    "availability": "full time",
    "country": "Canada",
    "tools": ["Photoshop", "Figma", "Canva"],
    "color_of_the_image": "#FFFF00",
    "colors_used": ["#FFFF00", "#00FFFF", "#FF00FF"],
    "tools_list": ["Photoshop", "Figma", "Canva", "Sketch", "Affinity Designer"],
    "countries_list": ["Canada", "USA", "Mexico", "Brazil", "Argentina"],
    "file_extension_list": [".gif", ".mp4", ".webm"],
    "images": ["https://images.unsplash.com/photo-1552738527-c99854e756f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080", "https://images.unsplash.com/photo-1575321351661-a1d89bedf554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"]
  },
  {
    "imageTitle": "Bold Typography System",
    "creatorName": "James Wilson",
    "likes": 1245,
    "views": 2789,
    "sort_by": "Most Discussed",
    "type": "font",
    "price_type": "free",
    "category": "template",
    "file_extension": ".ttf",
    "availability": "full time",
    "country": "France",
    "tools": ["FontLab", "Glyphs", "Figma"],
    "color_of_the_image": "#000000",
    "colors_used": ["#000000", "#FFFFFF", "#FF0000"],
    "tools_list": ["FontLab", "Glyphs", "Figma", "Adobe XD", "Sketch"],
    "countries_list": ["France", "Germany", "UK", "USA", "Canada"],
    "file_extension_list": [".ttf", ".otf", ".woff"],
    "images": ["https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080", "https://images.unsplash.com/photo-1561070791-fc7e457fba2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"]
  },
  {
    "imageTitle": "Modern Branding Package",
    "creatorName": "Rachel Adams",
    "likes": 2341,
    "views": 5123,
    "sort_by": "Recommended",
    "type": "branding",
    "price_type": "paid",
    "category": "design",
    "file_extension": ".ai",
    "availability": "freelance",
    "country": "Australia",
    "tools": ["Illustrator", "InDesign", "Photoshop"],
    "color_of_the_image": "#FF6B35",
    "colors_used": ["#FF6B35", "#004E89", "#1B4965"],
    "tools_list": ["Illustrator", "InDesign", "Photoshop", "Figma"],
    "countries_list": ["Australia", "New Zealand", "USA", "UK", "Canada"],
    "file_extension_list": [".ai", ".psd", ".indd"],
    "images": ["https://images.unsplash.com/photo-1561070791-2526d30994b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080", "https://images.unsplash.com/photo-1561471173-992ca4ef69db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"]
  },
  {
    "imageTitle": "Creative Illustrations",
    "creatorName": "Marcus Thompson",
    "likes": 3567,
    "views": 8234,
    "sort_by": "Most Discussed",
    "type": "illustration",
    "price_type": "free",
    "category": "illustration",
    "file_extension": ".png",
    "availability": "full time",
    "country": "Japan",
    "tools": ["Procreate", "Photoshop", "Clip Studio Paint"],
    "color_of_the_image": "#FF00FF",
    "colors_used": ["#FF00FF", "#00FFFF", "#FFFF00"],
    "tools_list": ["Procreate", "Photoshop", "Clip Studio Paint", "Affinity Designer"],
    "countries_list": ["Japan", "South Korea", "China", "Thailand", "Vietnam"],
    "file_extension_list": [".png", ".psd", ".clip"],
    "images": ["https://images.unsplash.com/photo-1561070791-fc7e457fba2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080", "https://images.unsplash.com/photo-1561070791-2526d30994b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"]
  },
  {
    "imageTitle": "Web Design Mockups",
    "creatorName": "Lisa Anderson",
    "likes": 4891,
    "views": 9876,
    "sort_by": "Most Viewed",
    "type": "web",
    "price_type": "subscription",
    "category": "design",
    "file_extension": ".fig",
    "availability": "full time",
    "country": "Netherlands",
    "tools": ["Figma", "Adobe XD", "Sketch"],
    "color_of_the_image": "#3498DB",
    "colors_used": ["#3498DB", "#2ECC71", "#E74C3C"],
    "tools_list": ["Figma", "Adobe XD", "Sketch", "InVision", "Framer"],
    "countries_list": ["Netherlands", "Germany", "Belgium", "France", "UK"],
    "file_extension_list": [".fig", ".xd", ".sketch"],
    "images": ["https://images.unsplash.com/photo-1561070791-fc7e457fba2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080", "https://images.unsplash.com/photo-1561070791-2526d30994b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"]
  }
];

async function seedDatabase() {
  try {
    const dbURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    await mongoose.connect(dbURI);
    console.log('✓ Connected to MongoDB');

    await CardModel.deleteMany({});
    console.log('✓ Cleared existing cards');

    const result = await CardModel.insertMany(originalData);
    console.log(`✓ Seeded ${result.length} original cards`);

    await mongoose.disconnect();
    console.log('✓ Done!');
  } catch (error) {
    console.error('✗ Error:', error);
    process.exit(1);
  }
}

seedDatabase();
