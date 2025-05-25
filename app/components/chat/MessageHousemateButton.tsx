"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { ProfileChatModal } from "./ProfileChatModal";

interface MessageHousemateButtonProps {
  housemateId: string;
  housemateName: string;
}

export function MessageHousemateButton({ housemateId, housemateName }: MessageHousemateButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenChat = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Button onClick={handleOpenChat} className="w-full">
        <MessageCircle className="w-4 h-4 mr-2" />
        Message {housemateName.split(' ')[0]}
      </Button>

      <ProfileChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        housemateId={housemateId}
        housemateName={housemateName}
      />
    </>
  );
} 