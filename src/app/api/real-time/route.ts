import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const NOTIFICATION_TEMPLATES = [
  { title: 'New Trending Movie', message: 'Quantum Leap: Reborn is now trending in entertainment!', type: 'movie' },
  { title: 'System Alert', message: 'Your customized layout has been synchronized successfully.', type: 'success' },
  { title: 'New Social Interaction', message: 'Sarah Jenkins reshared your post on Artificial General Intelligence.', type: 'social' },
  { title: 'Trending News', message: 'Decentralized Networks are seeing active updates in regulatory guidelines.', type: 'info' }
];

const NEW_POST_TEMPLATES = [
  {
    id: 'sse-post-1',
    user: { name: 'Kavita Patel', avatar: '/avatars/kavita.png' },
    content: 'Just read the Harvard study on plant-based micro-nutrients. Swapping my breakfast for chia seeds and spinach today! 🥬🥤 #health #nutrition',
    category: 'health',
    likes: 12,
    shares: 2,
    commentsCount: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sse-post-2',
    user: { name: 'Liam O\'Connor', avatar: '/avatars/liam.png' },
    content: 'Incredible news from NASA today about the new Deep Space infrared images. The resolution is mind-blowing. Space exploration is in a golden age! 🌌🔭 #science #astronomy',
    category: 'science',
    likes: 45,
    shares: 11,
    commentsCount: 8,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sse-post-3',
    user: { name: 'Zoe Vance', avatar: '/avatars/zoe.png' },
    content: 'Breaking: F1 rules are making the races so much more competitive. Can we talk about the mid-field battle? 🏎️🏁 #sports #f1',
    category: 'sports',
    likes: 31,
    shares: 3,
    commentsCount: 5,
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  let timer: NodeJS.Timeout;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Send initial connection successful event
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'status', message: 'connected' })}\n\n`));

      let counter = 0;

      // Stream updates every 10 seconds
      timer = setInterval(() => {
        counter++;
        let eventPayload = {};

        // Alternating events: notification vs social post
        if (counter % 2 === 0) {
          const notification = NOTIFICATION_TEMPLATES[Math.floor(Math.random() * NOTIFICATION_TEMPLATES.length)];
          eventPayload = {
            type: 'notification',
            data: {
              id: `sse-notif-${Date.now()}`,
              ...notification,
              read: false,
              createdAt: new Date().toISOString()
            }
          };
        } else {
          const rawPost = NEW_POST_TEMPLATES[Math.floor(Math.random() * NEW_POST_TEMPLATES.length)];
          const post = {
            ...rawPost,
            id: `${rawPost.id}-${Date.now()}`, // unique ID
            createdAt: new Date().toISOString()
          };
          eventPayload = {
            type: 'social_post',
            data: post
          };
        }

        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(eventPayload)}\n\n`));
        } catch (e) {
          console.error('SSE Stream controller error:', e);
          clearInterval(timer);
        }
      }, 15000); // Send updates every 15 seconds
    },
    cancel() {
      if (timer) {
        clearInterval(timer);
      }
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // For Vercel/Nginx
    },
  });
}
