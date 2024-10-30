import React from 'react';
import Image from 'next/image';

const SideNavigation = () => {
  return (
    <aside className="h-full p-6 flex flex-col items-center md:items-start">
      {/* Logo and Title */}
      <a 
        href="/"
        className="flex items-center gap-3 mb-8 "
        >
        <Image
          className="dark:invert"
          src="/FKG.svg"
          alt="FKG logo"
          width={40}
          height={40}
        />
        <p className="font-bold text-3xl text-gray-800">
          FKG Project
        </p>
      </a>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 w-full border rounded-lg bg-gray-100 p-2">
        <a
          href="/dashboard"
          className="text-gray-800 text-2xl font-semibold hover:text-blue-500 transition-colors"
        >
          Instructions
        </a>
        <a
          href="/dashboard/nlp"
          className="text-gray-800 text-2xl font-semibold hover:text-blue-500 transition-colors"
        >
          NLP Query
        </a>
        <a
          href="/dashboard/forms"
          className="text-gray-800 text-2xl font-semibold hover:text-blue-500 transition-colors"
        >
          Forms Query
        </a>
        <a
          href="/documentation"
          className="text-gray-800 text-2xl font-semibold hover:text-blue-500 transition-colors"
        >
          Documentation
        </a>
      </nav>
    </aside>
  );
};

export default SideNavigation;
