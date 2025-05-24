import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, User, ArrowLeft } from "lucide-react";
import { HousemateChatButton } from "@/app/components/chat/HousemateChatButton";

async function getHousemateChats(userId: string) {
  const chatRooms = await prisma.chatRoom.findMany({
    where: {
      housemateId: userId,
    },
    include: {
      homeowner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
          images: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        include: {
          sender: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
    orderBy: {
      lastMessageAt: "desc",
    },
  });

  return chatRooms;
}

export default async function HousemateMessagesPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }
  
  const userType = (user as any).userType;
  
  if (userType !== "HOUSEMATE") {
    redirect("/onboarding");
  }

  const chatRooms = await getHousemateChats(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/housemate/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-2">
            Chat with homeowners about their properties
          </p>
        </div>
      </div>

      {chatRooms.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No messages yet</h3>
            <p className="text-muted-foreground">
              When you message homeowners about their properties, they'll appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {chatRooms.map((chatRoom: any) => {
            const lastMessage = chatRoom.messages[0];
            const propertyImage = chatRoom.product.images[0];
            
            return (
              <Card key={chatRoom.id} className="hover:shadow-md transition-shadow">
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
                      {lastMessage && (
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
                      )}

                      {/* Chat Button */}
                      <HousemateChatButton
                        productId={chatRoom.productId}
                        hostId={chatRoom.homeownerId}
                        hostName={`${chatRoom.homeowner.firstName} ${chatRoom.homeowner.lastName}`}
                        productName={chatRoom.product.name}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 