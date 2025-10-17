
// Centralized PayPal Configuration for Fruitful Holdings Ecosystem
// This ensures consistent PayPal integration across all sectors and components

export const PAYPAL_CONFIG = {
  CLIENT_ID: "BAA8AUA8GP2Tx22g4fbtusDJW_ds4luuHrG1veJhaS2Xy5BmPi8RL46pTt3EnVg7JP156tD8SQ0Ch6TXGk",
  
  // Hosted Button IDs for different products/services
  HOSTED_BUTTONS: {
    CLAIMROOT_CODEFLOW: "K9BPET82JDRQ4",
    // Add other hosted button IDs as needed
  },
  
  // SDK Configuration
  SDK_OPTIONS: {
    components: "hosted-buttons",
    "disable-funding": "venmo",
    currency: "USD"
  },
  
  // Environment configuration
  ENVIRONMENT: process.env.NODE_ENV === "production" ? "production" : "sandbox",
  
  // SDK URL generator
  getSDKUrl: () => {
    const baseUrl = "https://www.paypal.com/sdk/js";
    const params = new URLSearchParams({
      "client-id": PAYPAL_CONFIG.CLIENT_ID,
      components: PAYPAL_CONFIG.SDK_OPTIONS.components,
      "disable-funding": PAYPAL_CONFIG.SDK_OPTIONS["disable-funding"],
      currency: PAYPAL_CONFIG.SDK_OPTIONS.currency
    });
    return `${baseUrl}?${params.toString()}`;
  }
};

// PayPal Products Configuration
export const PAYPAL_PRODUCTS = {
  CLAIMROOT_CODEFLOW: {
    id: "claimroot-codeflow-technology",
    name: "ClaimRoot License - CodeFlow (Technology)",
    price: "$1140.00 USD",
    description: "Grants full access to scroll-bound licensing certificate for CodeFlow under the Technology sector. Includes 🔒 VaultMesh activation, FAA.X13 Treaty compliance, and SHA-256 metadata seal.",
    hostedButtonId: PAYPAL_CONFIG.HOSTED_BUTTONS.CLAIMROOT_CODEFLOW
  }
};

export default PAYPAL_CONFIG;
