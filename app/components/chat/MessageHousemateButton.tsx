"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MessageHousemateButtonProps {
  housemateId: string;
  housemateName: string;
}

export function MessageHousemateButton({ housemateId, housemateName }: MessageHousemateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStartConversation = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Get current user first
      const userResponse = await fetch("/api/auth/user");
      if (!userResponse.ok) {
        toast.error("Please log in to send messages.");
        router.push("/api/auth/login");
        return;
      }
      
      const userData = await userResponse.json();
      
      // Create or get the profile chat room
      const chatResponse = await fetch("/api/chat/profile-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          homeownerId: userData.id,
          housemateId: housemateId,
        }),
      });

      if (chatResponse.ok) {
        const { chatRoom } = await chatResponse.json();
        
        // Navigate to messages page with the chat room selected
        const userType = userData.userType;
        const messagesUrl = userType === "HOMEOWNER" 
          ? `/homeowner/messages?chatId=${chatRoom.id}` 
          : `/housemate/messages?chatId=${chatRoom.id}`;
          
        router.push(messagesUrl);
      } else {
        toast.error("Failed to start conversation. Please try again.");
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Failed to start conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleStartConversation} 
      className="w-full"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Starting conversation...
        </>
      ) : (
        <>
          <MessageCircle className="w-4 h-4 mr-2" />
          Message {housemateName.split(' ')[0]}
        </>
      )}
    </Button>
  );
} 