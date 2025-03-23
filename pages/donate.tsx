import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Donate() {
  return (
    <>
      <Head>
        <title>Donate | Knowledge Is Power Birmingham</title>
        <meta name="description" content="Support our mission to empower Birmingham's youth through the humanities" />
      </Head>

      <div className="page-container">
        <Navbar />
        
        <main className="content-wrapper">
          <section className="section-container donate-section">
            <div className="donate-header">
              <h1>Support Our Mission</h1>
              <p className="donate-subtitle">
                Your contribution helps us empower Birmingham's youth through education, 
                cultural enrichment, and intellectual growth.
              </p>
            </div>
            
            <div className="donate-options">
              <div className="donate-card">
                <h2>One-Time Donation</h2>
                <p>Make a direct impact with a one-time contribution of any amount.</p>
                <button className="donate-button">Donate Now</button>
              </div>
              
              <div className="donate-card">
                <h2>Monthly Support</h2>
                <p>Become a sustaining supporter with a monthly contribution.</p>
                <button className="donate-button">Become a Supporter</button>
              </div>
              
              <div className="donate-card">
                <h2>Program Sponsorship</h2>
                <p>Sponsor a specific program or educational initiative.</p>
                <button className="donate-button">Sponsor a Program</button>
              </div>
            </div>
            
            <div className="donation-impact">
              <h2>Your Impact</h2>
              <div className="impact-items">
                <div className="impact-item">
                  <div className="impact-icon">📚</div>
                  <h3>Educational Materials</h3>
                  <p>$25 provides educational materials for one student</p>
                </div>
                
                <div className="impact-item">
                  <div className="impact-icon">🏫</div>
                  <h3>Workshop Sessions</h3>
                  <p>$100 funds a workshop session for 15 students</p>
                </div>
                
                <div className="impact-item">
                  <div className="impact-icon">🎓</div>
                  <h3>Scholarship Support</h3>
                  <p>$500 contributes to our scholarship fund</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
