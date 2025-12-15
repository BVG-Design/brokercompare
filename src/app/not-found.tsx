import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Text Content */}
      <div className="text-center mb-8">
        <h1 className="text-8xl md:text-9xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">Oh No!</h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
          We look a little lost. Let&apos;s{' '}
          <Link href="/" className="text-blue-600 hover:text-blue-800 underline font-semibold">
            head home →
          </Link>{' '}
          and take you to the place you really want to go.
        </p>
      </div>

      {/* 404 Simba Video */}
      <div className="mt-8 max-w-4xl w-full">
        <video
          src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/404%20Simba.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto rounded-lg shadow-lg"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
