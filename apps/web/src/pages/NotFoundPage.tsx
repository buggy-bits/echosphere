import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gray-50">
      <p className="text-6xl font-extrabold text-gray-900">404 error</p>
      <p className="text-xl mt-4 text-gray-700">page not found</p>
      <span className="mt-2 text-gray-500">sorry about that!</span>
      <a href="/" className="mt-6 inline-block text-blue-600 font-semibold hover:underline">
        return home?
      </a>
    </div>
  );
};

export default NotFoundPage;
