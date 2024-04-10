'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleButtonPress = () => {
    console.log('Button pressed');
    alert('subscribed!');
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    const handleMouseMoveOnMount = (event) => {
      const mainElement = event.target.closest('main');
      if (mainElement) {
        setIsHovered(true);
        setMousePosition({ x: event.clientX, y: event.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMoveOnMount);
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveOnMount);
    };
  }, []);

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
            width: '150px',
            height: '150px',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '40% 60% 70% 30% / 50% 40% 60% 50%',
            left: mousePosition.x - 75,
            top: mousePosition.y - 75,
          }}
        />
      )}
      <div
        className={`h-full w-full flex flex-col justify-center items-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-10'
        }`}
      >
        <div className='text-center'>
          <h1 className='text-white text-4xl sm:text-6xl md:text-8xl lg:text-[120px] font-extrabold font-segoe-ui'>
            Coming Soon
          </h1>
          <div>
            <p className='text-white text-center text-sm sm:text-base md:text-lg mt-4'>
              In the meantime. Sign up for our monthly newsletter to stay up to date.
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center w-full mt-8 sm:mt-12 md:mt-16'>
              <input
                className='rounded-full border border-white p-3 sm:p-4 w-full max-w-xs sm:max-w-sm md:max-w-md text-black focus:outline-none mb-4 sm:mb-0 sm:mr-4'
                type='email'
                placeholder='Email Address'
              />
              <button
                onClick={handleButtonPress}
                className='bg-black text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full hover:opacity-80 active:opacity-100'
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
