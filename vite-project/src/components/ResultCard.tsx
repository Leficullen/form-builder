import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import { Heart, Sparkles, AlertTriangle } from "lucide-react";
import type { MatchResult } from "../services/ai";

interface ResultCardProps {
  result: MatchResult;
  onReset: () => void;
}

export function ResultCard({ result, onReset }: ResultCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to actual value
    const duration = 2000;
    const steps = 60;
    const increment = result.score / steps;
    const intervalTime = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= result.score) {
        setAnimatedScore(result.score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [result.score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="glass-panel p-8 w-full max-w-2xl mx-auto animate-[fadeIn_0.5s_ease-out]">
      <div className="text-center mb-8">
        <div className="relative inline-flex items-center justify-center mb-4">
          <Heart
            size={120}
            className={clsx(
              "text-romantic-500/20 fill-current animate-pulse-slow",
              result.score > 80 && "text-romantic-500/40"
            )}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={clsx(
                "text-5xl font-bold font-serif",
                getScoreColor(result.score)
              )}
            >
              {animatedScore}%
            </span>
            <span className="text-xs text-white/60 tracking-widest mt-1 uppercase">
              Compatibility
            </span>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">{result.title}</h2>
        <p className="text-romantic-100 italic">"{result.description}"</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="flex items-center gap-2 text-green-300 font-semibold mb-3">
            <Sparkles size={18} />
            Strengths
          </h3>
          <ul className="space-y-2">
            {result.strengths.map((str, i) => (
              <li
                key={i}
                className="text-sm text-white/80 flex items-start gap-2"
              >
                <span className="block w-1 h-1 rounded-full bg-green-400 mt-2" />
                {str}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="flex items-center gap-2 text-yellow-300 font-semibold mb-3">
            <AlertTriangle size={18} />
            Challenges
          </h3>
          <ul className="space-y-2">
            {result.challenges.map((chal, i) => (
              <li
                key={i}
                className="text-sm text-white/80 flex items-start gap-2"
              >
                <span className="block w-1 h-1 rounded-full bg-yellow-400 mt-2" />
                {chal}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-romantic-600 to-romantic-500 text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(247,29,57,0.4)] transition-all transform hover:-translate-y-1"
      >
        ANALYZE ANOTHER COUPLE
      </button>
    </div>
  );
}
