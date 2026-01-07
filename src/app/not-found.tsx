import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  const images = [
    {
      src: 'https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Podcast.png',
      alt: 'Podcast',
      link: '/podcast'
    },
    {
      src: 'https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Workflow%20Guides.png',
      alt: 'Guides',
      link: '/blog?category=workbooks_guides'
    },
    {
      src: 'https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Tech%20Reviews.png',
      alt: 'Tech Reviews',
      link: '/blog?category=tech_reviews'
    },
  ];

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Text Content */}
      <div className="text-center mb-16 max-w-2xl">
        <h1 className="text-6xl md:text-8xl font-bold text-brand-blue mb-6">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-brand-blue mb-4">
          Oh No! You hit a 404 page not found... what were you looking for?
        </h2>
      </div>

      {/* Bouncing Images Section */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-20 relative px-4 min-h-[192px] md:min-h-[256px]">
        {images.map((image, index) => (
          <Link
            key={index}
            href={image.link}
            className="animate-bounce-once w-32 h-32 md:w-48 md:h-48 relative rounded-3xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300 group"
            style={{ animationDelay: `${index * 0.2}s`, opacity: 0, animationFillMode: 'forwards' }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </Link>
        ))}
      </div>

      {/* Footer Link */}
      <div className="text-center">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-brand-blue font-bold text-lg hover:text-brand-orange transition-colors"
        >
          Something Else? <span className="text-brand-orange group-hover:underline">(head to the home page)</span>
        </Link>
      </div>
    </div>
  );
}
