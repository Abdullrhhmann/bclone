const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const placeholderImages = [
  'https://placehold.co/600x400',
  'https://placehold.co/800x600',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
];

const categories = ['Scriptwriting', 'Copywriting', 'Poetry'];

const titles = [
  'Ramadan 2024 Series Script',
  'Cairo Nights: Short Film Script',
  'Technical Translation Project',
  'Alexandria Poems Collection',
  'Brand Storytelling for Nile Coffee',
  'Egyptian Heritage Documentary Script',
  'Startup Pitch Deck Copy',
  'Desert Winds: Poetry Anthology',
  'Museum Exhibit Narration',
  'Cinematic Trailer Voiceover',
  'Travel Blog Editorial Copy',
  'Arabic UX Microcopy System'
];

const usersData = [
  {
    username: 'ahmed_scriptwriter',
    email: 'ahmed@example.com',
    displayName: 'Ahmed The Scriptwriter',
    bio: 'Scriptwriter focused on cinematic storytelling and documentary scripts.',
  },
  {
    username: 'sara_copywriter',
    email: 'sara@example.com',
    displayName: 'Sara Copywriter',
    bio: 'Copywriter crafting brand stories for Egyptian startups and agencies.',
  },
  {
    username: 'omar_poet',
    email: 'omar@example.com',
    displayName: 'Omar The Poet',
    bio: 'Poet and editor inspired by Cairo, Alexandria, and the Nile.',
  },
];

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const buildModules = () => {
  const img1 = sample(placeholderImages);
  const img2 = sample(placeholderImages);
  return [
    {
      type: 'image',
      order: 1,
      url: img1,
      image: {
        url: img1,
        filename: 'placeholder-1',
        width: 600,
        height: 400,
        dominantColor: '#cccccc',
      },
      caption: 'Cover detail',
    },
    {
      type: 'image',
      order: 2,
      url: img2,
      image: {
        url: img2,
        filename: 'placeholder-2',
        width: 800,
        height: 600,
        dominantColor: '#bbbbbb',
      },
      caption: 'Project highlight',
    },
  ];
};

const buildCover = () => {
  const url = sample(placeholderImages);
  return {
    url,
    filename: 'cover',
    width: 1200,
    height: 800,
    dominantColor: '#dddddd',
  };
};

const seed = async () => {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in .env');
  }

  await mongoose.connect(MONGO_URI, { autoIndex: false });

  await Project.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('123456', 12);

  const users = await User.insertMany(
    usersData.map((user) => ({
      ...user,
      passwordHash,
      avatar: { url: sample(placeholderImages) },
      coverImage: { url: sample(placeholderImages) },
    }))
  );

  const projectsToCreate = titles.map((title, index) => {
    const owner = users[index % users.length];
    const views = randomBetween(120, 2500);
    const appreciations = randomBetween(10, 420);
    return {
      title,
      description: `A featured writing project by ${owner.displayName}.`,
      owner: owner._id,
      coverImage: buildCover(),
      modules: buildModules(),
      fields: [sample(categories)],
      tags: ['al-katib', 'egypt', 'writing'],
      tools: ['Google Docs', 'Final Draft'],
      stats: {
        views,
        appreciationsCount: appreciations,
      },
      appreciations: [],
    };
  });

  await Project.insertMany(projectsToCreate);

  console.log('Seed completed:', { users: users.length, projects: projectsToCreate.length });
  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
