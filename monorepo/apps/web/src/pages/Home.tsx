// ─── Home Page ────────────────────────────────────────────────────────────────
// TODO: Migrate full implementation from my-projects/src/pages/Home.tsx

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-5xl font-bold text-gray-900">
        Stories That Star <span className="text-indigo-600">Your Child</span> ✨
      </h1>
      <p className="max-w-xl text-lg text-gray-500">
        Create magical personalized storybooks featuring your child as the hero.
        Powered by AI, loved by kids.
      </p>
      <div className="flex gap-3">
        <Link
          to="/register"
          className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Create a Story
        </Link>
        <Link
          to="/pricing"
          className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
        >
          See Pricing
        </Link>
      </div>
    </div>
  );
}