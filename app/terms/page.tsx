import Link from "next/link";
import { Shield, CreditCard, Users, Home, FileText, Calendar, MapPin, Phone, Mail } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Terms of Use
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Legal terms governing your use of Golden HomeShare services.
            </p>
            <div className="flex justify-center gap-4 text-sm text-gray-500">
              <span>Last updated: May 31, 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          
          {/* Agreement Header */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Agreement to Our Legal Terms</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We are <strong>GOLDEN HOMESHARE LLC</strong> ("Company," "we," "us," "our"), a company registered in Missouri, United States at 325 West Sea Ave., Independence, MO 64050.
              </p>
              <p>
                We operate the website <Link href="/" className="text-primary hover:underline">goldenhomeshare.com</Link> (the "Site"), as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").
              </p>
              <p>
                Our platform helps older homeowners list their home to find a housemate to help with simple tasks. The homeowner gets help and the housemate gets affordable living arrangements.
              </p>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="font-semibold text-blue-900 mb-2">Contact Information:</p>
                <div className="space-y-1 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>Phone: (816) 433-2979</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Email: support@goldenhomeshare.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Address: 1209 E Walnut St, Columbia, MO 65201, United States</span>
                  </div>
                </div>
              </div>
              <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                <p className="font-semibold text-yellow-800">
                  IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
                </p>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Table of Contents</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <a href="#our-services" className="block text-primary hover:underline">1. Our Services</a>
                <a href="#intellectual-property" className="block text-primary hover:underline">2. Intellectual Property Rights</a>
                <a href="#user-representations" className="block text-primary hover:underline">3. User Representations</a>
                <a href="#user-registration" className="block text-primary hover:underline">4. User Registration</a>
                <a href="#purchases-payment" className="block text-primary hover:underline">5. Purchases and Payment</a>
                <a href="#policy" className="block text-primary hover:underline">6. Policy</a>
                <a href="#prohibited-activities" className="block text-primary hover:underline">7. Prohibited Activities</a>
                <a href="#user-contributions" className="block text-primary hover:underline">8. User Generated Contributions</a>
                <a href="#contribution-license" className="block text-primary hover:underline">9. Contribution License</a>
                <a href="#review-guidelines" className="block text-primary hover:underline">10. Guidelines for Reviews</a>
                <a href="#social-media" className="block text-primary hover:underline">11. Social Media</a>
                <a href="#third-party" className="block text-primary hover:underline">12. Third-Party Websites and Content</a>
                <a href="#services-management" className="block text-primary hover:underline">13. Services Management</a>
                <a href="#privacy-policy" className="block text-primary hover:underline">14. Privacy Policy</a>
                <a href="#copyright" className="block text-primary hover:underline">15. Copyright Infringements</a>
              </div>
              <div className="space-y-2">
                <a href="#term-termination" className="block text-primary hover:underline">16. Term and Termination</a>
                <a href="#modifications" className="block text-primary hover:underline">17. Modifications and Interruptions</a>
                <a href="#governing-law" className="block text-primary hover:underline">18. Governing Law</a>
                <a href="#dispute-resolution" className="block text-primary hover:underline">19. Dispute Resolution</a>
                <a href="#corrections" className="block text-primary hover:underline">20. Corrections</a>
                <a href="#disclaimer" className="block text-primary hover:underline">21. Disclaimer</a>
                <a href="#limitations" className="block text-primary hover:underline">22. Limitations of Liability</a>
                <a href="#indemnification" className="block text-primary hover:underline">23. Indemnification</a>
                <a href="#user-data" className="block text-primary hover:underline">24. User Data</a>
                <a href="#electronic-communications" className="block text-primary hover:underline">25. Electronic Communications</a>
                <a href="#california-users" className="block text-primary hover:underline">26. California Users and Residents</a>
                <a href="#miscellaneous" className="block text-primary hover:underline">27. Miscellaneous</a>
                <a href="#license-agreement" className="block text-primary hover:underline">28. License Agreement Reminder</a>
                <a href="#local-compliance" className="block text-primary hover:underline">29. Local Compliance Clause</a>
                <a href="#contact" className="block text-primary hover:underline">30. Contact Us</a>
              </div>
            </div>
          </div>

          {/* Our Services */}
          <div id="our-services" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Our Services</h2>
            <p className="text-gray-700">
              The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. The Services are intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to use or register for the Services.
            </p>
          </div>

          {/* Intellectual Property Rights */}
          <div id="intellectual-property" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Intellectual Property Rights</h2>
            <div className="space-y-6 text-gray-700">
              
              {/* Our intellectual property */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Our intellectual property</h3>
                <div className="space-y-4">
                  <p>
                    We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").
                  </p>
                  <p>
                    Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties in the United States and around the world.
                  </p>
                  <p>
                    The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use only.
                  </p>
                </div>
              </div>

              {/* Your use of our Services */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your use of our Services</h3>
                <div className="space-y-4">
                  <p>
                    Subject to your compliance with these Legal Terms, including the "PROHIBITED ACTIVITIES" section below, we grant you a non-exclusive, non-transferable, revocable license to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>access the Services; and</li>
                    <li>download or print a copy of any portion of the Content to which you have properly gained access, solely for your personal, non-commercial use.</li>
                  </ul>
                  <p>
                    Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
                  </p>
                  <p>
                    If you wish to make any use of the Services, Content, or Marks other than as set out in this section or elsewhere in our Legal Terms, please address your request to: support@goldenhomeshare.com. If we ever grant you the permission to post, reproduce, or publicly display any part of our Services or Content, you must identify us as the owners or licensors of the Services, Content, or Marks and ensure that any copyright or proprietary notice appears or is visible on posting, reproducing, or displaying our Content.
                  </p>
                  <p>
                    We reserve all rights not expressly granted to you in and to the Services, Content, and Marks.
                  </p>
                </div>
              </div>

              {/* Your submissions and contributions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your submissions and contributions</h3>
                <div className="space-y-4">
                  <p>
                    Please review this section and the "PROHIBITED ACTIVITIES" section carefully prior to using our Services to understand the (a) rights you give us and (b) obligations you have when you post or upload any content through the Services.
                  </p>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Submissions:</h4>
                    <p>
                      By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services ("Submissions"), you agree to assign to us all intellectual property rights in such Submission. You agree that we shall own this Submission and be entitled to its unrestricted use and dissemination for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contributions:</h4>
                    <p>
                      The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality during which you may create, submit, post, display, transmit, publish, distribute, or broadcast content and materials to us or through the Services, including but not limited to text, writings, video, audio, photographs, music, graphics, comments, reviews, rating suggestions, personal information, or other material ("Contributions"). Any Submission that is publicly posted shall also be treated as a Contribution.
                    </p>
                    <p>
                      You understand that Contributions may be viewable by other users of the Services and possibly through third-party websites.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">When you post Contributions, you grant us a license (including use of your name, trademarks, and logos):</h4>
                    <p>
                      By posting any Contributions, you grant us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and license to: use, copy, reproduce, distribute, sell, resell, publish, broadcast, retitle, store, publicly perform, publicly display, reformat, translate, excerpt (in whole or in part), and exploit your Contributions (including, without limitation, your image, name, and voice) for any purpose, commercial, advertising, or otherwise, to prepare derivative works of, or incorporate into other works, your Contributions, and to sublicense the licenses granted in this section. Our use and distribution may occur in any media formats and through any media channels.
                    </p>
                    <p>
                      This license includes our use of your name, company name, and franchise name, as applicable, and any of the trademarks, service marks, trade names, logos, and personal and commercial images you provide.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">You are responsible for what you post or upload:</h4>
                    <p>
                      By sending us Submissions and/or posting Contributions through any part of the Services or making Contributions accessible through the Services by linking your account through the Services to any of your social networking accounts, you:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>confirm that you have read and agree with our "PROHIBITED ACTIVITIES" and will not post, send, publish, upload, or transmit through the Services any Submission nor post any Contribution that is illegal, harassing, hateful, harmful, defamatory, obscene, bullying, abusive, discriminatory, threatening to any person or group, sexually explicit, false, inaccurate, deceitful, or misleading;</li>
                      <li>to the extent permissible by applicable law, waive any and all moral rights to any such Submission and/or Contribution;</li>
                      <li>warrant that any such Submission and/or Contributions are original to you or that you have the necessary rights and licenses to submit such Submissions and/or Contributions and that you have full authority to grant us the above-mentioned rights in relation to your Submissions and/or Contributions; and</li>
                      <li>warrant and represent that your Submissions and/or Contributions do not constitute confidential information.</li>
                    </ul>
                    <p>
                      You are solely responsible for your Submissions and/or Contributions and you expressly agree to reimburse us for any and all losses that we may suffer because of your breach of (a) this section, (b) any third party's intellectual property rights, or (c) applicable law.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">We may remove or edit your Content:</h4>
                    <p>
                      Although we have no obligation to monitor any Contributions, we shall have the right to remove or edit any Contributions at any time without notice if in our reasonable opinion we consider such Contributions harmful or in breach of these Legal Terms. If we remove or edit any such Contributions, we may also suspend or disable your account and report you to the authorities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Copyright infringement */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Copyright infringement</h3>
                <p>
                  We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please immediately refer to the "COPYRIGHT INFRINGEMENTS" section below.
                </p>
              </div>
            </div>
          </div>

          {/* User Representations */}
          <div id="user-representations" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. User Representations</h2>
            <p className="text-gray-700 mb-4">By using the Services, you represent and warrant that:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>all registration information you submit will be true, accurate, current, and complete;</li>
              <li>you will maintain the accuracy of such information and promptly update such registration information as necessary;</li>
              <li>you have the legal capacity and you agree to comply with these Legal Terms;</li>
              <li>you are not a minor in the jurisdiction in which you reside;</li>
              <li>you will not access the Services through automated or non-human means, whether through a bot, script or otherwise;</li>
              <li>you will not use the Services for any illegal or unauthorized purpose; and</li>
              <li>your use of the Services will not violate any applicable law or regulation.</li>
            </ol>
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Services.
              </p>
            </div>
                  </div>

          {/* User Registration */}
          <div id="user-registration" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. User Registration</h2>
            <p className="text-gray-700">
              You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
            </p>
                  </div>

          {/* Purchases and Payment */}
          <div id="purchases-payment" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Purchases and Payment</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-700 mb-4">We accept the following forms of payment:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium">Visa</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium">Mastercard</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium">American Express</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium">Discover</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in US dollars.
                </p>
                <p>
                  You agree to pay all charges at the prices then in effect for your purchases and any applicable shipping fees, and you authorize us to charge your chosen payment provider for any such amounts upon placing your order. We reserve the right to correct any errors or mistakes in pricing, even if we have already requested or received payment.
                </p>
                <p>
                  We reserve the right to refuse any order placed through the Services. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. These restrictions may include orders placed by or under the same customer account, the same payment method, and/or orders that use the same billing or shipping address. We reserve the right to limit or prohibit orders that, in our sole judgment, appear to be placed by dealers, resellers, or distributors.
                </p>
              </div>
            </div>
          </div>

          {/* Policy */}
          <div id="policy" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Policy</h2>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-semibold">All sales are final and no refund will be issued.</p>
          </div>
        </div>

          {/* Prohibited Activities */}
          <div id="prohibited-activities" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Prohibited Activities</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
              </p>
              <p>As a user of the Services, you agree not to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
                <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
                <li>Circumvent, disable, or otherwise interfere with security-related features of the Services.</li>
                <li>Disparage, tarnish, or otherwise harm us and/or the Services.</li>
                <li>Use any information obtained from the Services in order to harass, abuse, or harm another person.</li>
                <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
                <li>Use the Services in a manner inconsistent with any applicable laws or regulations.</li>
                <li>Engage in unauthorized framing of or linking to the Services.</li>
                <li>Upload or transmit viruses or other material, including spamming, that interferes with the use of the Services.</li>
                <li>Engage in automated use of the system or data mining, bots, etc.</li>
                <li>Delete copyright or proprietary rights notices.</li>
                <li>Impersonate another user or use another's username.</li>
                <li>Use spyware or tracking tools like 1x1 pixels or cookies.</li>
                <li>Interfere with the networks connected to the Services.</li>
                <li>Harass or threaten our staff.</li>
                <li>Bypass security features.</li>
                <li>Copy or adapt software.</li>
                <li>Decompile or reverse-engineer the software.</li>
                <li>Use bots or scrapers outside of standard search engine use.</li>
                <li>Use purchasing agents.</li>
                <li>Use the Services for unsolicited email or spam.</li>
                <li>Compete with us using the Services.</li>
                <li>Sell or transfer your profile.</li>
              </ul>
            </div>
              </div>

          {/* User Generated Contributions */}
          <div id="user-contributions" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. User Generated Contributions</h2>
            <div className="space-y-4 text-gray-700">
              <p>The Services may invite you to submit content. You agree:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Your contributions do not infringe any third-party rights.</li>
                <li>You have all necessary licenses and consents.</li>
                <li>Any persons identifiable in your content have given permission.</li>
                <li>Your content is not false, misleading, obscene, harassing, or illegal.</li>
                <li>You do not promote violence or solicitations.</li>
                <li>You do not include offensive or discriminatory remarks.</li>
                <li>You do not violate the law or any rights.</li>
              </ul>
              <p>Any violations may result in suspension or termination of your account.</p>
            </div>
            </div>
            
          {/* Contribution License */}
          <div id="contribution-license" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Contribution License</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                You and Services agree that we may access, store, process, and use any information and personal data that you provide following the terms of the Privacy Policy and your choices (including settings).
              </p>
              <p>
                By submitting suggestions or other feedback regarding the Services, you agree that we can use and share such feedback for any purpose without compensation to you.
              </p>
              <p>
                We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable for any statements or representations in your Contributions provided by you in any area on the Services. You are solely responsible for your Contributions to the Services and you expressly agree to exonerate us from any and all responsibility and to refrain from any legal action against us regarding your Contributions.
              </p>
            </div>
          </div>

          {/* Guidelines for Reviews */}
          <div id="review-guidelines" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Guidelines for Reviews</h2>
            <div className="space-y-4 text-gray-700">
              <p>We may provide you areas on the Services to leave reviews or ratings. When posting a review, you must comply with the following criteria:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>you should have firsthand experience with the person/entity being reviewed;</li>
                <li>your reviews should not contain offensive profanity, or abusive, racist, offensive, or hate language;</li>
                <li>your reviews should not contain discriminatory references based on religion, race, gender, national origin, age, marital status, sexual orientation, or disability;</li>
                <li>your reviews should not contain references to illegal activity;</li>
                <li>you should not be affiliated with competitors if posting negative reviews;</li>
                <li>you should not make any conclusions as to the legality of conduct;</li>
                <li>you may not post any false or misleading statements;</li>
                <li>you may not organize a campaign encouraging others to post reviews, whether positive or negative.</li>
              </ol>
              <p>
                We may accept, reject, or remove reviews in our sole discretion. We have absolutely no obligation to screen reviews or to delete reviews, even if anyone considers reviews objectionable or inaccurate.
                  </p>
                </div>
              </div>

          {/* Social Media */}
          <div id="social-media" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Social Media</h2>
            <p className="text-gray-700">
              As part of the functionality of the Services, you may link your account with online accounts you have with third-party service providers (each such account, a "Third-Party Account") by either: (1) providing your Third-Party Account login information through the Services; or (2) allowing us to access your Third-Party Account, as is permitted under the applicable terms and conditions that govern your use of each Third-Party Account. You represent and warrant that you are entitled to disclose your Third-Party Account login information to us and/or grant us access to your Third-Party Account, without breach by you of any of the terms and conditions that govern your use of the applicable Third-Party Account, and without obligating us to pay any fees or making us subject to any usage limitations imposed by the third-party service provider of the Third-Party Account.
            </p>
          </div>

          {/* Third-Party Websites and Content */}
          <div id="third-party" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">12. Third-Party Websites and Content</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                The Services may contain (or you may be sent via the Site) links to other websites ("Third-Party Websites") as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties ("Third-Party Content"). Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us, and we are not responsible for any Third-Party Websites accessed through the Services or any Third-Party Content posted on, available through, or installed from the Services.
              </p>
              <p>
                If you decide to leave the Services and access the Third-Party Websites or to use or install any Third-Party Content, you do so at your own risk, and you should be aware these Legal Terms no longer govern. You should review the applicable terms and policies, including privacy and data gathering practices, of any website to which you navigate from the Services or relating to any applications you use or install from the Services.
              </p>
            </div>
                      </div>
                      
          {/* Services Management */}
          <div id="services-management" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">13. Services Management</h2>
            <div className="space-y-4 text-gray-700">
              <p>We reserve the right, but not the obligation, to:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>monitor the Services for violations of these Legal Terms;</li>
                <li>take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms, including without limitation, reporting such user to law enforcement authorities;</li>
                <li>in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof;</li>
                <li>in our sole discretion and without limitation, notice, or liability, to remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems;</li>
                <li>otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services.</li>
              </ol>
                      </div>
                    </div>

          {/* Privacy Policy */}
          <div id="privacy-policy" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">14. Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We care about data privacy and security. Please review our Privacy Policy:
            </p>
            <a 
              href="/privacy" 
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <FileText className="w-4 h-4" />
              View Privacy Policy
            </a>
            <p className="text-gray-700 mt-4">
              By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms. Please be advised the Services are hosted in the United States.
            </p>
          </div>

          {/* Copyright Infringements */}
          <div id="copyright" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">15. Copyright Infringements</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please immediately notify us using the contact information provided below (a "Notification"). A copy of your Notification will be sent to the person who posted or stored the material addressed in the Notification.
              </p>
              <p>
                Please be advised that pursuant to applicable law you may be held liable for damages if you make material misrepresentations in a Notification. Thus, if you are not sure that material located on or linked to by the Services infringes your copyright, you should consider first contacting an attorney.
              </p>
                  </div>
                </div>

          {/* Term and Termination */}
          <div id="term-termination" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">16. Term and Termination</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                These Legal Terms shall remain in full force and effect while you use the Services.
              </p>
              <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                <p className="text-red-800 font-semibold">
                  WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE YOUR ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.
                </p>
              </div>
            </div>
          </div>

          {/* Modifications and Interruptions */}
          <div id="modifications" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">17. Modifications and Interruptions</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Services. We also reserve the right to modify or discontinue all or part of the Services without notice at any time. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.
              </p>
              <p>
                We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Services at any time or for any reason without notice to you. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Services during any downtime or discontinuance of the Services. Nothing in these Legal Terms will be construed to obligate us to maintain and support the Services or to supply any corrections, updates, or releases in connection therewith.
              </p>
            </div>
                  </div>
                  
          {/* Governing Law */}
          <div id="governing-law" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">18. Governing Law</h2>
            <p className="text-gray-700">
              These Legal Terms and your use of the Services are governed by and construed in accordance with the laws of the State of Missouri applicable to agreements made and to be entirely performed within the State of Missouri, without regard to its conflict of law principles.
            </p>
                  </div>
                  
          {/* Dispute Resolution */}
          <div id="dispute-resolution" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">19. Dispute Resolution</h2>
            <div className="space-y-6">
                  <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Informal Negotiations</h3>
                <p className="text-gray-700">
                  To expedite resolution and control the cost of any dispute, controversy, or claim related to these Legal Terms (each a "Dispute" and collectively, the "Disputes") brought by either you or us (individually, a "Party" and collectively, the "Parties"), the Parties agree to first attempt to negotiate any Dispute (except those Disputes expressly provided below) informally for at least fifteen (15) days before initiating arbitration. Such informal negotiations commence upon written notice from one Party to the other Party.
                </p>
                    </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Binding Arbitration</h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If the Parties are unable to resolve a Dispute through informal negotiations, the Dispute (except those Disputes expressly excluded below) will be finally and exclusively resolved by binding arbitration.
                  </p>
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-red-800 font-semibold">
                      YOU UNDERSTAND THAT WITHOUT THIS PROVISION, YOU WOULD HAVE THE RIGHT TO SUE IN COURT AND HAVE A JURY TRIAL.
                    </p>
                  </div>
                  <p>
                    The arbitration shall be commenced and conducted under the Commercial Arbitration Rules of the American Arbitration Association ("AAA") and, where appropriate, the AAA's Supplementary Procedures for Consumer Related Disputes ("AAA Consumer Rules"), both of which are available at the American Arbitration Association (AAA) website. Your arbitration fees and your share of arbitrator compensation shall be governed by the AAA Consumer Rules and, where appropriate, limited by the AAA Consumer Rules. The arbitration may be conducted in person, through the submission of documents, by phone, or online. The arbitrator will make a decision in writing, but need not provide a statement of reasons unless requested by either Party. The arbitrator must follow applicable law, and any award may be challenged if the arbitrator fails to do so. Except where otherwise required by the applicable AAA rules or applicable law, the arbitration will take place in United States, Missouri. Except as otherwise provided herein, the Parties may litigate in court to compel arbitration, stay proceedings pending arbitration, or to confirm, modify, vacate, or enter judgment on the award entered by the arbitrator.
                  </p>
                  <p>
                    If for any reason, a Dispute proceeds in court rather than arbitration, the Dispute shall be commenced or prosecuted in the state and federal courts located in Boone County, Missouri, and the Parties hereby consent to, and waive all defenses of lack of personal jurisdiction, and forum non conveniens with respect to venue and jurisdiction in such state and federal courts. Application of the United Nations Convention on Contracts for the International Sale of Goods and the Uniform Computer Information Transaction Act (UCITA) are excluded from these Legal Terms.
                  </p>
                  <p>
                    In no event shall any Dispute brought by either Party related in any way to the Services be commenced more than one (1) year after the cause of action arose. If this provision is found to be illegal or unenforceable, then neither Party will elect to arbitrate any Dispute falling within that portion of this provision found to be illegal or unenforceable and such Dispute shall be decided by a court of competent jurisdiction within the courts listed for jurisdiction above, and the Parties agree to submit to the personal jurisdiction of that court.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Restrictions</h3>
                <div className="space-y-4 text-gray-700">
                  <p>The Parties agree that any arbitration shall be limited to the Dispute between the Parties individually. To the full extent permitted by law,</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>no arbitration shall be joined with any other proceeding;</li>
                    <li>there is no right or authority for any Dispute to be arbitrated on a class-action basis or to utilize class action procedures; and</li>
                    <li>there is no right or authority for any Dispute to be brought in a purported representative capacity on behalf of the general public or any other persons.</li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Exceptions to Informal Negotiations and Arbitration</h3>
                <div className="space-y-4 text-gray-700">
                  <p>The Parties agree that the following Disputes are not subject to the above provisions concerning informal negotiations and binding arbitration:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>any Disputes seeking to enforce or protect, or concerning the validity of, any of the intellectual property rights of a Party;</li>
                    <li>any Dispute related to, or arising from, allegations of theft, piracy, invasion of privacy, or unauthorized use; and</li>
                    <li>any claim for injunctive relief.</li>
                  </ul>
                  <p>
                    If this provision is found to be illegal or unenforceable, then neither Party will elect to arbitrate any Dispute falling within that portion of this provision found to be illegal or unenforceable and such Dispute shall be decided by a court of competent jurisdiction within the courts listed for jurisdiction above, and the Parties agree to submit to the personal jurisdiction of that court.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Corrections */}
          <div id="corrections" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">20. Corrections</h2>
            <p className="text-gray-700">
              There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.
            </p>
        </div>

          {/* Disclaimer */}
          <div id="disclaimer" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">21. Disclaimer</h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <p className="text-gray-700 font-semibold mb-4">
                  THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p className="text-gray-700 font-semibold mb-4">
                  WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES' CONTENT OR THE CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS,</li>
                  <li>PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES,</li>
                  <li>ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN,</li>
                  <li>ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES,</li>
                  <li>ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD PARTY, AND/OR</li>
                  <li>ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES.</li>
                </ul>
                <p className="text-gray-700 font-semibold mt-4">
                  WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SERVICES, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.
                </p>
                <p className="text-gray-700 font-semibold">
                  AS WITH THE PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGMENT AND EXERCISE CAUTION WHERE APPROPRIATE.
                </p>
              </div>
            </div>
          </div>

          {/* Limitations of Liability */}
          <div id="limitations" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">22. Limitations of Liability</h2>
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
              <p className="text-red-800 font-semibold mb-4">
                IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p className="text-red-800 text-sm">
                NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE LESSER OF THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING OR $500.00 USD. CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.
              </p>
            </div>
          </div>

          {/* Indemnification */}
          <div id="indemnification" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">23. Indemnification</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>your Contributions;</li>
                <li>use of the Services;</li>
                <li>breach of these Legal Terms;</li>
                <li>any breach of your representations and warranties set forth in these Legal Terms;</li>
                <li>your violation of the rights of a third party, including but not limited to intellectual property rights; or</li>
                <li>any overt harmful act toward any other user of the Services with whom you connected via the Services.</li>
                </ul>
              <p>
                Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our defense of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming aware of it.
              </p>
            </div>
          </div>

          {/* User Data */}
          <div id="user-data" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">24. User Data</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.
              </p>
            </div>
              </div>
              
          {/* Electronic Communications */}
          <div id="electronic-communications" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">25. Electronic Communications, Transactions, and Signatures</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing.
              </p>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-blue-800 font-semibold">
                  YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES.
                </p>
              </div>
              <p>
                You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means.
              </p>
            </div>
          </div>

          {/* California Users */}
          <div id="california-users" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">26. California Users and Residents</h2>
            <p className="text-gray-700">
              If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112, Sacramento, California 95834 or by telephone at (800) 952-5210 or (916) 445-1254.
            </p>
          </div>

          {/* Miscellaneous */}
          <div id="miscellaneous" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">27. Miscellaneous</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control. If any provision or part of a provision of these Legal Terms is determined to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable from these Legal Terms and does not affect the validity and enforceability of any remaining provisions. There is no joint venture, partnership, employment or agency relationship created between you and us as a result of these Legal Terms or use of the Services. You agree that these Legal Terms will not be construed against us by virtue of having drafted them. You hereby waive any and all defenses you may have based on the electronic form of these Legal Terms and the lack of signing by the parties hereto to execute these Legal Terms.
              </p>
            </div>
          </div>

          {/* License Agreement Reminder */}
          <div id="license-agreement" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">28. License Agreement Reminder</h2>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Important Legal Distinction</h3>
              </div>
              <p className="text-blue-800">
                All living arrangements facilitated through Golden HomeShare are governed by <strong>license agreements, not leases</strong>. This distinction is critical and is intended to protect both parties under Missouri law.
              </p>
            </div>
          </div>

          {/* Local Compliance */}
          <div id="local-compliance" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">29. Local Compliance Clause</h2>
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Home className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-900">User Responsibility</h3>
              </div>
              <p className="text-yellow-800">
                Users are responsible for ensuring their home-sharing arrangements comply with local housing codes and municipal requirements. Golden HomeShare does not verify zoning compliance or housing inspection status.
              </p>
            </div>
        </div>

          {/* Contact Us */}
          <div id="contact" className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">30. Contact Us</h2>
            <p className="text-gray-700 mb-6">
              In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">GOLDEN HOMESHARE LLC</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p>1209 E Walnut St</p>
                    <p>Columbia, MO 65201</p>
                    <p>United States</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span>(816) 433-2979</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <a href="mailto:support@goldenhomeshare.com" className="text-primary hover:underline">
                    support@goldenhomeshare.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="text-center py-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              ← Return to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 