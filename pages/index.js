
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import the HeroComponent to prevent SSR issues with Three.js
const HeroComponent = dynamic(() => import('../components/HeroComponent'), {
  ssr: false,
  loading: () => <div className="loading">Loading 3D Experience...</div>
});

export default function Home() {
  return (
    <div>
      <Head>
        <title>Birmingham-Bessemer Youth Ministries</title>
        <meta name="description" content="Strategic Discourse. Cultural Wisdom." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <main>
        {/* Header */}
        <header className="header">
          <div className="header-container">
            <div className="logo">
              <div className="logo-text">BBYM</div>
            </div>
            <button className="nav-toggle" aria-label="Toggle navigation">
              <i className="fas fa-bars"></i>
            </button>
            <nav>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#humanities">Humanities</a></li>
                <li><a href="#ministries">Ministries</a></li>
                <li><a href="#events">Events</a></li>
                <li><a href="#k12">K-12 Resources</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Hero Section with React Three Fiber */}
        <section className="hero" id="home">
          <HeroComponent />
        </section>

        {/* Additional Sections */}
        <section className="about-section" id="about">
          <div className="about-container">
            <h2>Who We Are</h2>
            <p>The Birmingham-Bessemer Youth Ministries (BBYM) is a community dedicated to empowering youth through faith, education, and cultural exploration. We believe in the transformative power of the humanities to foster strategic discourse and preserve cultural wisdom.</p>
            <p>Our mission is to provide a nurturing environment where young minds can grow spiritually, intellectually, and creatively, preparing them to be thoughtful leaders in an ever-changing world.</p>
          </div>
        </section>

        {/* Humanities Grid Section */}
        <section className="humanities-section" id="humanities">
          <div className="humanities-heading">
            <h2>Explore the Humanities</h2>
          </div>
          <div className="humanities-grid">
            {/* Grid items */}
            {[
              { name: 'Religion', light: true },
              { name: 'Music', light: false },
              { name: 'Theatre Arts', light: true },
              { name: 'STEM', light: false },
              { name: 'Law & Politics', light: false },
              { name: 'Philosophy', light: true },
              { name: 'Dance', light: false },
              { name: 'History', light: true },
              { name: 'Economics', light: true },
              { name: 'Digital Humanities', light: false },
              { name: 'Performing Arts', light: true },
              { name: 'Visual Arts', light: false }
            ].map((item, index) => (
              <div key={index} className={`humanities-item ${item.light ? 'light' : 'dark'}`}>
                <div className="humanities-item-content">{item.name}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
