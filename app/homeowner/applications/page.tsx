import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, CheckCircle, XCircle, User, MessageSquare, Calendar, CalendarDays, FileText, Users, Home } from "lucide-react";
import Link from "next/link";
import { ApplicationActionButtons } from "../../components/ApplicationActionButtons";
import { format } from "date-fns";

async function getApplicationsForHomeowner(userId: string) {
  try {
    const applications = await prisma.application.findMany({
      where: {
        product: {
          userId: userId,
        },
      },
      include: {
        housemate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            housemateProfile: {
              select: {
                profilePicture: true,
                occupation: true,
                maxBudget: true,
                bio: true,
              },
            },
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        agreement: {
          select: {
            id: true,
            homeownerSigned: true,
            housemateSigned: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return applications;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

export default async function HomeownerApplicationsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const applications = await getApplicationsForHomeowner(user.id);

  const pendingApplications = applications.filter(app => app.status === "PENDING");
  const reviewedApplications = applications.filter(app => app.status !== "PENDING");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "APPROVED":
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-primary/10 text-primary border-primary/20";
      case "APPROVED":
        return "bg-green-50 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const ApplicationCard = ({ application, showActions = false }: { application: any, showActions?: boolean }) => (
    <Card className="shadow-lg border-0 w-full overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <Avatar className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full">
              <AvatarImage src={application.housemate.housemateProfile?.profilePicture} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm sm:text-base font-semibold">
                {application.housemate.firstName?.[0]}{application.housemate.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl text-gray-900 break-words">
                {application.housemate.firstName} {application.housemate.lastName}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600">
                Applied for: <span className="font-medium">{application.product.name}</span>
              </CardDescription>
              <p className="text-xs sm:text-sm text-gray-600 break-words">
                {application.housemate.housemateProfile?.occupation && 
                  `${application.housemate.housemateProfile.occupation} • `
                }
                Budget: <span className="font-medium text-primary">${application.housemate.housemateProfile?.maxBudget || 'Not specified'}/month</span>
              </p>
            </div>
          </div>
          <Badge
            className={`${getStatusColor(application.status)} flex items-center gap-1 sm:gap-2 border text-xs sm:text-sm px-2 sm:px-3 py-1 min-h-[32px] sm:min-h-[36px] shrink-0`}
          >
            {getStatusIcon(application.status)}
            <span className="break-words">
              {application.status === "APPROVED" 
                ? (application.agreement 
                    ? (application.agreement?.homeownerSigned 
                        ? (application.agreement?.housemateSigned ? "AGREEMENT COMPLETE" : "AWAITING HOUSEMATE SIGNATURE")
                        : "AGREEMENT NEEDS SIGNATURE") 
                    : "NEEDS AGREEMENT")
                : application.status}
            </span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6 bg-white rounded-b-lg space-y-4 sm:space-y-6 max-w-full">
        {/* Stay Duration Section */}
        {application.moveInDate && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              Intended Stay Period
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm sm:text-base font-semibold text-gray-900">Move-in Date</div>
                <div className="text-xs sm:text-sm text-primary font-medium mt-1">
                  {format(new Date(application.moveInDate), "MMMM dd, yyyy")}
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className={`w-10 h-10 ${application.moveOutDate ? 'bg-primary/10' : 'bg-gray-100'} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                  <Calendar className={`w-5 h-5 ${application.moveOutDate ? 'text-primary' : 'text-gray-400'}`} />
                </div>
                <div className="text-sm sm:text-base font-semibold text-gray-900">Move-out Date</div>
                <div className={`text-xs sm:text-sm ${application.moveOutDate ? 'text-primary' : 'text-gray-500'} font-medium mt-1`}>
                  {application.moveOutDate 
                    ? format(new Date(application.moveOutDate), "MMMM dd, yyyy")
                    : "Not specified (long-term)"
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bio Section */}
        {application.housemate.housemateProfile?.bio && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              About This Applicant
            </h4>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed break-words">
              {application.housemate.housemateProfile.bio}
            </p>
          </div>
        )}
        
        {/* Application Message Section */}
        {application.message && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              Application Message
            </h4>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed break-words bg-white p-3 sm:p-4 rounded-lg border border-gray-100">
              {application.message}
            </p>
          </div>
        )}
        
        {/* Actions Section - Mobile: Stacked, Desktop: Horizontal */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 pt-4 sm:pt-6 border-t border-gray-100">
          <span className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
            Applied on {new Date(application.createdAt).toLocaleDateString()}
          </span>
          
          {/* Mobile: Stacked buttons */}
          <div className="flex flex-col sm:hidden space-y-3">
                         <div className="grid grid-cols-2 gap-3">
               <Link href={`/profile/${application.housemate.id}`} className="w-full">
                 <Button variant="outline" size="sm" className="w-full min-h-[44px] text-xs">
                   <User className="w-4 h-4 mr-2" />
                   View Profile
                 </Button>
               </Link>
                             <Link href={`/homeowner/messages?housemate=${application.housemate.id}&product=${application.product.id}`} className="w-full">
                 <Button variant="outline" size="sm" className="w-full min-h-[44px] text-xs">
                   <MessageSquare className="w-4 h-4 mr-2" />
                   Message
                 </Button>
               </Link>
            </div>
            
            {showActions && application.status === "PENDING" && (
              <ApplicationActionButtons applicationId={application.id} />
            )}
            
            {application.status === "APPROVED" && (
              <Link href={`/homeowner/agreement/${application.id}`} className="w-full">
                <Button 
                  variant="default" 
                  size="sm" 
                  className={`w-full min-h-[44px] text-xs ${
                    application.agreement 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {application.agreement 
                    ? (application.agreement?.homeownerSigned 
                        ? (application.agreement?.housemateSigned ? "View Agreement" : "View Agreement (Pending)")
                        : "Complete Agreement")
                    : "Create Agreement"}
                </Button>
              </Link>
            )}
          </div>
          
                     {/* Desktop: Horizontal buttons */}
           <div className="hidden sm:flex gap-2 lg:gap-3">
             <Link href={`/profile/${application.housemate.id}`}>
               <Button variant="outline" size="sm">
                 <User className="w-4 h-4 mr-2" />
                 View Profile
               </Button>
             </Link>
            <Link href={`/homeowner/messages?housemate=${application.housemate.id}&product=${application.product.id}`}>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
            </Link>
            {showActions && application.status === "PENDING" && (
              <ApplicationActionButtons applicationId={application.id} />
            )}
            {application.status === "APPROVED" && (
              <Link href={`/homeowner/agreement/${application.id}`}>
                <Button 
                  variant="default" 
                  size="sm" 
                  className={application.agreement 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700'}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {application.agreement 
                    ? (application.agreement?.homeownerSigned 
                        ? (application.agreement?.housemateSigned ? "View Agreement" : "View Agreement (Pending)")
                        : "Complete Agreement")
                    : "Create Agreement"}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <Card className="shadow-lg border-0 w-full">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-4 sm:p-6 lg:p-8 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <CardTitle className="text-xl sm:text-2xl text-gray-900 mb-2">Property Applications</CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600">
              Review and manage applications from potential housemates
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="pending" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12 sm:h-14 bg-gray-100 rounded-xl p-1">
          <TabsTrigger 
            value="pending" 
            className="text-sm sm:text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
          >
            <Clock className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Pending </span>({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger 
            value="reviewed"
            className="text-sm sm:text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Reviewed </span>({reviewedApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 sm:space-y-6">
          {pendingApplications.length === 0 ? (
            <Card className="shadow-lg border-0 w-full">
              <CardContent className="p-6 sm:p-8 lg:p-12 text-center bg-white rounded-lg">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Pending Applications</h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                  You don't have any pending applications at the moment. Check back later for new applications.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {pendingApplications.map((application) => (
                <ApplicationCard 
                  key={application.id} 
                  application={application} 
                  showActions={true} 
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4 sm:space-y-6">
          {reviewedApplications.length === 0 ? (
            <Card className="shadow-lg border-0 w-full">
              <CardContent className="p-6 sm:p-8 lg:p-12 text-center bg-white rounded-lg">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Reviewed Applications</h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                  You haven't reviewed any applications yet. Approved and rejected applications will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {reviewedApplications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 