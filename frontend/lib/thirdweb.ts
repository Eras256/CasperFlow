import { createThirdwebClient } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
    console.warn("NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not defined. IPFS uploads may fail.");
}

export const thirdwebClient = createThirdwebClient({
    clientId: clientId || "placeholder",
});
