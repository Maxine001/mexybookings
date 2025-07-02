import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const About = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/packages');
  };

  return (
    <>
      <Navigation onBookNow={handleBookNow} />
      <section className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-gray-700">
          Welcome to our photography service. We specialize in capturing your most precious moments with professionalism and creativity.
        </p>
      </section>
    </>
  );
};

export default About;
