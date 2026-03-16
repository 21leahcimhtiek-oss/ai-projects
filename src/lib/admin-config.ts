// Admin users who get free premium access
export const ADMIN_USERS = [
  // Add your email or user ID here
  'keith@example.com', // Replace with your actual email
  // Add more admin emails/IDs as needed
];

// Check if user is admin
export function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_USERS.some(admin => 
    admin.toLowerCase() === email.toLowerCase()
  );
}

// Get effective subscription tier (admin gets VIP)
export function getEffectiveTier(
  email: string | undefined,
  paidTier: 'free' | 'premium' | 'vip'
): 'free' | 'premium' | 'vip' {
  if (isAdmin(email)) {
    return 'vip'; // Admins get full VIP access
  }
  return paidTier;
}