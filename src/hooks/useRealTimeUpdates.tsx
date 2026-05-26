import { useEffect } from 'react';
import { useAppDispatch } from './store';
import { addRawNotification } from '@/features/notifications/notificationsSlice';
import { toast } from 'react-hot-toast';
import { UnifiedContent } from '@/types/content';
import { Bell, Heart } from 'lucide-react';
import React from 'react';

interface UseRealTimeUpdatesProps {
  onNewSocialPost?: (post: UnifiedContent) => void;
}

export function useRealTimeUpdates({ onNewSocialPost }: UseRealTimeUpdatesProps = {}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const eventSource = new EventSource('/api/real-time');

    eventSource.onopen = () => {
      console.log('SSE Stream connection established.');
    };

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        
        if (payload.type === 'status') {
          console.log('SSE status:', payload.message);
          return;
        }

        if (payload.type === 'notification') {
          const item = payload.data;
          dispatch(addRawNotification(item));
          
          // Display premium notification toast with Custom icon
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full glass shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black/5 dark:ring-white/5 border border-border p-4`}
              >
                <div className="flex-1 w-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.message}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-border pl-3 ml-3 items-center">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="text-xs font-medium text-primary hover:text-indigo-400 focus:outline-none"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ),
            { id: item.id }
          );
        }

        if (payload.type === 'social_post') {
          const post = payload.data;
          
          // Normalize post structure
          const normalizedPost: UnifiedContent = {
            id: post.id,
            type: 'social',
            title: `${post.user?.name || 'Anonymous User'} posted`,
            description: post.content || '',
            image: post.image || '',
            source: 'Social Feed',
            category: post.category || 'social',
            url: '#',
            createdAt: post.createdAt,
            extraInfo: {
              likes: post.likes || 0,
              shares: post.shares || 0,
              commentsCount: post.commentsCount || 0,
              author: post.user?.name || 'Anonymous',
            },
          };

          if (onNewSocialPost) {
            onNewSocialPost(normalizedPost);
          }

          // Trigger minor notification toast for new post
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-xs glass shadow-md rounded-lg pointer-events-auto flex border border-border p-3`}
              >
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                  <span className="text-xs font-medium text-foreground">
                    New post by {post.user?.name || 'User'}
                  </span>
                </div>
              </div>
            ),
            { duration: 2500 }
          );
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE Stream error occurred, reconnecting...', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
      console.log('SSE Stream connection closed.');
    };
  }, [dispatch, onNewSocialPost]);
}
export default useRealTimeUpdates;
