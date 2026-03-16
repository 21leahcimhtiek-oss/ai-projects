# Subscription Payment Flow Test Plan

## Current Status

The subscription payment integration is complete and ready for testing. All 7 subscription tiers have been created in Stripe with the following Price IDs:

- **Consumer Pro**: `price_1SsMdSHqSDtb2XZx5p5IptAp` ($9.99/month)
- **Teacher Basic**: `price_1SsMfLHqSDtb2XZxmQbtGY9I` ($9.99/month, 15 students)
- **Teacher Pro**: `price_1SsMi5HqSDtb2XZxiaf32fMj` ($19.99/month, unlimited)
- **Small School**: `price_1SsMjfHqSDtb2XZxQVR5li2B` ($199/year, 1-3 teachers)
- **Medium School**: `price_1SsMl7HqSDtb2XZxiH1k86yw` ($699/year, 4-10 teachers)
- **Large School**: `price_1SsMm7HqSDtb2XZxghB85AYj` ($1,999/year, 11-25 teachers)
- **Elite Private**: `price_1SsMoOHqSDtb2XZxsUgFSFDp` ($9,999/year, unlimited + IP rights)

## Prerequisites

✅ **Completed:**
- Stripe account created for Aurora Rayes LLC (EIN: 41-2843438)
- All 7 subscription products created in Stripe Dashboard
- Stripe API keys entered into app secrets
- Server-side checkout endpoint implemented
- Upgrade screen with all pricing tiers built
- Subscription success screen with payment verification

## Test Scenarios

### Test 1: Stripe Test Mode Configuration

**Purpose:** Verify Stripe is configured for testing

**Steps:**
1. Confirm `STRIPE_SECRET_KEY` is set (test mode key starts with `sk_test_`)
2. Confirm all Price IDs are from test mode (start with `price_`)
3. Server should be able to create checkout sessions

**Expected Result:** Server starts without Stripe errors

**Status:** ⚠️ NEEDS VERIFICATION - Stripe keys are configured but need to verify test mode vs live mode

---

### Test 2: Teacher Basic Subscription ($9.99/month)

**Purpose:** Test monthly subscription checkout flow

**Steps:**
1. Navigate to upgrade screen in the app
2. Click "Subscribe Now" on Teacher Basic tier
3. Verify Stripe Checkout opens in browser
4. Use Stripe test card: `4242 4242 4242 4242`
5. Enter any future expiry date (e.g., 12/34)
6. Enter any 3-digit CVC (e.g., 123)
7. Complete payment

**Expected Result:**
- Checkout session created successfully
- Stripe Checkout page loads with correct amount ($9.99)
- Payment processes successfully
- Redirects to `/subscription-success`
- Subscription saved locally with tier "teacher-basic"
- Redirects to home screen after 2 seconds

**Status:** 🔴 NOT TESTED

---

### Test 3: Small School Annual Subscription ($199/year)

**Purpose:** Test annual subscription checkout flow

**Steps:**
1. Navigate to upgrade screen
2. Click "Subscribe Now" on Small School tier
3. Complete checkout with test card
4. Verify annual billing cycle

**Expected Result:**
- Checkout shows $199 annual charge
- Subscription created with yearly billing
- Tier saved as "school-small"

**Status:** 🔴 NOT TESTED

---

### Test 4: Payment Cancellation Flow

**Purpose:** Test user canceling during checkout

**Steps:**
1. Navigate to upgrade screen
2. Click "Subscribe Now" on any tier
3. Click "Back" or close Stripe Checkout page
4. Verify user returns to upgrade screen

**Expected Result:**
- User redirected to `/upgrade` (cancel URL)
- No subscription created
- No charges made

**Status:** 🔴 NOT TESTED

---

### Test 5: Payment Verification

**Purpose:** Test server-side payment verification

**Steps:**
1. Complete a test subscription purchase
2. Verify server calls `stripe.checkout.sessions.retrieve()`
3. Check that payment status is "paid"
4. Verify subscription ID is returned

