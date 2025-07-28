import React from 'react'
import './About.css'
import Footer from '../components/Footer/Footer'

const About = () => {
  return (
    <div className='about-page'>
      <section className='about-hero'>
        <div className='about-hero-content'>
          <h1>About <span className='hero-green'>Bloom to Basket</span></h1>
          <p className='hero-subtitle'>Connecting local farmers with conscious consumers</p>
        </div>
      </section>

      <section className='about-content'>
        <div className='about-container'>
          <div className='content-grid'>
            <div className='content-text'>
              <div className='text-section'>
                <p className='intro-text'>
                  Welcome to Bloom to Basket, where we're bridging the gap between local farmers and conscious consumers. Our platform is built on the belief that everyone deserves access to fresh, locally-sourced produce while supporting the hardworking farmers in our community.
                </p>
              </div>

              <div className='text-section'>
                <p>
                  Our mission is to create a sustainable food system that benefits both producers and consumers. By connecting you directly with local farmers, we're eliminating unnecessary middlemen and ensuring that farmers receive fair compensation for their hard work.
                </p>
              </div>

              <div className='text-section'>
                <p className='closing-text'>
                  Join us in supporting local agriculture and enjoying the freshest produce delivered straight from farm to table.
                </p>
              </div>
            </div>

            <div className='content-visual'>
              <div className='visual-card'>
                <div className='farmer-illustration'>
                  <span className='farmer-emoji'>👨‍🌾</span>
                  <span className='arrow'>➡️</span>
                  <span className='basket-emoji'>🧺</span>
                  <span className='arrow'>➡️</span>
                  <span className='home-emoji'>🏠</span>
                </div>
                <p className='visual-caption'>From Farm to Your Table</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='about-values'>
        <div className='about-container'>
          <h2>Our Core Values</h2>
          <div className='values-grid'>
            <div className='value-item'>
              <div className='value-icon'>🌱</div>
              <h3>Sustainability</h3>
              <p>Supporting eco-friendly farming practices that protect our environment for future generations.</p>
            </div>
            <div className='value-item'>
              <div className='value-icon'>🤝</div>
              <h3>Community</h3>
              <p>Building strong relationships between farmers and consumers in our local community.</p>
            </div>
            <div className='value-item'>
              <div className='value-icon'>✨</div>
              <h3>Quality</h3>
              <p>Ensuring only the freshest, highest-quality produce reaches your family's table.</p>
            </div>
          </div>
        </div>
      </section>

      <section className='about-cta'>
        <div className='about-container'>
          <div className='cta-content'>
            <h2>Ready to Start Your Journey?</h2>
            <p>Experience the difference of farm-fresh produce delivered to your door</p>
            <div className='cta-buttons'>
              <button className='cta-primary'>Shop Now</button>
              <button className='cta-secondary'>Meet Our Farmers</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About