import { Link } from "react-router-dom";
import { Check, Sparkles, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out StoryForge",
    features: [
      "1 story per month",
      "Basic story themes",
      "PDF download",
      "Email support",
    ],
    cta: "Get Started Free",
    href: "/register",
    highlight: false,
  },
  {
    name: "Family",
    price: "$9.99",
    period: "per month",
    description: "Unlimited stories for the whole family",
    features: [
      "Unlimited stories",
      "All story themes",
      "HD PDF downloads",
      "Up to 5 child profiles",
      "Priority support",
      "Early access to new features",
    ],
    cta: "Start Family Plan",
    href: "/register?plan=family",
    highlight: true,
  },
  {
    name: "Annual",
    price: "$79.99",
    period: "per year",
    description: "Best value — save 33%",
    features: [
      "Everything in Family",
      "Unlimited child profiles",
      "Custom story characters",
      "Printed book ordering",
      "Dedicated support",
      "API access",
    ],
    cta: "Start Annual Plan",
    href: "/register?plan=annual",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Simple, transparent pricing
          </div>
          <h1 className="font-display text-5xl font-extrabold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free, upgrade when you're ready. Cancel anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border-2 transition-shadow ${
                plan.highlight
                  ? "border-primary-500 shadow-xl shadow-primary-100 bg-white relative"
                  : "border-gray-200 bg-white hover:shadow-md"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-gray-900">{plan.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 text-sm">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to={plan.href}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {plan.cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto mt-8">
            {[
              { q: "Can I cancel anytime?", a: "Yes, cancel anytime with no fees. Your access continues until the end of your billing period." },
              { q: "Is it safe for kids?", a: "Absolutely. All content is reviewed for age-appropriateness and we never collect data from children." },
              { q: "What ages are supported?", a: "StoryForge creates stories for children ages 2-12, with age-appropriate language and themes." },
              { q: "Can I print the stories?", a: "Yes! All plans include PDF downloads. Annual plan members can also order printed books." },
            ].map((faq) => (
              <div key={faq.q} className="card">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}