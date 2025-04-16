import React from 'react';
import PageTemplate from '../components/PageTemplate';
import Card from '../components/Card';
import Image from 'next/image';
import Link from 'next/link';

const SponsorsPage: React.FC = () => {
  const sponsorTiers = [
    {
      title: 'Platinum Sponsor',
      price: '$5,000+',
      benefits: [
        'Logo on homepage and all event materials',
        'Featured in our monthly newsletter',
        'Speaking opportunity at major events',
        'Recognition on social media (monthly)',
        'VIP access to all BBYM events',
        'Logo on youth t-shirts and merchandise',
      ],
    },
    {
      title: 'Gold Sponsor',
      price: '$2,500+',
      benefits: [
        'Logo on sponsors page and event materials',
        'Featured in quarterly newsletter',
        'Recognition on social media (quarterly)',
        'VIP access to selected BBYM events',
        'Logo on event signage',
      ],
    },
    {
      title: 'Silver Sponsor',
      price: '$1,000+',
      benefits: [
        'Logo on sponsors page',
        'Recognition in newsletter',
        'Recognition on social media (twice yearly)',
        'Complimentary tickets to annual gala',
      ],
    },
    {
      title: 'Community Partner',
      price: '$500+',
      benefits: [
        'Name listed on sponsors page',
        'Recognition in newsletter (once yearly)',
        'Recognition at annual community event',
        'Complimentary tickets to selected events',
      ],
    },
  ];

  return (
    <PageTemplate
      title="Sponsor Our Mission"
      description="Partner with Birmingham Black Youth Ministry to make a meaningful impact in the lives of young people through humanities education."
      headerBg="#1a1a2e"
      headerTextColor="white"
      mainBg="#F9F9F9"
      mainTextColor="#333333"
    >
      {/* Hero Section */}
      <div className="w-full overflow-hidden rounded-lg mb-8">
        <Image
          src="/images/youth_group.webp"
          alt="Youth group engaged in Birmingham Black Youth Ministry activities"
          width={900}
          height={500}
          className="w-full h-auto object-cover"
          loading="eager"
          priority={true}
        />
      </div>

      {/* Introduction */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold font-heading mb-6">Support the Next Generation</h2>
        <div className="text-lg space-y-4">
          <p>
            By sponsoring Birmingham Black Youth Ministry, you're investing in the intellectual and
            cultural development of young people in our community. Your support helps us provide
            quality humanities education, mentorship, and enrichment activities that empower Black
            youth to become critical thinkers and future leaders.
          </p>
          <p>
            Through our programs focused on literature, history, philosophy, arts, and more, we're
            fostering a new generation that values education, cultural awareness, and civic
            engagement. Your partnership makes this important work possible.
          </p>
        </div>
      </section>

      {/* Sponsor Levels */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold font-heading mb-6">Sponsorship Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sponsorTiers.map((tier, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden border-t-4"
              style={{
                borderColor:
                  index === 0
                    ? '#b9a05c'
                    : index === 1
                      ? '#d4af37'
                      : index === 2
                        ? '#C0C0C0'
                        : '#8B0000',
              }}
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{tier.title}</h3>
                <p className="text-xl font-semibold mb-4">{tier.price}</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
                <Link
                  href="/contact?subject=Sponsorship"
                  className="inline-block w-full text-center px-6 py-3 bg-[#8B0000] text-white rounded-md hover:bg-[#700000] transition-colors"
                >
                  Become a {tier.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Current Sponsors Section - Placeholder */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold font-heading mb-6">Our Current Sponsors</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-gray-100 rounded-lg p-8 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">Logo</span>
                </div>
                <p className="text-gray-500">Your Logo Here</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-lg font-semibold">
            Join these community partners in supporting our mission
          </p>
        </div>
      </section>

      {/* Custom Sponsorship Options */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold font-heading mb-6">Custom Sponsorship Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card
            title="Event Sponsorship"
            description="Sponsor a specific event such as our annual youth symposium, cultural celebration, or educational workshop series."
            isDark={false}
            link="/contact?subject=Event%20Sponsorship"
            linkText="Discuss Options"
          />
          <Card
            title="Program Sponsorship"
            description="Support a specific educational program like our digital humanities initiative, philosophy club, or creative writing workshops."
            isDark={false}
            link="/contact?subject=Program%20Sponsorship"
            linkText="Discuss Options"
          />
          <Card
            title="In-Kind Donations"
            description="Provide goods, services, or expertise that support our mission, such as technology, venue space, professional services, or educational materials."
            isDark={false}
            link="/contact?subject=In-Kind%20Donations"
            linkText="Discuss Options"
          />
        </div>
      </section>

      {/* Why Sponsor Section */}
      <section className="mb-12 bg-gray-100 p-8 rounded-lg">
        <h2 className="text-3xl font-bold font-heading mb-6">Why Sponsor BBYM?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Community Impact</h3>
            <p>
              Your sponsorship directly impacts Birmingham's youth, providing access to humanities
              education that fosters critical thinking, cultural pride, and academic excellence.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Brand Visibility</h3>
            <p>
              Associate your brand with educational excellence and community development, reaching
              diverse audiences through our events and communications.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Employee Engagement</h3>
            <p>
              Create volunteer opportunities for your team to mentor youth and participate in
              community events, building morale and community connections.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Tax Benefits</h3>
            <p>
              As a 501(c)(3) organization, your contributions to BBYM are tax-deductible to the
              extent allowed by law.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-[#1a1a2e] text-white p-10 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-xl mb-6">
          Contact our sponsorship team to discuss partnership opportunities tailored to your
          organization.
        </p>
        <Link
          href="/contact?subject=Sponsorship%20Inquiry"
          className="inline-block px-8 py-4 bg-[#8B0000] text-white rounded-md hover:bg-[#700000] transition-colors text-lg font-semibold"
        >
          Become a Sponsor Today
        </Link>
      </section>
    </PageTemplate>
  );
};

export default SponsorsPage;
