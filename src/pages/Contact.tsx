import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const Contact = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/packages');
  };

  return (
    <>
      <Navigation onBookNow={handleBookNow} />
      <section className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-gray-700 mb-4">
          We'd love to hear from you! Please reach out with any questions or to book a session.
        </p>
        <form className="space-y-4 max-w-md">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" name="name" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea id="message" name="message" rows="4" className="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
          </div>
          <button type="submit" className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600">
            Send Message
          </button>
        </form>
      </section>
    </>
  );
};

export default Contact;
