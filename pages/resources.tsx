import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Resources() {
  return (
    <>
      <Head>
        <title>Resources | Knowledge Is Power Birmingham</title>
        <meta name="description" content="Educational resources and materials for youth development in Birmingham" />
      </Head>

      <div className="page-container">
        <Navbar />
        
        <main className="content-wrapper">
          <section className="section-container resources-section">
            <div className="resources-header">
              <h1>Educational Resources</h1>
              <p className="resources-subtitle">
                Access our collection of educational materials, guides, and resources to support 
                intellectual growth and cultural understanding.
              </p>
            </div>
            
            <div className="resources-grid">
              <div className="resource-card">
                <div className="resource-icon">📚</div>
                <h2>Reading Lists</h2>
                <p>Curated reading lists focused on African American literature and history.</p>
                <a href="#" className="resource-link">View Reading Lists</a>
              </div>
              
              <div className="resource-card">
                <div className="resource-icon">🎮</div>
                <h2>Educational Games</h2>
                <p>Interactive games that teach critical thinking and cultural awareness.</p>
                <a href="#" className="resource-link">Explore Games</a>
              </div>
              
              <div className="resource-card">
                <div className="resource-icon">🎬</div>
                <h2>Video Lessons</h2>
                <p>Video lessons on various humanities subjects and cultural topics.</p>
                <a href="#" className="resource-link">Watch Videos</a>
              </div>
              
              <div className="resource-card">
                <div className="resource-icon">♟️</div>
                <h2>Chess Resources</h2>
                <p>Learn chess strategies and the cultural significance of the game.</p>
                <a href="#" className="resource-link">Chess Materials</a>
              </div>
              
              <div className="resource-card">
                <div className="resource-icon">🏛️</div>
                <h2>Cultural Guides</h2>
                <p>Guides to understanding cultural heritage and historical contexts.</p>
                <a href="#" className="resource-link">View Guides</a>
              </div>
              
              <div className="resource-card">
                <div className="resource-icon">🧩</div>
                <h2>Activity Worksheets</h2>
                <p>Printable worksheets and activities for hands-on learning.</p>
                <a href="#" className="resource-link">Download Worksheets</a>
              </div>
            </div>
            
            <div className="educator-resources">
              <h2>For Educators</h2>
              <p>Special resources designed for teachers, mentors, and educational facilitators.</p>
              <button className="educator-button">Access Educator Portal</button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
