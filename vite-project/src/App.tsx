import React, { useState } from "react";
import { MatcherForm } from "./components/MatcherForm";
import { ResultCard } from "./components/ResultCard";
import { analyzeMatch, type MatchResult } from "./services/ai";

function App() {
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (data: {
    name1: string;
    name2: string;
    image1: string;
    image2: string;
  }) => {
    setLoading(true);
    try {
      const result = await analyzeMatch(
        data.name1,
        data.image1,
        data.name2,
        data.image2
      );
      setResult(result);
    } catch (error) {
      console.error(error);
      alert(
        "Failed to analyze match. Please check your API key and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center justify-center font-sans">
      {/* Dynamic Background Orbs */}
      <div className="fixed top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-romantic-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />

      {result ? (
        <ResultCard result={result} onReset={() => setResult(null)} />
      ) : (
        <MatcherForm onAnalyze={handleAnalyze} isLoading={loading} />
      )}

      <footer className="fixed bottom-4 text-white/30 text-xs">
        Powered by Gemini AI • Love Matcher
      </footer>
    </div>
  );
}

export default App;
