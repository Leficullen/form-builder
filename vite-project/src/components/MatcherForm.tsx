import React, { useState } from "react";
import { Target, Wand2 } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface MatcherFormProps {
  onAnalyze: (data: {
    name1: string;
    name2: string;
    image1: string;
    image2: string;
  }) => void;
  isLoading: boolean;
}

export function MatcherForm({ onAnalyze, isLoading }: MatcherFormProps) {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name1 || !name2 || !image1 || !image2) {
      setError(
        "Please provide both names and photos to get an accurate reading."
      );
      return;
    }

    onAnalyze({
      name1,
      name2,
      image1,
      image2,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 p-40 bg-romantic-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 p-40 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
            <span className="text-gradient">Love Matcher</span> AI
          </h1>
          <p className="text-lg text-romantic-100/80 max-w-lg mx-auto leading-relaxed">
            Upload photos and names to discover your cosmic compatibility score
            using advanced AI analysis.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            {/* Person 1 */}
            <div className="flex flex-col items-center gap-4">
              <ImageUpload
                label="First Person"
                onImageChange={(_, preview) => setImage1(preview)}
              />
              <input
                type="text"
                placeholder="Name"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center text-white placeholder:text-white/30 focus:outline-none focus:border-romantic-400 focus:bg-white/10 transition-all w-48"
              />
            </div>

            {/* VS Badge */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-romantic-500 to-purple-600 flex items-center justify-center shadow-lg animate-float">
                <Target className="text-white" size={28} />
              </div>
            </div>

            {/* Person 2 */}
            <div className="flex flex-col items-center gap-4">
              <ImageUpload
                label="Second Person"
                onImageChange={(_, preview) => setImage2(preview)}
              />
              <input
                type="text"
                placeholder="Name"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center text-white placeholder:text-white/30 focus:outline-none focus:border-romantic-400 focus:bg-white/10 transition-all w-48"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-center text-sm bg-red-500/10 py-2 rounded-lg border border-red-500/20 max-w-md mx-auto">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg tracking-wide hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-romantic-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    ANALYZING STARS...
                  </>
                ) : (
                  <>
                    <Wand2
                      size={20}
                      className="group-hover:rotate-12 transition-transform"
                    />
                    REVEAL COMPATIBILITY
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
