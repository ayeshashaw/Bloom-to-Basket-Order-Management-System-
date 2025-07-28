import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import './Home.css'

const Home = () => {
  return (
    <div>
      <Header/>
         <section className='why-choose'>
      <div className='why-choose-container'>
        <h2 className='why-choose-title'>
          Why Choose <span className='title-green'>Bloom to Basket</span>
        </h2>
        
        <div className='features-grid'>
          <div className='feature-card'>
            <div className='feature-icon organic-icon'>
              <div className='leaf-icon'>🌿</div>
            </div>
            <h3>100% Organic</h3>
            <p>All our products are grown with sustainable farming methods without harmful chemicals.</p>
          </div>
          
          <div className='feature-card'>
            <div className='feature-icon delivery-icon'>
              <div className='truck-icon'>🚛</div>
            </div>
            <h3>Local Delivery</h3>
            <p>Fresh delivery from farms near you, reducing transportation emissions and supporting local economy.</p>
          </div>
          
          <div className='feature-card'>
            <div className='feature-icon quality-icon'>
              <div className='shield-icon'>🛡️</div>
            </div>
            <h3>Quality Guarantee</h3>
            <p>We stand behind every product with our freshness and quality guarantee.</p>
          </div>
          
        </div>
      </div>
    </section>

    <section className='how-it-works'>
      <div className='how-it-works-container'>
        <h2 className='how-it-works-title'>How It Works</h2>
        <p className='how-it-works-subtitle'>Simple steps to get fresh produce delivered to your door</p>
        
        <div className='process-steps'>
          <div className='step'>
            <div className='step-icon placed-icon'>
              <span>📱</span>
            </div>
            <div className='step-number'>01</div>
            <h3>Placed</h3>
            <p>Browse our fresh selection and place your order online with just a few clicks.</p>
          </div>
          
          <div className='step-connector'></div>
          
          <div className='step'>
            <div className='step-icon picked-icon'>
              <span>🥕</span>
            </div>
            <div className='step-number'>02</div>
            <h3>Picked</h3>
            <p>Our local farmers hand-pick the freshest produce from their farms just for you.</p>
          </div>
          
          <div className='step-connector'></div>
          
          <div className='step'>
            <div className='step-icon shipped-icon'>
              <span>📦</span>
            </div>
            <div className='step-number'>03</div>
            <h3>Shipped</h3>
            <p>Your order is carefully packed and shipped with eco-friendly packaging materials.</p>
          </div>
          
          <div className='step-connector'></div>
          
          <div className='step'>
            <div className='step-icon delivered-icon'>
              <span>🏠</span>
            </div>
            <div className='step-number'>04</div>
            <h3>Delivered</h3>
            <p>Fresh produce arrives at your doorstep, ready to enjoy with your family.</p>
          </div>
        </div>
      </div>
    </section>
      
    </div>
  )
}

export default Home
