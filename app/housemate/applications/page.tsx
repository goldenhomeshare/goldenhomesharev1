import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, Home, Calendar, CalendarDays, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

async function getApplications(userId: string) {
  const applications = await prisma.application.findMany({
    where: {
      housemateId: userId,
    },
    include: {
      product: {
        include: {
          User: {
            include: {
              homeownerProfile: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return applications;
}

export default async function HousemateApplicationsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const applications = await getApplications(user.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "APPROVED":
        return <CheckCircle className="h-4 w-4" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Mobile-Optimized Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            {/* Mobile Back Button */}
            <div className="flex items-center gap-3 mb-2 sm:hidden">
              <Link href="/housemate/dashboard" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Track your housing applications and their status
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link href="/products/template">
              <Button className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" />
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <Card className="mx-auto max-w-md">
          <CardContent className="py-8 text-center">
            <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              You haven't submitted any applications yet. Browse available properties to get started.
            </p>
            <Link href="/products/template">
              <Button className="w-full">Browse Properties</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {applications.map((application) => (
            <Card key={application.id} className="overflow-hidden">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg sm:text-xl break-words">
                      {application.product.name}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-1">
                      <span className="font-semibold">${application.product.price}/month</span>
                      {application.product.address && (
                        <>
                          <span className="mx-1">•</span>
                          <span className="break-words">{application.product.address}</span>
                        </>
                      )}
                    </CardDescription>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Host: {application.product.User?.firstName} {application.product.User?.lastName}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge
                      className={`${getStatusColor(application.status)} flex items-center gap-1 text-xs`}
                    >
                      {getStatusIcon(application.status)}
                      {application.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stay Duration Section - Mobile Optimized */}
                {application.moveInDate && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <CalendarDays className="h-4 w-4 text-green-600 flex-shrink-0" />
                      Your Requested Stay Period
                    </h4>
                    <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="font-medium text-sm">Move-in Date:</span>
                          <br />
                          <span className="text-green-700 text-sm break-words">
                            {format(new Date(application.moveInDate), "MMMM dd, yyyy")}
                          </span>
                        </div>
                      </div>
                      {application.moveOutDate ? (
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="font-medium text-sm">Move-out Date:</span>
                            <br />
                            <span className="text-green-700 text-sm break-words">
                              {format(new Date(application.moveOutDate), "MMMM dd, yyyy")}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="font-medium text-sm">Move-out Date:</span>
                            <br />
                            <span className="text-gray-500 text-sm">Not specified (long-term)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Message Section - Mobile Optimized */}
                {application.message && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm sm:text-base">Your Message:</h4>
                    <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md leading-relaxed break-words">
                      {application.message}
                    </p>
                  </div>
                )}
                
                {/* Actions Section - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-2 border-t border-gray-100">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Applied on {new Date(application.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link href={`/product/${application.product.id}`} className="flex-1 sm:flex-none">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        View Property
                      </Button>
                    </Link>
                    {application.status === "APPROVED" && (
                      <Link href={`/billing?application=${application.id}`} className="flex-1 sm:flex-none">
                        <Button size="sm" className="w-full sm:w-auto">
                          Complete Booking
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 