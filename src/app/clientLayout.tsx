"use client";

import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <DragDropContext onDragEnd={() => {}}>{children}</DragDropContext>;
}