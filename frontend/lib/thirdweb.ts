import { createThirdwebClient } from "thirdweb";

// Extract Client ID from environment variables
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
    console.warn("Warning: NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not set in .env.local");
}

// Initialize the Thirdweb Client
export const thirdwebClient = createThirdwebClient({
    clientId: clientId || "",
});
