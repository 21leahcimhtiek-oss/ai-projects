import { useAuth } from "../providers/AuthProvider";
import { trpc } from "../lib/trpc-client";
import { User, CreditCard, BookOpen, LogOut, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: subscription } = trpc.subscription.status.useQuery();
  const createPortal = trpc.subscription.createPortalSession.useMutation();

  const handleManageBilling = async () => {
    const { url } = await createPortal.mutateAsync();
    window.location.href = url;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-extrabold text-gray-900 mb-8">My Account</h1>

      {/* Profile */}
      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center">
            <User className="w-7 h-7 text-primary-600" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <BookOpen className="w-6 h-6 text-primary-600 mx-auto mb-1" />
            <p className="font-bold text-gray-900 text-lg">—</p>
            <p className="text-gray-500 text-xs">Stories Created</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <p className="font-bold text-gray-900 text-lg capitalize">{user?.subscriptionStatus ?? "free"}</p>
            <p className="text-gray-500 text-xs">Plan Status</p>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-primary-600" />
          <h2 className="font-display text-lg font-bold text-gray-900">Subscription</h2>
        </div>
        {subscription ? (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Plan</span>
              <span className="font-semibold text-gray-900 capitalize">{subscription.plan ?? "Free"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <span className={`font-semibold capitalize ${subscription.status === "active" ? "text-green-600" : "text-gray-600"}`}>
                {subscription.status ?? "inactive"}
              </span>
            </div>
            {subscription.currentPeriodEnd && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Renews</span>
                <span className="font-semibold text-gray-900">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
            )}
            <button
              onClick={handleManageBilling}
              disabled={createPortal.isLoading}
              className="btn-outline w-full mt-4 gap-2"
            >
              {createPortal.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Manage Billing
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 text-sm mb-4">You're on the Free plan. Upgrade for unlimited stories.</p>
            <button onClick={() => navigate("/pricing")} className="btn-primary w-full">
              Upgrade Plan
            </button>
          </div>
        )}
      </div>

      {/* Sign Out */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </div>
  );
}