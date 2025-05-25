"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MessageCircle, User, UserCheck, FileText } from "lucide-react";
import { HomeownerChatModal } from "./HomeownerChatModal";

interface HomeownerChatCardProps {
  chatRoom: any;
  user: any;
}

export function HomeownerChatCard({ chatRoom, user }: HomeownerChatCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lastMessage = chatRoom.messages[0];
  const propertyImage = chatRoom.product.images[0];

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening chat modal
    // Navigate to housemate profile
    window.open(`/profile/${chatRoom.housemateId}`, '_blank');
  };

  const handleRequestApplication = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening chat modal
    // TODO: Implement application request functionality
    console.log("Request application from housemate:", chatRoom.housemateId);
  };

  return (
    <>
      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer" 
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-6">
          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewProfile}
              className="flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              View Housemate Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestApplication}
              className="flex items-center gap-2"
              disabled
            >
              <FileText className="w-4 h-4" />
              Request Application
            </Button>
          </div>

          <div className="flex items-start gap-4">
            {/* Housemate Profile Picture */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
              {chatRoom.housemate.profileImage ? (
                <Image
                  src={chatRoom.housemate.profileImage}
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
                    {chatRoom.housemate.firstName} {chatRoom.housemate.lastName?.charAt(0) || ''}.
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

      <HomeownerChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={chatRoom.productId}
        housemateId={chatRoom.housemateId}
        housemateName={`${chatRoom.housemate.firstName} ${chatRoom.housemate.lastName?.charAt(0) || ''}.`}
        productName={chatRoom.product.name}
        hostId={chatRoom.homeownerId}
        hostName={`${user.firstName} ${user.lastName}`}
      />
    </>
  );
} 