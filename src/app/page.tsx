import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 bg-background relative overflow-hidden mt-10">
      <div>
        <img
          src="/ornament-left.png"
          alt=""
          className="absolute top-0 left-0 w-[30%] dark:hidden block"
        />
        <img
          src="/ornament-left(dark).png"
          alt=""
          className="absolute top-0 left-0 w-[30%] dark:block hidden opacity-20"
        />
      </div>
      <div>
        <img
          src="/ornament-right.png"
          alt=""
          className="absolute top-0 right-0 w-[30%] dark:hidden block"
        />
        <img
          src="/ornament-right(dark).png"
          alt=""
          className="absolute top-0 right-0 w-[30%] opacity-20 dark:block hidden"
        />
        <img src="/ruby-tablet.png" alt="ruby-tablet" className="absolute top-[25%] right-[8%] w-[20%] animate-float hidden md:block" />
        <img src="/ruby-happy.png" alt="ruby-tablet" className="absolute top-[40%] left-[8%] w-[20%] -scale-x-100 animate-float-delayed hidden md:block" />
      </div>
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-hover/30 blur-[120px] rounded-full -z-10 animate-pulse "></div>
      <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-[#C424A3]/20 text-[#C424A3] text-sm font-semibold tracking-wide uppercase">
        Developed by Leficullen
      </div>

      <div className="max-w-4xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="md:text-6xl text-2xl text-primary font-bold">
            BISMILLAH RISTEK <br />
          </h1>
          <h2 className="text-primary text-5xl md:text-6xl font-bold">
            Form <span className="text-foreground">Builder</span>
          </h2>
        </div>

        <p className="md:text-xl text-md  text-foreground/50 max-w-2xl mx-auto leading-relaxed">
          A form builder website application made by a pacil student delivered to fulfill the Ristek Fasilkom UI Selection Process
        </p>

        <div className="grid md:grid-cols-2 grid-cols-1 items-center justify-center gap-4 pt-4">
          <Button
            variant="default"
            className="w-full sm:w-auto  transition-all shadow-xl shadow-primary/25 transform hover:-translate-y-1"
          >
            <Link href="/login">Get Started</Link>
          </Button>

          <Button
            variant="outline"
            className="w-full sm:w-auto  transition-all shadow-xl shadow-foreground/10 dark:shadow-primary/10 transform hover:-translate-y-1"
          >
            <Link href="/tutorial">Tutorial</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
