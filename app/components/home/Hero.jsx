'use client';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative bg-white overflow-hidden flex items-center justify-center min-h-screen">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 flex flex-col items-center text-center">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Share Your Stories</span>{' '}
                <span className="block text-indigo-600 xl:inline">Inspire Others</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                Join our community of writers and readers. Share your knowledge, experiences, and insights through engaging blog posts.
              </p>
              <div className="mt-5 sm:mt-8 flex sm:justify-center gap-3">
                <Link
                  href="/blog"
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Read Blogs
                </Link>
                <Link
                  href="/register"
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                >
                  Start Writing
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
