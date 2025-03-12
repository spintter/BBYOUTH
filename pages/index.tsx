import Head from 'next/head';
import dynamic from 'next/dynamic';
import { HUMANITIES } from '../data/humanities';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const KnowledgeIsPowerHero = dynamic(() => import('../components/KnowledgeIsPowerHero'), { ssr: false });

const HumanitiesGrid = () => {
  const router = useRouter();
  const topics = HUMANITIES.slice(0, 12);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      const tiles = gridRef.current.children;
      gsap.fromTo(
        tiles,
        { opacity: 0, scale: 0.5, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  return (
    <div ref={gridRef} className="humanities-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {topics.map((topic, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        const isDark = (row + col) % 2 === 1;
        return (
          <div
            key={topic.id}
            className={`grid-item ${isDark ? 'dark' : 'light'} p-4 text-center cursor-pointer`}
            onClick={() => router.push(`/topics/${topic.id}`)}
          >
            {topic.name}
          </div>
        );
      })}
    </div>
  );
};

const Footer = () => {
  const navLinks = ['About', 'Ministry', 'Programs', 'Events', 'Team', 'Contact'];
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (footerRef.current) {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  return (
    <footer ref={footerRef} className="bg-bbym-neutral text-bbym-light py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        <div>
          <div className="text-6xl font-bold text-bbym-primary mb-4">B</div>
          <p className="font-inter text-sm">Empowering Youth Through Faith, Arts, and Community</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Navigation</h3>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-bbym-secondary">{link}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Contact</h3>
          <p className="font-inter text-sm">3715 Jefferson Ave, Birmingham, AL 35221</p>
          <p className="font-inter text-sm">info@bbym.org</p>
          <p className="font-inter text-sm">(205) 555-1234</p>
          <div className="mt-4 flex space-x-4">
            <a href="#" className="text-bbym-secondary text-2xl">F</a>
            <a href="#" className="text-bbym-secondary text-2xl">I</a>
            <a href="#" className="text-bbym-secondary text-2xl">Y</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const MissionSection = () => {
  const missionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Mission section animation
    if (missionRef.current) {
      gsap.fromTo(
        missionRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: missionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Path following animation for SVG
    if (pathRef.current) {
      gsap.fromTo(
        pathRef.current,
        { strokeDashoffset: 200 },
        {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: missionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Scroll-triggered counter
    if (counterRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            gsap.to(counterRef.current, {
              innerText: 1000,
              duration: 2,
              ease: 'power1.inOut',
              snap: { innerText: 1 },
              onUpdate: function () {
                if (counterRef.current) {
                  counterRef.current.innerText = Math.ceil(Number(counterRef.current.innerText)).toString();
                }
              },
            });
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(counterRef.current);
    }
  }, []);

  return (
    <section ref={missionRef} className="py-12 bg-gray-100 text-center relative">
      <h2 className="text-3xl font-bold">Our Mission</h2>
      <p className="mt-4 text-lg">
        Empowering youth through Afrocentric wisdom, arts, and community leadership.
      </p>
      <div className="mt-6">
        <p>
          Impacted <span ref={counterRef} className="text-orange-500 font-bold">0</span> lives and counting
        </p>
      </div>
      <svg className="absolute bottom-0 left-0 w-full h-16" viewBox="0 0 100 20">
        <path
          ref={pathRef}
          d="M0,10 Q25,0 50,10 T100,10"
          stroke="#ff6200"
          strokeWidth="2"
          fill="none"
          strokeDasharray="200"
          strokeDashoffset="200"
        />
      </svg>
    </section>
  );
};

export default function Home() {
  const separatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Separator animation
    if (separatorRef.current) {
      gsap.fromTo(
        separatorRef.current,
        { width: '0%' },
        {
          width: '100%',
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: separatorRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  return (
    <>
      <Head>
        <title>BBYM - Knowledge Is Our Power</title>
        <meta
          name="description"
          content="Birmingham-Bessemer Youth Ministries (BBYM) empowers youth with Afrocentric wisdom, transforming potential into leadership through the humanities."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="header">
        <div className="header-content">
          <h1 className="text-4xl font-bold">BBYM</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#" className="hover:text-orange-500">Home</a></li>
              <li><a href="#" className="hover:text-orange-500">About</a></li>
              <li><a href="#" className="hover:text-orange-500">Programs</a></li>
              <li><a href="#" className="hover:text-orange-500">Events</a></li>
              <li><a href="#" className="hover:text-orange-500">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <KnowledgeIsPowerHero
            title="Knowledge Is Our Power"
            subtitle="Afrocentric Wisdom for Tomorrow's Leaders"
            ctaText="Begin Your Journey"
          />
        </section>

        <div
          ref={separatorRef}
          className="h-20 bg-gradient-to-r from-orange-500 to-black"
        />

        <MissionSection />

        <section className="px-4 py-12 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Explore Our Programs</h2>
            <HumanitiesGrid />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}