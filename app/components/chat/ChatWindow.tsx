"use client";

import { MessageCircle } from "lucide-react";
import { InlineChatInterface } from "./InlineChatInterface";

interface ChatWindowProps {
  selectedChatRoom: any;
  userType: "HOMEOWNER" | "HOUSEMATE";
  currentUserId: string;
  user?: any;
}

export function ChatWindow({ selectedChatRoom, userType, currentUserId, user }: ChatWindowProps) {
  if (!selectedChatRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a conversation
          </h3>
          <p className="text-gray-500 max-w-md">
            Choose a conversation from the left panel to view and send messages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <InlineChatInterface
      selectedChatRoom={selectedChatRoom}
      userType={userType}
      currentUserId={currentUserId}
      user={user}
    />
  );
} 