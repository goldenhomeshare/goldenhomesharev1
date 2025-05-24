"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { HomeownerChatModal } from "./HomeownerChatModal";

interface HomeownerChatButtonProps {
  productId: string;
  housemateId: string;
  housemateName: string;
  productName: string;
  hostId: string;
  hostName: string;
}

export function HomeownerChatButton({ 
  productId, 
  housemateId, 
  housemateName, 
  productName,
  hostId,
  hostName
}: HomeownerChatButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        size="sm"
        variant="outline"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Reply
      </Button>

      <HomeownerChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        housemateId={housemateId}
        housemateName={housemateName}
        productName={productName}
        hostId={hostId}
        hostName={hostName}
      />
    </>
  );
} 