import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import Shuffle from "../Components/ui/Shuffle";
import PillNav from '@/Components/ui/PillNav';
import logo from "../assets/logo1.svg";
import Masonry from '@/Components/ui/Masonry';
import StaggeredMenu from '@/Components/ui/StaggeredMenu';
import CardSwap,{Card} from '@/Components/ui/CardSwap';
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
        <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src="/src/assets/bgvid1.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
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
      <section className='w-full h-screen'>
        
      </section>
      </ClickSpark>
    </>
  )
}

export default Home
