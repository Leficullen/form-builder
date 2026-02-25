import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, Search, Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden mt-10">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#5038bc_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]"></div>

      <div className="max-w-xl w-full text-center space-y-5 relative z-10">
        <div className="relative flex justify-center bg-hover flex-col p-8 rounded-2xl">
          <img src="/ruby-sad.png" alt="" className="w-[35%] mx-auto" />
          <h2 className="font-semibold text-foreground text-2xl">
            Oopss... Something went wrong
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            asChild
            className="w-full sm:w-auto hover:shadow-xl hover:shadow-primary/25 transition-all transform hover:-translate-y-1 gap-2"
          >
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
