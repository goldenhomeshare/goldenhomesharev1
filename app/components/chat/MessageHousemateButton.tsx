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
      } else if (chatResponse.status === 403) {
        // Handle messaging permission error
        const errorData = await chatResponse.json();
        console.error("Messaging permission error:", errorData);
        
        if (errorData.needsApproval) {
          toast.error("Messaging requires background check approval. Redirecting to background check page...", {
            duration: 4000,
          });
          // Redirect to background check page after a short delay
          setTimeout(() => {
            router.push("/background-check");
          }, 2000);
        } else {
          toast.error(errorData.reason || "You don't have permission to send messages.", {
            description: "Complete your profile setup to enable messaging",
            duration: 4000,
          });
          // If onboarding not completed, redirect to onboarding
          if (errorData.reason?.includes("profile setup")) {
            setTimeout(() => {
              router.push("/onboarding");
            }, 2000);
          }
        }
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