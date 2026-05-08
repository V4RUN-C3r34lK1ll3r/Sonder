import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-6">404</p>
        <h1 className="font-serif text-5xl text-ivory mb-4">
          Page not found
        </h1>
        <p className="text-muted mb-10 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3.5 border border-gold/40 text-gold text-sm tracking-widest uppercase hover:bg-gold hover:text-canvas transition-all duration-300"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
