import { motion } from 'framer-motion';

function DataPrivacy() {
  return (
    <div className="w-full min-h-screen bg-[#021637] text-white">
      {/* Hero Section */}
      <section className="w-full py-16 px-4 md:py-24 md:px-8">
        <div className="max-w-[900px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Data Privacy Policy</h1>
            <p className="text-white/70 text-lg mb-2">Last updated: March 2026</p>
            <div className="w-20 h-1 bg-blue-500 rounded-full mb-12"></div>
          </motion.div>

          <motion.div
            className="space-y-10 text-white/90 leading-relaxed"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            {/* Introduction */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="text-base md:text-lg">
                RonWay (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting and respecting your privacy. 
                This Data Privacy Policy explains how we collect, use, disclose, and safeguard your personal 
                information when you visit our website, use our services, or interact with us in any way. 
                By accessing our website or using our services, you agree to the practices described in this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">2. Information We Collect</h2>
              <p className="text-base md:text-lg mb-4">
                We may collect and process the following types of personal information:
              </p>
              <div className="space-y-4 pl-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Personal Identification Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-white/80">
                    <li>Full name (first name and last name)</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Country code</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Communication Data</h3>
                  <ul className="list-disc list-inside space-y-1 text-white/80">
                    <li>Messages submitted through our contact form</li>
                    <li>Email correspondence</li>
                    <li>Phone call records</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <p className="text-base md:text-lg mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 text-base md:text-lg">
                <li>To respond to your inquiries and provide customer support</li>
                <li>To process and manage your bookings and service requests</li>
                <li>To communicate with you about our services, promotions, and updates</li>
                <li>To improve our website, services, and customer experience</li>
                <li>To comply with legal obligations and protect our rights</li>
                <li>To ensure the security and integrity of our services</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">4. Data Sharing & Disclosure</h2>
              <p className="text-base md:text-lg mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your 
                information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 text-base md:text-lg">
                <li><strong className="text-white">Service Providers:</strong> With trusted third-party service providers who assist us in operating our business (e.g., email services, captcha verification)</li>
                <li><strong className="text-white">Legal Requirements:</strong> When required by law, regulation, or legal process</li>
                <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong className="text-white">Consent:</strong> With your explicit consent for any other purpose</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">5. Data Security</h2>
              <p className="text-base md:text-lg">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. These measures 
                include encryption, secure server infrastructure, access controls, and regular security assessments. 
                However, no method of transmission over the Internet or electronic storage is 100% secure, 
                and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">6. Data Retention</h2>
              <p className="text-base md:text-lg">
                We retain your personal information only for as long as necessary to fulfill the purposes 
                for which it was collected, comply with our legal obligations, resolve disputes, and enforce 
                our agreements. When your data is no longer needed, we will securely delete or anonymize it.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">7. Your Rights</h2>
              <p className="text-base md:text-lg mb-4">
                Depending on your jurisdiction, you may have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 text-base md:text-lg">
                <li><strong className="text-white">Right of Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong className="text-white">Right to Rectification:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong className="text-white">Right to Erasure:</strong> Request deletion of your personal data</li>
                <li><strong className="text-white">Right to Restrict Processing:</strong> Request limitation of how we process your data</li>
                <li><strong className="text-white">Right to Data Portability:</strong> Request transfer of your data to another service</li>
                <li><strong className="text-white">Right to Object:</strong> Object to our processing of your personal data</li>
              </ul>
              <p className="text-base md:text-lg mt-4">
                To exercise any of these rights, please contact us using the details provided below.
              </p>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">8. Third-Party Links</h2>
              <p className="text-base md:text-lg">
                Our website may contain links to third-party websites or services that are not owned or 
                controlled by RonWay. We have no control over and assume no responsibility for the content, 
                privacy policies, or practices of any third-party sites or services. We encourage you to 
                review the privacy policy of every site you visit.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">9. Children&apos;s Privacy</h2>
              <p className="text-base md:text-lg">
                Our services are not directed to individuals under the age of 18. We do not knowingly 
                collect personal information from children. If we become aware that we have collected 
                personal data from a child without parental consent, we will take steps to remove that 
                information from our servers.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">10. Changes to This Policy</h2>
              <p className="text-base md:text-lg">
                We may update this Data Privacy Policy from time to time to reflect changes in our practices, 
                technology, legal requirements, or other factors. We will notify you of any material changes 
                by posting the updated policy on our website with a revised &quot;Last updated&quot; date. 
                We encourage you to review this policy periodically.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">11. Contact Us</h2>
              <p className="text-base md:text-lg mb-4">
                If you have any questions, concerns, or requests regarding this Data Privacy Policy or our 
                data practices, please contact us:
              </p>
              <div className="bg-[#021945] rounded-xl p-6 border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p><strong>Email:</strong> ronwaycars.travel@gmail.com</p>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p><strong>Phone:</strong> 0968-852-7834</p>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p><strong>Address:</strong> Spark Place, 317 P. Tuazon Blvd, Cubao, Quezon City, Metro Manila 1109</p>
                </div>
              </div>
            </section>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default DataPrivacy;
