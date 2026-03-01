import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Tutorial() {
  return (
    <div className="min-h-screen flex flex-col items-center md:justify-center p-8 bg-background relative overflow-hidden mt-30 md:mt-0 justify-start">

      <div className="max-w-xl w-full text-center space-y-5 relative z-10">
        <div className="relative flex justify-center bg-hover flex-col p-8 rounded-2xl">
          <img src="/ruby-sad.png" alt="" className="w-[35%] mx-auto" />
          <h2 className="font-semibold text-primary text-xl">
            We Are Developing!
          </h2>
          <p className="text-muted-foreground">
            We are currently working on this feature. Please come back later.
          </p>
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
