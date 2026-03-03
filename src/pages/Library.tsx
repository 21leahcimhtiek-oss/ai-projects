import { useState } from "react";
import { Link } from "react-router-dom";
import { trpc } from "../lib/trpc-client";
import { BookOpen, Plus, Search, Download, Trash2, Loader2 } from "lucide-react";

export default function Library() {
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("6");
  const [theme, setTheme] = useState("adventure");

  const { data: books, isLoading, refetch } = trpc.books.list.useQuery();
  const createBook = trpc.books.create.useMutation({ onSuccess: () => { refetch(); setCreating(false); setChildName(""); } });
  const deleteBook = trpc.books.delete.useMutation({ onSuccess: () => refetch() });

  const filtered = books?.filter((b: any) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) return;
    await createBook.mutateAsync({ childName, childAge: parseInt(childAge), theme });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gray-900">My Library</h1>
          <p className="text-gray-600 mt-1">{books?.length ?? 0} stories created</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="btn-primary gap-2"
        >
          <Plus className="w-5 h-5" /> Create New Story
        </button>
      </div>

      {/* Create Story Modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Create a New Story</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Child's Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Emma"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <select className="input" value={childAge} onChange={(e) => setChildAge(e.target.value)}>
                  {[2,3,4,5,6,7,8,9,10,11,12].map(a => (
                    <option key={a} value={a}>{a} years old</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Story Theme</label>
                <select className="input" value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option value="adventure">🗺️ Adventure</option>
                  <option value="fantasy">🧙 Fantasy</option>
                  <option value="space">🚀 Space</option>
                  <option value="ocean">🌊 Ocean</option>
                  <option value="dinosaurs">🦕 Dinosaurs</option>
                  <option value="superheroes">🦸 Superheroes</option>
                  <option value="animals">🐾 Animals</option>
                  <option value="magic">✨ Magic</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setCreating(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1 gap-2" disabled={createBook.isLoading}>
                  {createBook.isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : "✨ Create Story"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          className="input pl-12"
          placeholder="Search your stories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold text-gray-500 mb-2">No stories yet</h3>
          <p className="text-gray-400 mb-6">Create your first personalized story!</p>
          <button onClick={() => setCreating(true)} className="btn-primary gap-2">
            <Plus className="w-5 h-5" /> Create First Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((book: any) => (
            <div key={book.id} className="card hover:shadow-md transition-shadow group">
              <div className="w-full h-32 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-4xl mb-4">
                {book.theme === "space" ? "🚀" : book.theme === "fantasy" ? "🧙" : book.theme === "ocean" ? "🌊" : book.theme === "dinosaurs" ? "🦕" : book.theme === "superheroes" ? "🦸" : book.theme === "animals" ? "🐾" : book.theme === "magic" ? "✨" : "🗺️"}
              </div>
              <h3 className="font-display font-bold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
              <p className="text-sm text-gray-500 mb-4">For {book.childName}, age {book.childAge}</p>
              <div className="flex gap-2">
                <Link to={`/book/${book.id}`} className="btn-secondary text-xs py-2 px-3 flex-1 text-center">Read</Link>
                <button className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteBook.mutate({ id: book.id })}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}