import React from 'react';
import LandingNav from './LandingNav';
import ReviewList from './ReviewList';
import About from './About.js';
import '../styles/pages/landing.css';

export const LandingPage = () => {
    return (
      <main className="home">
        <section className="landing-top">
          <LandingNav />
          <article className='landing-content'>
            <article className='landing-text'>
              <h1>RoadRate</h1>
              <p id="catch-phrase">choose rate, not rage</p>
              <p id='responsibly'>Responsibly rate drivers.</p>
              <p id='anonymous'>100% anonymous.</p>
              <article className="about">
                <About />
              </article>  
            </article>   
          </article>
        </section>
        <ReviewList />
      </main>
    );
}

export default LandingPage;
