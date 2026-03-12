// ─── Badge Component ──────────────────────────────────────────────────────────
import { type HTMLAttributes } from "react";

import { cn } from "@storyforge/utils/cn";

const variants = {
  default:  "bg-gray-100 text-gray-700",
  primary:  "bg-indigo-100 text-indigo-700",
  success:  "bg-green-100 text-green-700",
  warning:  "bg-yellow-100 text-yellow-700",
  danger:   "bg-red-100 text-red-700",
  info:     "bg-blue-100 text-blue-700",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        variants[variant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-gray-500":   variant === "default",
            "bg-indigo-500": variant === "primary",
            "bg-green-500":  variant === "success",
            "bg-yellow-500": variant === "warning",
            "bg-red-500":    variant === "danger",
            "bg-blue-500":   variant === "info",
          })}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

// ─── Subscription Status Badge ────────────────────────────────────────────────
// Convenience wrapper for displaying subscription status consistently.

import { type SubscriptionStatus } from "@storyforge/types/user";

const statusVariantMap: Record<SubscriptionStatus, BadgeProps["variant"]> = {
  free:      "default",
  active:    "success",
  trialing:  "info",
  canceled:  "danger",
  past_due:  "warning",
};

const statusLabelMap: Record<SubscriptionStatus, string> = {
  free:      "Free",
  active:    "Active",
  trialing:  "Trial",
  canceled:  "Canceled",
  past_due:  "Past Due",
};

export function SubscriptionBadge({ status }: { status: SubscriptionStatus }) {
  return (
    <Badge variant={statusVariantMap[status]} dot>
      {statusLabelMap[status]}
    </Badge>
  );
}