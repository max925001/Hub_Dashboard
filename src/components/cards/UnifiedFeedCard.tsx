'use client';

import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { UnifiedContent } from '@/types/content';
import { NewsCard } from './NewsCard';
import { MovieCard } from './MovieCard';
import { SocialCard } from './SocialCard';
import { motion } from 'framer-motion';

interface UnifiedFeedCardProps {
  item: UnifiedContent;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onOpenDetails: (item: UnifiedContent) => void;
  compact?: boolean;
}

const CARD_TYPE = 'FEED_CARD';

export function UnifiedFeedCard({ item, index, moveCard, onOpenDetails, compact = false }: UnifiedFeedCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: CARD_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(draggedItem: any, monitor) {
      if (!ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset ? clientOffset.y - hoverBoundingRect.top : 0;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveCard(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: CARD_TYPE,
    item: () => ({ id: item.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <motion.div
      ref={ref}
      style={{ opacity: isDragging ? 0.35 : 1, cursor: 'move' }}
      whileHover={{ y: -3 }}
      layout
      className="h-full"
      data-handler-id={handlerId}
    >
      {item.type === 'news' && (
        <NewsCard item={item} onOpenDetails={onOpenDetails} compact={compact} />
      )}
      {item.type === 'movie' && (
        <MovieCard item={item} onOpenDetails={onOpenDetails} compact={compact} />
      )}
      {item.type === 'social' && (
        <SocialCard item={item} onOpenDetails={onOpenDetails} compact={compact} />
      )}
    </motion.div>
  );
}
export default UnifiedFeedCard;
