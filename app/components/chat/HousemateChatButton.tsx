"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleContinueConversation = async () => {
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
      
      // Create or get the chat room for this product
      const chatResponse = await fetch("/api/chat/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          hostId: hostId,
          housemateId: userData.id, // Current user is the housemate
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
        toast.error("Failed to continue conversation. Please try again.");
      }
    } catch (error) {
      console.error("Error continuing conversation:", error);
      toast.error("Failed to continue conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleContinueConversation}
      size="sm"
      variant="outline"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          <MessageCircle className="w-4 h-4 mr-2" />
          Continue Chat
        </>
      )}
    </Button>
  );
} 