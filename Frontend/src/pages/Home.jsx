import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Shuffle from "../Components/ui/Shuffle";
import logo from "../assets/logo1.svg";
import Masonry from '@/Components/ui/Masonry';
import StaggeredMenu from '@/Components/ui/StaggeredMenu';
import CardSwap,{Card} from '@/Components/ui/CardSwap';
import PillNav from '@/Components/ui/PillNav';
import { guestNav, userNav } from "../config/navConfig";
import { useAuth } from "../auth/AuthContext";
import CircularGallery from '@/Components/ui/CircularGallery';
import ClickSpark from '@/Components/ui/ClickSpark';
// Import crop images

const Home = () => {
  const { currentUser, logout } = useAuth();
  const navLinks = currentUser ? userNav : guestNav;
  const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Login', ariaLabel: 'Learn about us', link: '/login' },
  { label: 'Services', ariaLabel: 'View our services', link: '/services' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
];
  
  return (
    <>
      <ClickSpark
  sparkColor='#fff'
  sparkSize={10}
  sparkRadius={15}
  sparkCount={8}
  duration={400}
>
  {/* Your content here */}

      {/* FIXED BACKGROUND */}
      <div className="page1">
  <div
    className="fixed w-full h-full object-cover -z-10 bg-cover bg-center"
    style={{ backgroundImage: "url('/bgimg0.jpg')" }}
  ></div>

  <div className="back"></div>
</div>

      {/* CONTENT */}
      <PillNav
  logo = {logo}
  logoAlt="Company Logo"
  items={navLinks.map(item => ({
          label: item.label,
          href: item.path,
        }))}
  activeHref="/"
  className="custom-nav"
  ease="power2.easeOut"
  
  pillColor="#2D6A4F"
  hoveredPillTextColor="black"
  pillTextColor="white"
  theme="light"
  initialLoadAnimation={true}
/>

      <section className="herosec flex flex-col md:flex-row items-center justify-center w-full px-4 sm:px-8 md:px-20 lg:px-40">
        
        <div className="hero-left flex flex-col items-center justify-center md:items-start w-full md:w-1/2 m-25">
          <h1
            className="font-bold leading-tight text-white/90"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
          >
            Connecting <br />
            <span className="hero-middle-text">Farmers</span> <br />
            To Solutions
          </h1>
          <p className='text-white/90 text-center md:text-left' style={{ fontSize: "clamp(1rem, 1.4vw, 1.5rem)" }}>Empowering farmers with AI-powered crop disease detection and smart agricultural solutions.</p>
          <div className='mt-8 flex flex-col sm:flex-row gap-4'>
            <Link
              to="/Crop"
              className="inline-flex
              items-center
              justify-center
              px-6 sm:px-8
              py-2 sm:py-3
              text-sm sm:text-lg
              font-semibold
              rounded-full
              bg-green-500/40
              backdrop-blur-sm
              text-white
              hover:bg-green-600
              transition-all
              duration-300
              hover:scale-105
              shadow-lg
              whitespace-nowrap"
              >
              Analyze Crop
            </Link>
            <Link
              to="/Crop"
              className="inline-flex
              items-center
              justify-center
              px-6 sm:px-8
              py-2 sm:py-3
              text-sm sm:text-lg
              font-semibold
              rounded-full
              bg-cyan-500/40
              backdrop-blur-sm
              text-white
              hover:bg-cyan-600
              transition-all
              duration-300
              hover:scale-105
              shadow-lg
              whitespace-nowrap"
              >
              Get Started
            </Link>
          </div>
        </div>
        <div className="hero-right overflow-hidden hidden md:flex flex-row items-center justify-center w-full md:w-1/2">
          <div className="w-full flex justify-center" >
  
    
</div>
        </div>
      </section>
      
      <section className="w-full min-h-screen flex items-center justify-center flex-col py-12 md:py-20 px-4">
        <div className='w-full max-w-6xl flex justify-center items-center flex-col'>
          <h1 className='text-amber-50 mt-4 md:mt-10 mb-2 text-center' style={{ fontSize: "clamp(1.75rem, 5vw, 3.5rem)" }}>Explore Different types of Crops</h1>
          <h2 className='text-amber-50 mb-5 text-center' style={{ fontSize: "clamp(1.25rem, 4vw, 2rem)" }}>Click to See the Details</h2>
          
        <div className='w-full' style={{ height: 'clamp(300px, 60vw, 500px)', position: 'relative', maxHeight: '500px' }}>
  <CircularGallery  textColor="#ffffff"
  bend={1}
  borderRadius={0.06}
  scrollSpeed={3.3}
  scrollEase={0.05}
/>
</div>
  </div>
      </section>
      <section className='w-full min-h-screen bg-emerald-800  flex items-center justify-center py-16 md:py-24 px-4 md:px-8'>
        <div className='w-full max-w-7xl mx-auto'>
          {/* Main Content Container */}
          <div className='flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16'>
            
            {/* Left Side - Text Content */}
            <div className='flex-1 text-center lg:text-left space-y-6 lg:space-y-8'>
              
              
              <h2 className='text-white font-bold leading-tight' style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                What We Have At This Moment
                <br />
                <span className='text-yellow-300'>A Disease Detection ML Model</span>
              </h2>
              
              <p className='text-blue-100 text-lg md:text-xl leading-relaxed max-w-2xl'>
                Our cutting-edge ML model is trained on <span className='font-bold text-white'>1 Million+ (1,000,000+) images</span> of various crop diseases, 
                enabling accurate and instant diagnosis to help farmers protect their crops.
              </p>
              
              {/* Stats Grid */}
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-8'>
                <div className='bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300'>
                  <div className='text-3xl md:text-4xl font-bold text-yellow-300 mb-2'>1 Million+</div>
                  <div className='text-blue-100 text-sm md:text-base'>Training Images</div>
                </div>
                <div className='bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300'>
                  <div className='text-3xl md:text-4xl font-bold text-yellow-300 mb-2'>95%+</div>
                  <div className='text-blue-100 text-sm md:text-base'>Accuracy Rate</div>
                </div>
                <div className='bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 col-span-2 md:col-span-1'>
                  <div className='text-3xl md:text-4xl font-bold text-yellow-300 mb-2'>20+</div>
                  <div className='text-blue-100 text-sm md:text-base'>Crop Types</div>
                </div>
              </div>
              
              {/* Features List */}
              <div className='mt-8 space-y-4'>
                <div className='flex items-start gap-3 text-blue-100'>
                  <div className='text-2xl'>✅</div>
                  <div>
                    <div className='font-semibold text-white text-lg'>Deep Learning Architecture</div>
                    <div className='text-sm md:text-base'>State-of-the-art neural networks for precise disease identification</div>
                  </div>
                </div>
                <div className='flex items-start gap-3 text-blue-100'>
                  <div className='text-2xl'>✅</div>
                  <div>
                    <div className='font-semibold text-white text-lg'>Real-time Analysis</div>
                    <div className='text-sm md:text-base'>Get instant results with detailed treatment recommendations</div>
                  </div>
                </div>
                <div className='flex items-start gap-3 text-blue-100'>
                  <div className='text-2xl'>✅</div>
                  <div>
                    <div className='font-semibold text-white text-lg'>Comprehensive Database</div>
                    <div className='text-sm md:text-base'>Extensive knowledge base covering symptoms, treatments, and prevention</div>
                  </div>
                </div>
              </div>
              
              <div className='pt-4'>
                <Link
                  to="/crop"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-white text-blue-600 hover:bg-yellow-300 hover:text-blue-800 transition-all duration-300 hover:scale-105 shadow-xl"
                >
                  Try It Now →
                </Link>
              </div>
            </div>
            
            {/* Right Side - Visual Elements */}
            
          </div>
          
          {/* Bottom Section - Crop Types */}
          <div className='mt-16 md:mt-20'>
            <h3 className='text-white text-center text-2xl md:text-3xl font-bold mb-8'>
              Supported Crops
            </h3>
            <div className='flex flex-wrap justify-center gap-3 md:gap-4'>
              {['Apple', 'Tomato', 'Corn', 'Potato', 'Grape', 'Cherry', 'Peach', 'Pepper', 'Soybean', 'Strawberry', 'Squash', 'Raspberry', 'Blueberry', 'Orange'].map((crop, index) => (
                <div 
                  key={index}
                  className='px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white font-medium border border-white/25 hover:bg-white/25 hover:scale-105 transition-all duration-300 cursor-default'
                >
                  {crop}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 md:py-16 px-4 md:px-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
            
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🌾</span>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  AgroConnect
                </h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Empowering farmers with AI-powered crop disease detection and smart agricultural solutions.
              </p>
              
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/crop" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                    Analyze Crop
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Features</h4>
              <ul className="space-y-2">
                <li className="text-gray-300 text-sm flex items-center gap-2">
                  <span>✓</span>
                  <span>AI Disease Detection</span>
                </li>
                <li className="text-gray-300 text-sm flex items-center gap-2">
                  <span>✓</span>
                  <span>Real-time Analysis</span>
                </li>
                <li className="text-gray-300 text-sm flex items-center gap-2">
                  <span>✓</span>
                  <span>Treatment Recommendations</span>
                </li>
                <li className="text-gray-300 text-sm flex items-center gap-2">
                  <span>✓</span>
                  <span>20+ Crop Support</span>
                </li>
              </ul>
            </div>

            {/* Contact & Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Contact</h4>
              <ul className="space-y-3">
                <li className="text-gray-300 text-sm flex items-start gap-2">
                  <span className="text-green-400">📧</span>
                  <span>thegoatzani@gmail.com</span>
                </li>
                
                <li className="text-gray-300 text-sm flex items-start gap-2">
                  <span className="text-green-400">📍</span>
                  <span>Bidhannagar,Durgapur,West Bengal,India</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm text-center md:text-left">
                © {new Date().getFullYear()} Made by Team LYNX _ AKA ------ Shahzad & OM & Sahid ------- 
              </div>
              <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
                <Link to="/privacy" className="text-gray-400 hover:text-green-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-green-400 transition-colors">
                  Terms of Service
                </Link>
                <Link to="/about" className="text-gray-400 hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-xs">
                Powered by LYNX • Trained on 1 Million+ Images • 95%+ Accuracy
              </p>
            </div>
          </div>
        </div>
      </footer>
      </ClickSpark>
    </>
  )
}

export default Home
