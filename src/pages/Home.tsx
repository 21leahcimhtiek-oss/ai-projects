import { Link } from "react-router-dom";
import { BookOpen, Sparkles, Shield, Star, ArrowRight, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Personalized Stories
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Stories That Star{" "}
            <span className="text-gradient">Your Child</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create magical, personalized storybooks featuring your child as the hero.
            Powered by AI, loved by kids, trusted by parents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg py-4 px-8 gap-2">
              Start Creating Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/pricing" className="btn-outline text-lg py-4 px-8">
              View Plans
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">No credit card required • First story free</p>
        </div>

        {/* Floating book cards */}
        <div className="max-w-5xl mx-auto px-4 mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "The Dragon's Quest", age: "Ages 4-8", emoji: "🐉", color: "from-purple-400 to-pink-400" },
            { title: "Space Explorer Maya", age: "Ages 6-10", emoji: "🚀", color: "from-blue-400 to-cyan-400" },
            { title: "The Magic Garden", age: "Ages 3-6", emoji: "🌸", color: "from-green-400 to-emerald-400" },
          ].map((book) => (
            <div key={book.title} className="card hover:shadow-lg transition-shadow duration-300 text-center">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${book.color} flex items-center justify-center text-3xl mx-auto mb-3`}>
                {book.emoji}
              </div>
              <h3 className="font-display font-bold text-gray-900">{book.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{book.age}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-extrabold text-gray-900 mb-4">
              Why Parents Love StoryForge
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every story is uniquely crafted for your child's age, interests, and imagination.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-7 h-7 text-primary-600" />,
                title: "AI-Powered Creation",
                desc: "Our AI crafts unique stories tailored to your child's name, age, and interests in seconds.",
              },
              {
                icon: <Shield className="w-7 h-7 text-green-600" />,
                title: "Safe & Age-Appropriate",
                desc: "Every story is reviewed for age-appropriate content. Safe for children of all ages.",
              },
              {
                icon: <BookOpen className="w-7 h-7 text-blue-600" />,
                title: "Beautiful Illustrations",
                desc: "Stunning AI-generated illustrations bring each story to life with vibrant colors.",
              },
              {
                icon: <Zap className="w-7 h-7 text-yellow-600" />,
                title: "Instant Generation",
                desc: "Get a complete personalized storybook in under 60 seconds. No waiting, pure magic.",
              },
              {
                icon: <Star className="w-7 h-7 text-orange-600" />,
                title: "Download as PDF",
                desc: "Download and print your child's story as a beautiful PDF to keep forever.",
              },
              {
                icon: <ArrowRight className="w-7 h-7 text-purple-600" />,
                title: "Unlimited Stories",
                desc: "With our subscription plans, create unlimited stories for all your children.",
              },
            ].map((f) => (
              <div key={f.title} className="card hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-secondary-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl font-extrabold text-white mb-6">
            Ready to Create Your First Story?
          </h2>
          <p className="text-xl text-primary-100 mb-10">
            Join thousands of families creating magical memories with personalized stories.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold text-lg py-4 px-10 rounded-xl hover:bg-primary-50 transition-colors">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}