# Upload and install your Stripe App

Make your app available to team members on your Stripe account.

Some Stripe Apps features also require you to upload your app. For more information, see:

- [Store secrets](https://docs.stripe.com/stripe-apps/store-secrets.md)
- [Add server-side functionality](https://docs.stripe.com/stripe-apps/build-backend.md)

To share your app with your *team members* (A team member is a user with controlled access to some features of your Stripe account, like an administrator, developer, or support specialist), install it on your Stripe account with two steps:

- [Upload your app in test mode](https://docs.stripe.com/stripe-apps/upload-install-app.md#install-your-app-in-test-mode)
- [Install in live mode](https://docs.stripe.com/stripe-apps/upload-install-app.md#install-in-live-mode)

Any team member with access to your Stripe account can run your installed apps. To give other Stripe accounts access, you can [publish your app](https://docs.stripe.com/stripe-apps/publish-app.md) on the Stripe App Marketplace. Your [app ID](https://docs.stripe.com/stripe-apps/reference/app-manifest.md#schema) must be globally unique.

## Upload your app in test mode

To upload your app, run the following command from your project root directory:

```bash
stripe apps upload
```

Stripe validates your [app manifest](https://docs.stripe.com/stripe-apps/reference/app-manifest.md), which defaults to test mode availability on your Stripe account. After validation is complete, you see a banner with a prompt and button to install the new version into test mode. You can [configure the app manifest](https://docs.stripe.com/stripe-apps/review-requirements.md#sandbox-support) to allow installation into *sandboxes* (A sandbox is an isolated test environment that allows you to test Stripe functionality in your account without affecting your live integration. Use sandboxes to safely experiment with new features and changes).

You can install previous versions though the Version History list.

1. In the version history table, click the overflow menu (⋯) of the version you want to install.
1. Select **Install in test mode** and complete the installation.

After this step:

- Any team member can access your app in *test mode* (Test mode is another way to test changes to your integration without affecting production. A sandbox is the default and recommended way to test integrations. All Stripe features are available in test mode but you can't create live charges unless you're in live mode) at [https://dashboard.stripe.com/test/](https://dashboard.stripe.com/test/).
- Your app can [store secrets](https://docs.stripe.com/stripe-apps/store-secrets.md) in test mode.
- You can access your app’s signing secret to connect it to a [backend](https://docs.stripe.com/stripe-apps/build-backend.md).

## Install in live mode

To access real customer data, install your app in live mode.

1. Select your app from the [Apps page in the Developers Dashboard](https://dashboard.stripe.com/apps).
1. Select the **Private to Aurora rayes llc** option when choosing how to distribute.
1. Choose a version for your app and click **Continue**.
1. Click **Continue** to open your app in the Dashboard, then click **Install**.
1. Click **Done**, refresh your browser, and see your app in live mode across the Dashboard in the right-hand side drawer.

After this step:

- Any team member can access your app in live mode in the Dashboard.
- Your app can [store secrets](https://docs.stripe.com/stripe-apps/store-secrets.md) in live mode.
- Your app’s signing secret remains available.

### Uninstall your app in live mode 

To switch between installing your app in live mode to publishing it on the *Stripe App Marketplace* (A marketplace to browse, search, and install Stripe apps), uninstall the app in live mode:

1. Go to the [Installed Apps page in the Dashboard](https://dashboard.stripe.com/settings/apps/), and find the app you want to uninstall.
1. Click the overflow menu ⋯ at the right side of your app, and click **View app details**.
1. Click **Uninstall app**, and click **Uninstall**.

After this step, you can [publish your app to the Stripe App Marketplace](https://docs.stripe.com/stripe-apps/publish-app.md).

## See also

- [Add deep links](https://docs.stripe.com/stripe-apps/deep-links.md)
- [Versions and releases](https://docs.stripe.com/stripe-apps/versions-and-releases.md)