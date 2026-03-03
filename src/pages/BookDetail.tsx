import { useParams, useNavigate } from "react-router-dom";
import { trpc } from "../lib/trpc-client";
import { ArrowLeft, Download, Loader2, BookOpen } from "lucide-react";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: book, isLoading } = trpc.books.get.useQuery({ id: Number(id) });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <BookOpen className="w-16 h-16 text-gray-300" />
        <h2 className="font-display text-2xl font-bold text-gray-500">Story not found</h2>
        <button onClick={() => navigate("/library")} className="btn-primary">Back to Library</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <button
        onClick={() => navigate("/library")}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Library
      </button>

      {/* Book Header */}
      <div className="card mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-24 h-32 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-5xl flex-shrink-0">
            {book.theme === "space" ? "🚀" : book.theme === "fantasy" ? "🧙" : book.theme === "ocean" ? "🌊" : book.theme === "dinosaurs" ? "🦕" : book.theme === "superheroes" ? "🦸" : book.theme === "animals" ? "🐾" : book.theme === "magic" ? "✨" : "🗺️"}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-extrabold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-gray-600 mb-1">A story for <strong>{book.childName}</strong>, age {book.childAge}</p>
            <p className="text-gray-500 text-sm capitalize">Theme: {book.theme}</p>
            <div className="flex gap-3 mt-4">
              <button className="btn-primary gap-2 text-sm py-2">
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="card">
        <h2 className="font-display text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
          📖 The Story
        </h2>
        <div className="prose prose-lg max-w-none">
          {book.content ? (
            book.content.split("\n\n").map((paragraph: string, i: number) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-4 text-lg">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-gray-500 italic">Story content is being generated...</p>
          )}
        </div>
      </div>
    </div>
  );
}