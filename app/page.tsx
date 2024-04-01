'use client';
// Import the useEffect and useState hooks from React
import React, { useEffect, useState } from 'react';
// Import the motion component from Framer Motion
import { motion } from 'framer-motion';

export default function Home() {
  // State to handle the hover effect
  const [isHovered, setIsHovered] = useState(false);
  // State to store the mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleButtonPress = () => {
    console.log('Button pressed');
    alert('subscribed!');
  };

  // This function will run when the mouse enters the main area
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // This function will run when the mouse leaves the main area
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // This function will update the mouse position state
  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <main
      className='h-screen w-full flex justify-center items-center bg-gradient-to-r from-blue-500 to-pink-500 bg-opacity-50'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {isHovered && (
        <motion.div
          className='absolute pointer-events-none'
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '40% 60% 70% 30% / 50% 40% 60% 50%',
            left: mousePosition.x - 100,
            top: mousePosition.y - 100,
          }}
        />
      )}
      <div
        className={`h-full w-full flex justify-center items-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-10'
        }`}
        // style={{ background: 'rgba(255, 255, 255, 0.5)' }}
      >
        <div style={{}}>
          <h1 className='text-white text-[120px] font-extrabold font-segoe-ui'>Coming Soon</h1>
          <div>
            <p className='text-white text-center text-lg'>
              In the meantime. Sign up for our monthly newsletter to stay up to date.
            </p>
            <div className='flex items-center justify-center w-full mt-20'>
              {/* rounded border input */}
              <input
                className='rounded-full border border-white p-4 w-96 text-black focus:outline-none'
                type='email'
                placeholder='Email Address'
              />

              {/* submit button black with white text */}
              <button
                onClick={handleButtonPress}
                className='bg-black text-white px-8 py-5 rounded-full ml-4 hover:opacity-80 
              active:opacity-100'
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
