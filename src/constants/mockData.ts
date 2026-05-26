export const MOCK_NEWS = [
  {
    title: 'The Rise of Artificial General Intelligence',
    description: 'Tech giants and research institutions are reporting rapid progress in AI capabilities, bringing us closer to general intelligence than ever before.',
    content: 'Long format content about AGI and its implications on industry standards...',
    urlToImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=600',
    source: { name: 'TechCrunch' },
    category: 'technology',
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    author: 'Sarah Jenkins',
    url: 'https://techcrunch.com',
  },
  {
    title: 'NASA Unveils New Deep Space Telescope Images',
    description: 'The latest space observatory has beamed back crystal-clear infrared images of nebulae and galaxies in the deep universe, unlocking cosmic history.',
    content: 'Full details of NASA telescope operations and cosmic star birth regions...',
    urlToImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
    source: { name: 'Nature Science' },
    category: 'science',
    publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    author: 'Dr. Alan Vance',
    url: 'https://nature.com',
  },
  {
    title: 'Global Stock Markets Rally on Economic Optimism',
    description: 'Inflation parameters cooling down across major economies leads to indices hitting new records, prompting positive trader sentiment.',
    content: 'Financial analysts explain the inflation reports and treasury yields...',
    urlToImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600',
    source: { name: 'Bloomberg' },
    category: 'business',
    publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    author: 'Marcus Aurel',
    url: 'https://bloomberg.com',
  },
  {
    title: 'Formula 1 Dynamic Rules Shakes Up Constructors Standings',
    description: 'A look into how the newly introduced aerodynamics regulations are shifting power away from traditional leaders towards mid-tier teams.',
    content: 'F1 season review, driver quotes, and technical specs details...',
    urlToImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600',
    source: { name: 'Motorsport' },
    category: 'sports',
    publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    author: 'Ken Miles',
    url: 'https://motorsport.com',
  },
  {
    title: 'Award-Winning Director Announces Next Sci-Fi Trilogy',
    description: 'The celebrated director has signed a massive production deal to adapt an acclaimed 80s space opera book series into three feature films.',
    content: 'Interview with the production designers and screenwriters...',
    urlToImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600',
    source: { name: 'Variety' },
    category: 'entertainment',
    publishedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    author: 'David O. Russell',
    url: 'https://variety.com',
  },
  {
    title: 'New Diet Guidelines Emphasize Plant-Based Micro-nutrients',
    description: 'A long-term Harvard study suggests that incorporating leafy greens and ancient grains is key to cellular health and longevity.',
    content: 'Medical study data points, vitamin absorption levels, and diet charts...',
    urlToImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600',
    source: { name: 'Healthline' },
    category: 'health',
    publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    author: 'Dr. Rebecca Chen',
    url: 'https://healthline.com',
  },
  {
    title: 'Decentralized Networks Face New Regulatory Hurdle',
    description: 'Global cybersecurity coalitions propose new strict protocols for cross-border ledger validations to prevent money laundering risks.',
    content: 'Analysis of legal drafts and potential impacts on token markets...',
    urlToImage: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=600',
    source: { name: 'Wired' },
    category: 'politics',
    publishedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    author: 'Lina Khan',
    url: 'https://wired.com',
  }
];

export const MOCK_MOVIES = [
  {
    id: 101,
    title: 'Interstellar Odyssey',
    overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival amidst a dying Earth.',
    poster_path: null, // Will use normalizer fallback or dynamic image
    vote_average: 8.8,
    release_date: '2025-11-05',
    runtime: 169
  },
  {
    id: 102,
    title: 'The AI Paradox',
    overview: 'A brilliant programmer is selected to participate in a ground-breaking experiment in synthetic intelligence by evaluating the human qualities of a breathtaking humanoid A.I.',
    poster_path: null,
    vote_average: 8.2,
    release_date: '2026-02-14',
    runtime: 108
  },
  {
    id: 103,
    title: 'Quantum Leap: Reborn',
    overview: 'When a particle physics experiment goes wrong, a physicist is flung across dimensions, needing to find his way home by solving timeline anomalies.',
    poster_path: null,
    vote_average: 7.9,
    release_date: '2026-04-01',
    runtime: 135
  },
  {
    id: 104,
    title: 'Midnight in Kyoto',
    overview: 'A poetic romantic drama following two strangers who meet in a local tea house and experience a night of self-discovery across glowing lanterns.',
    poster_path: null,
    vote_average: 8.4,
    release_date: '2025-08-20',
    runtime: 114
  }
];

export const MOCK_SOCIAL = [
  {
    id: 'post-1',
    user: { name: 'Devon Webb', avatar: '/avatars/devon.png' },
    content: 'Just deployed the new layout of the dashboard! Next.js 15 App Router handles nested page layout structures so smoothly. Anyone else playing with React Server Components? 🚀 #nextjs #webdev #frontend',
    category: 'technology',
    likes: 142,
    shares: 24,
    commentsCount: 18,
    createdAt: new Date(Date.now() - 600000).toISOString(), // 10 mins ago
  },
  {
    id: 'post-2',
    user: { name: 'Elena Rostova', avatar: '/avatars/elena.png' },
    content: 'Highly recommend watching "Interstellar Odyssey"! The visual cinematography is stunning, and the score by Hans Zimmer\'s protégé is magical. 🎬🌟 10/10.',
    category: 'entertainment',
    likes: 89,
    shares: 5,
    commentsCount: 9,
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
  },
  {
    id: 'post-3',
    user: { name: 'Aarav Sharma', avatar: '/avatars/aarav.png' },
    content: 'Tried the new plant-based protein micro-nutrients smoothie today before my workout. Energy levels stayed completely stable for hours. 🌱💪 #healthy #fitness',
    category: 'health',
    likes: 215,
    shares: 45,
    commentsCount: 32,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  }
];
