import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { BackgroundCheckForm } from './components/BackgroundCheckForm';

export default async function BackgroundCheckPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const initialFormData = {
    firstName: user?.given_name || '',
    middleName: '',
    lastName: user?.family_name || '',
    email: user?.email || '',
    phone: '',
    zipcode: '',
    workLocation: {
      country: 'US', // Always US
      state: '',
      city: '',
    },
    package: 'basic_for_golden_homeshare',
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Background Check</h1>
        <p className="text-muted-foreground">
          Complete your background check to continue with the verification process
        </p>
        {!user && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 <strong>Tip:</strong> Log in first to automatically populate your name and email address.
                  </p>
                </div>
              )}
            </div>

      <BackgroundCheckForm initialData={initialFormData} />
    </div>
  );
}