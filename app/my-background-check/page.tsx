import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import MyBackgroundCheckStatus from "@/app/components/MyBackgroundCheckStatus";

export default async function MyBackgroundCheckPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      {/* Back button */}
      <Link 
        href="/background-check"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Background Check
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Background Check Status
        </h1>
        <p className="text-gray-600">
          View your personal background check status and details. This information is automatically 
          retrieved using your account profile.
        </p>
      </div>

      {/* Status Component */}
      <MyBackgroundCheckStatus />

      {/* Additional Information */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">About This Page</h3>
        <div className="text-blue-800 text-sm space-y-2">
          <p>
            This page automatically shows your background check status using the email address 
            associated with your account: <strong>{user.email}</strong>
          </p>
          <p>
            If you don't see your background check information here, it may be because:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>You haven't started a background check yet</li>
            <li>Your background check was created with a different email address</li>
            <li>The information is still being processed</li>
          </ul>
          <p>
            If you believe there's an error, please contact support or try the manual status 
            checker on the <Link href="/background-check" className="underline">main background check page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
} 