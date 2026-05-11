import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SellerLayout from "../../components/seller/SellerLayout";
import MetaPixelPageSelector from "../../components/seller/MetaPixelPageSelector";
import { sellerService } from "../../services/sellerService";
import { t, getLanguage } from "../../utils/i18n";

export default function MetaAdsCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lang = getLanguage();
  const [message, setMessage] = useState("Completing Meta Ads connection...");
  const [error, setError] = useState<string | null>(null);
  const [showPixelSelector, setShowPixelSelector] = useState(false);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [adAccountName, setAdAccountName] = useState<string>("");
  const [completing, setCompleting] = useState(true);

  // Prevent back navigation during setup
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (showPixelSelector) {
        e.preventDefault();
        setError(
          "Please complete the pixel and page configuration before leaving.",
        );
        window.history.forward();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [showPixelSelector]);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const adAccountId = searchParams.get("adAccountId") || undefined;

    console.log("🔍 OAuth Callback Page - Query params received:", {
      code: code ? "[present]" : "[missing]",
      state: state ? `[${state.substring(0, 8)}...]` : "[missing]",
      adAccountId,
      fullUrl: window.location.href,
    });

    if (!code || !state) {
      const missing = [];
      if (!code) missing.push("OAuth code");
      if (!state) missing.push("OAuth state");
      const errorMsg = `❌ Missing from Meta callback: ${missing.join(", ")}. 
      
Common causes:
1. Meta App ID or Redirect URI is misconfigured
2. You're in the wrong browser/tab
3. Network connectivity issue

Please try connecting again and complete the process in the same browser.`;

      console.error("Missing parameters:", missing);
      setError(errorMsg);
      setCompleting(false);
      return;
    }

    console.log(
      "📍 Starting OAuth completion with state:",
      `[${state.substring(0, 8)}...]`,
    );

    void sellerService
      .completeMetaAdsOAuth({ code, state, adAccountId })
      .then((response: any) => {
        console.log("✅ OAuth completed successfully:", response);
        setSellerId(response.sellerId);
        setAdAccountName(
          response.selectedAccount?.name || response.shopName || "",
        );
        setMessage(
          "✓ OAuth completed successfully!\n\nPlease select your Facebook Pixel and Page below to continue.",
        );
        setShowPixelSelector(true);
        setCompleting(false);
      })
      .catch((e) => {
        const errorMsg =
          e instanceof Error
            ? e.message
            : "Failed to complete Meta OAuth callback";
        console.error("❌ OAuth completion error:", errorMsg, e);

        let helpText = "";
        if (errorMsg.includes("OAuth state not found")) {
          helpText = `
⚠️ COMMON SOLUTIONS:
1. Make sure you clicked "Connect Meta Ads" BEFORE being redirected to Meta
2. Don't use the back button - use a new browser tab/window
3. Check if your browser cookies are enabled
4. Try in an incognito/private window
5. Verify your Meta App ID and Redirect URI in the server config`;
        } else if (errorMsg.includes("expired")) {
          helpText = `
⚠️ The connection took too long (max 15 minutes)
Try connecting again and complete within 15 minutes.`;
        }

        setError(`❌ OAuth Error: ${errorMsg}${helpText}`);
        setCompleting(false);
      });
  }, [searchParams]);

  const handlePixelPageComplete = () => {
    setMessage(
      "✓ Configuration saved successfully!\n\nRedirecting to dashboard...",
    );
    setShowPixelSelector(false);
    setTimeout(() => navigate("/seller/meta-ads", { replace: true }), 2000);
  };

  const handleError = (errorMsg: string) => {
    console.error("Pixel selector error:", errorMsg);
    setError(`❌ Configuration Error: ${errorMsg}`);
  };

  return (
    <SellerLayout>
      <div className="p-8">
        <div className="bg-white border border-[#1A1A2E]/10 p-6 max-w-3xl">
          <h1 className="font-display text-2xl font-bold text-[#1A1A2E] mb-4">
            Meta Ads Setup
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm whitespace-pre-line">
                {error}
              </p>
            </div>
          )}

          {completing ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-6 w-6 border-b-2 border-[#1A1A2E] mr-3"></div>
              <p className="text-[#1A1A2E]/70 text-sm">{message}</p>
            </div>
          ) : showPixelSelector && sellerId ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm whitespace-pre-line font-medium">
                  {message}
                </p>
              </div>
              <MetaPixelPageSelector
                sellerId={sellerId}
                adAccountName={adAccountName}
                onComplete={handlePixelPageComplete}
                onError={handleError}
              />
              <p className="text-xs text-[#1A1A2E]/50">
                * You must select at least one pixel or page to proceed. This is
                required for event tracking.
              </p>
            </div>
          ) : !error ? (
            <p className="text-[#1A1A2E]/70 text-sm">{message}</p>
          ) : null}
        </div>
      </div>
    </SellerLayout>
  );
}
