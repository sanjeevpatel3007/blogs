import Hero from './components/home/Hero';
import FeaturedPosts from './components/home/FeaturedPosts';
import RecentPosts from './components/home/RecentPosts';
import CallToAction from './components/home/CallToAction';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeaturedPosts />
      <RecentPosts />
      <CallToAction />
    </main>
  );
}
