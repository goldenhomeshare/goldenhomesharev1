"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { MessageCircle, User } from "lucide-react";
import { ChatModal } from "./ChatModal";

interface HousemateChatCardProps {
  chatRoom: any;
}

export function HousemateChatCard({ chatRoom }: HousemateChatCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lastMessage = chatRoom.messages[0];
  const propertyImage = chatRoom.product.images[0];

  return (
    <>
      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer" 
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Homeowner Profile Picture */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
              {chatRoom.homeowner.profileImage ? (
                <Image
                  src={chatRoom.homeowner.profileImage}
                  alt="Profile picture"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-lg">
                    {chatRoom.homeowner.firstName} {chatRoom.homeowner.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    About: {chatRoom.product.name}
                  </p>
                </div>
                
                {/* Property Image */}
                {propertyImage && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <Image
                      src={propertyImage}
                      alt="Property"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Last Message */}
              {lastMessage ? (
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">
                      {lastMessage.sender.firstName}:
                    </span>{" "}
                    {lastMessage.content.length > 100
                      ? `${lastMessage.content.substring(0, 100)}...`
                      : lastMessage.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(lastMessage.createdAt).toLocaleDateString()} at{" "}
                    {new Date(lastMessage.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ) : (
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground italic">
                    Click to start the conversation
                  </p>
                </div>
              )}

              {/* Click to chat indicator */}
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <MessageCircle className="w-4 h-4" />
                <span>Click to continue chat</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={chatRoom.productId}
        hostId={chatRoom.homeownerId}
        hostName={`${chatRoom.homeowner.firstName} ${chatRoom.homeowner.lastName}`}
        productName={chatRoom.product.name}
      />
    </>
  );
} 