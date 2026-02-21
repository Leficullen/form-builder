import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-hover/30 blur-[120px] rounded-full -z-10 animate-pulse"></div>

      <div className="max-w-4xl text-center space-y-8">
        <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-hover text-primary text-sm font-semibold tracking-wide uppercase">
          Now in Beta
        </div>

        <h1 className="text-6xl md:text-7xl font-black text-foreground tracking-tight leading-[1.1]">
          Build Beautiful Forms <br />
          <span className="text-primary italic">Faster Than Ever.</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          The most intuitive way to build, manage, and analyze your forms.
          Powered by a modern design system and built for performance.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/25 transform hover:-translate-y-1">
            Create Your First Form
          </button>

          <Link
            href="/design-system"
            className="w-full sm:w-auto px-8 py-4 bg-white text-primary border-2 border-primary/20 rounded-2xl font-bold text-lg hover:bg-hover transition-all transform hover:-translate-y-1"
          >
            Explore Design System
          </Link>
        </div>

        <div className="pt-16 grid grid-cols-2 md:grid-cols-3 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="font-bold text-2xl tracking-tighter">DESIGNED</div>
          <div className="font-bold text-2xl tracking-tighter text-primary line-through decoration-4 underline-offset-8">
            PRIMITIVE
          </div>
          <div className="font-bold text-2xl tracking-tighter">INTELLIGENT</div>
        </div>
      </div>
    </div>
  );
}
