import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

// Dynamically import the KnowledgeIsPowerChessboard to prevent SSR issues with Three.js
const KnowledgeIsPowerChessboard = dynamic(() => 
  import('../components/KnowledgeIsPowerChessboard').then(mod => ({ 
    default: mod.KnowledgeIsPowerChessboard 
  })),
  {
    ssr: false,
    loading: () => <div className="loading">Loading 3D Experience...</div>
  }
);

export default function Home() {
  // Add mobile navigation toggle
  useEffect(() => {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    
    if (navToggle && nav) {
      navToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
      });
    }
    
    return () => {
      if (navToggle && nav) {
        navToggle.removeEventListener('click', () => {
          nav.classList.toggle('active');
        });
      }
    };
  }, []);

  // Handle explore button click
  const handleExplore = () => {
    const humanitiesSection = document.getElementById('humanities');
    if (humanitiesSection) {
      humanitiesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <Head>
        <title>Birmingham-Bessemer Youth Ministries</title>
        <meta name="description" content="Strategic Discourse. Cultural Wisdom." />
        <link rel="icon" href="/favicon.ico" />
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

        {/* Hero Section with Knowledge is Power Chessboard */}
        <section className="hero" id="home">
          <KnowledgeIsPowerChessboard 
            title="Knowledge is Power"
            subtitle="From Potential to Wisdom"
            ctaText="Explore Our Programs"
            onExplore={handleExplore}
          />
        </section>

        {/* About Section */}
        <section className="about-section" id="about">
          <div className="about-container">
            <h2>Who We Are</h2>
            <p>The Birmingham-Bessemer Youth Ministries (BBYM) is a community dedicated to empowering youth through faith, education, and cultural exploration. We believe in the transformative power of the humanities to foster strategic discourse and preserve cultural wisdom.</p>
            <p>Our mission is to provide a nurturing environment where young minds can grow spiritually, intellectually, and creatively, preparing them to be thoughtful leaders in an ever-changing world.</p>
          </div>
        </section>

        {/* Humanities Grid Section (Chessboard Style) */}
        <section className="humanities-section" id="humanities">
          <div className="humanities-heading">
            <h2>Explore the Humanities</h2>
          </div>
          <div className="humanities-grid">
            {/* Row 1 */}
            <div className="humanities-item light">
              <div className="humanities-item-content">
                <i className="fas fa-pray"></i>
                <h3>Religion</h3>
                <p>Spiritual growth and understanding</p>
                <a href="#" className="btn-more">Learn More</a>
              </div>
            </div>
            <div className="humanities-item dark">
              <div className="humanities-item-content">
                <i className="fas fa-music"></i>
                <h3>Music</h3>
                <p>Celebrate sound and rhythm</p>
                <a href="#" className="btn-more">Learn More</a>
              </div>
            </div>
            <div className="humanities-item light">
              <div className="humanities-item-content">
                <i className="fas fa-theater-masks"></i>
                <h3>Theatre Arts</h3>
                <p>Drama and performance</p>
                <a href="#" className="btn-more">Learn More</a>
              </div>
            </div>
            <div className="humanities-item dark">
              <div className="humanities-item-content">
                <i className="fas fa-atom"></i>
                <h3>STEM</h3>
                <p>Science and technology education</p>
                <a href="#" className="btn-more">Learn More</a>
              </div>
            </div>
            {/* Row 2 */}
            <div className="humanities-item dark">
              <div className="humanities-item-content">
                <i className="fas fa-balance-scale"></i>
                <h3>Law & Politics</h3>
                <p>Justice and civic engagement</p>
                <a href="#" className="btn-more">Learn More</a>
              </div>
            </div>
            <div className="humanities-item light">
              <div className="humanities-item-content">
                <i className="fas fa-brain"></i>
                <h3>Philosophy</h3>
                <p>Critical thinking and wisdom</p>
                <a href="#" className="btn-more">Learn More</a>
              </div>
            </div>
            <div className="humanities-item dark">
              <div className="humanities-item-content">
                <i className="fas fa-running"></i>
                <h3>Dance</h3>
                <p>Movement and expression</p>
                <a href="#" className="btn-more">Learn More</a>
              </div>
            </div>
            <div className="humanities-item light">
              <div className="humanities-item-content">
                <i className="fas fa-landmark"></i>
                <h3>History</h3>
                <p>Our past and heritage</p>
                <a href="#" className="btn-more">Learn More</a>
              </div>
            </div>
            {/* Row 3 */}
            <div className="humanities-item light">
              <div className="humanities-item-content">
                <i className="fas fa-chart-line"></i>
                <h3>Economics</h3>
                <p>Financial literacy and growth</p>
                <a href="#" className="btn-more">Learn More</a>
              </div>
            </div>
            <div className="humanities-item dark">
              <div className="humanities-item-content">
                <i className="fas fa-laptop-code"></i>
                <h3>Digital Humanities</h3>
                <p>Technology and digital arts</p>
                <a href="#" className="btn-more">Learn More</a>
              </div>
            </div>
            <div className="humanities-item light">
              <div className="humanities-item-content">
                <i className="fas fa-drum"></i>
                <h3>Performing Arts</h3>
                <p>Music, dance, and more</p>
                <a href="#" className="btn-more">Learn More</a>
              </div>
            </div>
            <div className="humanities-item dark">
              <div className="humanities-item-content">
                <i className="fas fa-palette"></i>
                <h3>Visual Arts</h3>
                <p>Creating and appreciating art</p>
                <a href="#" className="btn-more">Learn More</a>
              </div>
            </div>
          </div>
        </section>

        {/* Add additional sections here as needed */}

      </main>
    </div>
  );
}
