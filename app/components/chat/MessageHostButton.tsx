"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { ChatModal } from "./ChatModal";

interface MessageHostButtonProps {
  productId: string;
  hostId: string;
  hostName: string;
  productName: string;
}

export function MessageHostButton({ productId, hostId, hostName, productName }: MessageHostButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 text-sm"
        variant="outline"
        size="sm"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Message Homeowner
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