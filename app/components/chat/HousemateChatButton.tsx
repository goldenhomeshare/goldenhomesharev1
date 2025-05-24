"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { ChatModal } from "./ChatModal";

interface HousemateChatButtonProps {
  productId: string;
  hostId: string;
  hostName: string;
  productName: string;
}

export function HousemateChatButton({ 
  productId, 
  hostId, 
  hostName, 
  productName 
}: HousemateChatButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        size="sm"
        variant="outline"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Continue Chat
      </Button>

      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        hostId={hostId}
        hostName={hostName}
        productName={productName}
      />
    </>
  );
} 