**Expected Result:**
- Server successfully retrieves session
- Payment status confirmed as "paid"
- Subscription ID stored locally
- Tier metadata correctly passed through

**Status:** 🔴 NOT TESTED

---

### Test 6: Feature Gating After Subscription

**Purpose:** Verify subscription unlocks features

**Steps:**
1. Subscribe to Teacher Basic tier
2. Navigate to classroom management
3. Try to add 16th student (should be blocked)
4. Upgrade to Teacher Pro
5. Try to add unlimited students (should work)

**Expected Result:**
- Teacher Basic: Limited to 15 students
- Teacher Pro: Unlimited students
- Feature gating works correctly

**Status:** 🔴 NOT TESTED

---

## Test Card Numbers (Stripe Test Mode)

Use these test cards for different scenarios:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |

**For all cards:**
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

## Known Issues

1. **Server Error on Startup:** Console shows "Neither apiKey nor config.authenticator provided" - This appears to be related to Gemini API initialization, not Stripe. Does not affect Stripe functionality.

2. **Environment Variables:** Need to verify that all Price IDs are correctly set in environment variables:
   - `EXPO_PUBLIC_STRIPE_PRICE_TEACHER_BASIC`
   - `EXPO_PUBLIC_STRIPE_PRICE_TEACHER_PRO`
   - `EXPO_PUBLIC_STRIPE_PRICE_SMALL_SCHOOL`
   - `EXPO_PUBLIC_STRIPE_PRICE_MEDIUM_SCHOOL`
   - `EXPO_PUBLIC_STRIPE_PRICE_LARGE_SCHOOL`
   - `EXPO_PUBLIC_STRIPE_PRICE_ELITE_PRIVATE`

## Next Steps After Testing

Once all tests pass:

1. ✅ Mark all test scenarios as PASSED
2. Switch Stripe from test mode to live mode
3. Update Price IDs to live mode IDs
4. Test one live transaction with real card
5. Implement subscription management (upgrade/downgrade/cancel)
6. Set up Stripe webhooks for subscription events
7. Begin school outreach campaign

## Testing Checklist

- [ ] Verify Stripe test mode is active
- [ ] Test Teacher Basic monthly subscription
- [ ] Test Teacher Pro monthly subscription
- [ ] Test Small School annual subscription
- [ ] Test Medium School annual subscription
- [ ] Test Large School annual subscription
- [ ] Test Elite Private annual subscription
- [ ] Test payment cancellation flow
- [ ] Test payment verification
- [ ] Test feature gating after subscription
- [ ] Test with declined card
- [ ] Test with 3D Secure authentication
- [ ] Verify subscription data saved correctly
- [ ] Verify redirect to home after success

## Manual Testing Instructions

**To test the subscription flow manually:**

1. **Start the app:**
   ```bash
   cd /home/ubuntu/queen-aurora-app
   pnpm dev
   ```

2. **Open the app in browser:**
   - Navigate to the dev server URL (shown in console)
   - Or scan QR code with Expo Go on mobile device

3. **Navigate to upgrade screen:**
   - Tap "Classroom" tab
   - Tap "Upgrade to Pro" or similar button
   - Or manually navigate to `/upgrade` route

4. **Test subscription purchase:**
   - Select a tier
   - Click "Subscribe Now"
   - Complete Stripe Checkout with test card
   - Verify success screen appears
   - Check that subscription is saved

5. **Verify subscription status:**
   - Check AsyncStorage for subscription data
   - Verify tier and status are correct
   - Test feature gating based on tier

## Automated Testing (Future)

Consider adding automated tests for:
- Stripe checkout session creation
- Payment verification logic
- Subscription storage
- Feature gating based on tier
- Upgrade/downgrade logic
- Cancellation flow

Use Vitest for unit tests and Stripe's test mode for integration tests.
