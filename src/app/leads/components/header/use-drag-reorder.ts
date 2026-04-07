"use client";

import * as React from "react";

export function useDragReorder(onReorder: (sourceId: string, targetId: string) => void) {
  const dragId = React.useRef<string | null>(null);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);

  const handleDragStart = (id: string) => { dragId.current = id; };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const handleDrop = (targetId: string) => {
    const sourceId = dragId.current;
    if (sourceId && sourceId !== targetId) onReorder(sourceId, targetId);
    dragId.current = null;
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    dragId.current = null;
    setDragOverId(null);
  };

  return { dragOverId, handleDragStart, handleDragOver, handleDrop, handleDragEnd };
}
