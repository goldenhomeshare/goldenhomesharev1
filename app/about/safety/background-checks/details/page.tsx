import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function BackgroundCheckDetails() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          <Link 
            href="/about/safety/background-checks"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Background Checks
          </Link>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Golden HomeShare Background Check</h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-8">


          {/* Overview */}
          <div id="overview" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Safe houseshare begins with the Golden HomeShare Background Check. To interact with families, all individual helpers you can hire on Golden HomeShare must first pass the Golden HomeShare Background Check, performed by our vendor, Checkr. Upon successful completion of a Golden HomeShare Background Check, helpers are able to message homeowners and book listings. Helpers are subject to annual criminal checks while active on the site. These checks leverage various data sources to look for updates to a helper's criminal record, using personal information provided by the helper.
            </p>
          </div>

          {/* When to use it */}
          <div id="when-to-use" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">When to use it</h2>
            <p className="text-gray-700 leading-relaxed">
              Golden HomeShare Background Checks are already run on all individual helpers you can hire on Golden HomeShare. For privacy, reports are not shared with families seeking care.
            </p>
          </div>

          {/* What's included */}
          <div id="whats-included" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What's included</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The Golden HomeShare Background Check includes the following:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Social Security Number (SSN) Trace</h3>
                <p className="text-gray-700 leading-relaxed">
                  This is an address locator search that compares the provided Social Security number to certain credit and public records data to help identify an individual's address history, alternative names and aliases. This check is used to help our vendor, Checkr, determine the names and jurisdictions under which criminal records should be searched. The SSN Trace is not conducted through the Social Security Administration and may not be used as the basis for any employment decision, and it is not confirmation of an individual's identity. Alias names derived from SSN Trace results are included in the Sex Offender Search (NSOPW) and Multi-Jurisdictional Database Search (described below), but they are not included in County Criminal Records or the Federal criminal searches.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Jurisdictional Database Search</h3>
                <p className="text-gray-700 leading-relaxed">
                  Sometimes referred to as a "National Criminal Database Search" or a "National Criminal File," this is a multi-jurisdictional database search of certain publicly available and non-public purchased records from state, county, and other sources. The information available in the database varies by jurisdiction and may not cover all counties in a particular state or all criminal record history for a particular individual. The source records are subject to availability, and the results are subject to applicable federal and state reporting restrictions. For some jurisdictions, no information is available at all. For jurisdictions in which some criminal data is included, it may be limited to a subset of criminal convictions (e.g., the database may not include arrest information or all types of convictions). In addition, the frequency with which the records in this database are updated varies from jurisdiction to jurisdiction. Checkr verifies any possible hits in this database against primary source records in the courts of original jurisdiction.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sex Offender Search (NSOPW)</h3>
                <p className="text-gray-700 leading-relaxed">
                  This is a search of the Federal Department of Justice National Sex Offender Public Website (NSOPW). Reports from this check include sex offender registry data covering 49 states, excluding Nevada, and including the District of Columbia and US territories. This search is subject to federal and state limitations, availability, and applicable reporting limitations, and may not reflect an individual's entire sex offender history.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Federal Courthouse Records Search</h3>
                <p className="text-gray-700 leading-relaxed">
                  This is a search of Federal US District Courts via the Federal Public Access to Court Electronic Records (PACER) system based on the last 7 years of the subject's address history as derived from SSN Trace results. This check may report records relating to federal crimes (for example, money laundering, drug trafficking, kidnapping, counterfeiting, racketeering, and crimes committed across state lines). Checkr will report all available criminal history information that can be reported pursuant to the Fair Credit Reporting Act and applicable state laws, which, depending on the jurisdiction, may not include history such as arrests, pending cases, or non-conviction records more than 7 years old.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">County Criminal Records Search</h3>
                <p className="text-gray-700 leading-relaxed">
                  This is a search of criminal records for each county where the subject is believed to have lived in the past 7 years based on information provided by the individual and returned in the SSN Trace. This search is conducted electronically (where available) and manually, if necessary, in these counties. Checkr will report available criminal history information that can be reported pursuant to the Fair Credit Reporting Act and applicable state laws, which, depending on the jurisdiction, may not include non-conviction records more than 7 years old. Due to legal restrictions in certain states (such as California, Kentucky, New Mexico, and New York), Checkr is prohibited from reporting most arrest or other non-conviction information, so only criminal convictions are typically reported. The search typically does not include records from magisterial courts in Pennsylvania or municipal courts in New Jersey.
                </p>
              </div>
            </div>


          </div>

          {/* Special limitations */}
          <div id="special-limitations" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Special limitations for Massachusetts and New Hampshire</h2>
            <p className="text-gray-700 leading-relaxed">
              Due to state-specific regulations, background check processes and reporting may have additional limitations in Massachusetts and New Hampshire. For specific details about how these limitations may affect background check results in your state, please contact our support team.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-center">
            <Link 
              href="/about/safety/background-checks"
              className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Background Checks
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 