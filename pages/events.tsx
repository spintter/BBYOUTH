import React from 'react';
import PageTemplate from '../components/PageTemplate';
import Card from '../components/Card';
import Image from 'next/image';

interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  registrationLink?: string;
}

const Events: React.FC = () => {
  const upcomingEvents: Event[] = [
    {
      title: "Black History Month Celebration",
      date: "Coming Soon",
      time: "To Be Announced",
      location: "Community Center Hall",
      description: "Join us for a special evening celebrating Black History Month featuring presentations, performances, and interactive exhibits by our youth program participants.",
      image: "/images/dighum1_compressed.webp",
      registrationLink: "/contact"
    },
    {
      title: "Youth Humanities Symposium",
      date: "Coming Soon",
      time: "To Be Announced",
      location: "Birmingham Public Library",
      description: "A day-long symposium where youth present their research projects on various humanities topics related to Black history and culture.",
      image: "/images/data_visualization_compressed.webp",
      registrationLink: "/contact"
    },
    {
      title: "Cultural Heritage Tour",
      date: "Coming Soon",
      time: "To Be Announced",
      location: "Departs from Main Office",
      description: "A guided tour of significant civil rights and cultural landmarks in Birmingham, including the 16th Street Baptist Church and Civil Rights Institute.",
      image: "/images/digital_humanities_map_compressed.webp",
      registrationLink: "/contact"
    }
  ];

  return (
    <PageTemplate
      title="Events"
      description="Join our community events and workshops"
      headerBg="#1a1a2e"
      headerTextColor="white"
      mainBg="#F9F9F9"
      mainTextColor="#333333"
    >
      <div className="w-full overflow-hidden rounded-lg mb-8">
        <Image
          width={900}
          height={500}
          className="w-full h-auto object-cover rounded-lg"
          src="/images/ai_humanities_compressed.webp"
          alt="Upcoming Events"
          priority
        />
      </div>
      
      <p className="text-base sm:text-lg font-inter text-[#555555] mb-8">
        Discover upcoming events that foster community connections and learning opportunities. 
        Our events celebrate Black culture, history, and achievements while providing 
        educational experiences for youth and families.
      </p>
      
      <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-[#333333] mb-6">Upcoming Events</h2>
      
      <div className="space-y-8 mb-12">
        {upcomingEvents.map((event, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold font-montserrat mb-3 text-[#8B0000]">{event.title}</h3>
                <div className="mb-4 space-y-1 text-[#555555]">
                  <p className="flex items-center font-inter">
                    <svg className="w-5 h-5 mr-2 text-[#8B0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {event.date}
                  </p>
                  <p className="flex items-center font-inter">
                    <svg className="w-5 h-5 mr-2 text-[#8B0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {event.time}
                  </p>
                  <p className="flex items-center font-inter">
                    <svg className="w-5 h-5 mr-2 text-[#8B0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {event.location}
                  </p>
                </div>
                <p className="text-base font-inter mb-4">{event.description}</p>
                {event.registrationLink && (
                  <a 
                    href={event.registrationLink} 
                    className="inline-block px-6 py-2 bg-[#8B0000] text-white rounded-full font-medium hover:bg-opacity-90 transition-colors duration-300"
                  >
                    Register Now
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-[#333333] mb-6">Annual Events</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card
          title="Black History Month Celebration"
          description="Each February, we host a month-long series of events celebrating Black history and culture."
          isDark={false}
          image="/images/dighum1_compressed.webp"
          imageAlt="Black History Month"
          link="/contact"
        />
        
        <Card
          title="Summer Humanities Festival"
          description="A community-wide celebration featuring performances, exhibits, and interactive activities."
          isDark={false}
          image="/images/data_visualization_compressed.webp"
          imageAlt="Summer Festival"
          link="/contact"
        />
        
        <Card
          title="Youth Achievement Awards"
          description="Annual ceremony recognizing youth for their achievements in humanities education and leadership."
          isDark={false}
          image="/images/digital_humanities_map_compressed.webp"
          imageAlt="Achievement Awards"
          link="/contact"
        />
      </div>
      
      <div className="bg-[#1a1a2e] text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold font-montserrat mb-4">Host an Event</h2>
        <p className="text-base font-inter mb-6">
          Interested in hosting a community event or workshop in partnership with BBYM?
          Contact us to discuss collaboration opportunities.
        </p>
        <a 
          href="/contact" 
          className="inline-block px-8 py-3 bg-[#FFD700] text-[#1a1a2e] rounded-full font-medium hover:bg-opacity-90 transition-colors duration-300"
        >
          Contact Us
        </a>
      </div>
    </PageTemplate>
  );
};

export default Events;
