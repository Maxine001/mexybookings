import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const Portfolio = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/packages');
  };

  return (
    <>
      <Navigation onBookNow={handleBookNow} />
      <section className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
        <p className="text-lg text-gray-700">
          Explore our collection of stunning photographs showcasing our expertise and style.
        </p>
      </section>
    </>
  );
};

export default Portfolio;
