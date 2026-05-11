import { useEffect, useState } from "react";
import { sellerService } from "../../services/sellerService";
import { t, getLanguage } from "../../utils/i18n";

interface MetaPixel {
  id: string;
  name: string;
  lastFireTime?: string;
  creationTime?: string;
}

interface MetaPage {
  id: string;
  name: string;
  picture?: string;
}

interface Props {
  sellerId: string;
  adAccountName: string;
  onComplete: () => void;
  onError: (error: string) => void;
}

export default function MetaPixelPageSelector({
  sellerId,
  adAccountName,
  onComplete,
  onError,
}: Props) {
  const lang = getLanguage();
  const [loading, setLoading] = useState(true);
  const [pixels, setPixels] = useState<MetaPixel[]>([]);
  const [pages, setPages] = useState<MetaPage[]>([]);
  const [selectedPixelId, setSelectedPixelId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPixelsAndPages = async () => {
      try {
        setLoading(true);
        const data = await sellerService.getMetaPixelsAndPages();
        setPixels(data.pixels);
        setPages(data.pages);
        setSelectedPixelId(data.currentPixelId);
        setSelectedPageId(data.currentPageId);
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Failed to fetch pixels and pages";
        onError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    void fetchPixelsAndPages();
  }, [onError]);

  const handleSave = async () => {
    // Validate that at least one is selected
    if (!selectedPixelId && !selectedPageId) {
      onError("Please select at least one pixel or page");
      return;
    }

    try {
      setSaving(true);
      console.log("Saving configuration:", { selectedPixelId, selectedPageId });
      const result = await sellerService.configureMetaPixelAndPage(
        selectedPixelId,
        selectedPageId,
      );
      console.log("Configuration saved successfully:", result);
      onComplete();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to save configuration";
      console.error("Error saving configuration:", errorMsg);
      onError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#1A1A2E]/10 p-6">
        <p className="text-[#1A1A2E]/70">{t("meta.loading", lang)}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#1A1A2E]/10 p-6 space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-[#1A1A2E] mb-2">
          {t("meta.selectPixelAndPage", lang)}
        </h2>
        <p className="text-sm text-[#1A1A2E]/70 mb-4">
          {t("meta.adAccount", lang)}: <strong>{adAccountName}</strong>
        </p>
      </div>

      {/* Pixels Section */}
      <div>
        <h3 className="font-semibold text-[#1A1A2E] mb-3">
          {t("meta.pixels", lang)}
        </h3>
        {pixels.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto border border-[#1A1A2E]/10 rounded-lg p-3">
            {pixels.map((pixel) => (
              <label
                key={pixel.id}
                className="flex items-center p-2 hover:bg-[#1A1A2E]/5 rounded cursor-pointer"
              >
                <input
                  type="radio"
                  name="pixel"
                  value={pixel.id}
                  checked={selectedPixelId === pixel.id}
                  onChange={(e) => setSelectedPixelId(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="text-sm font-medium text-[#1A1A2E]">
                    {pixel.name}
                  </div>
                  <div className="text-xs text-[#1A1A2E]/50">{pixel.id}</div>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#1A1A2E]/50 p-3 bg-[#1A1A2E]/5 rounded">
            {t("meta.noPixels", lang)}
          </p>
        )}
      </div>

      {/* Pages Section */}
      <div>
        <h3 className="font-semibold text-[#1A1A2E] mb-3">
          {t("meta.pages", lang)}
        </h3>
        {pages.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto border border-[#1A1A2E]/10 rounded-lg p-3">
            {pages.map((page) => (
              <label
                key={page.id}
                className="flex items-center p-2 hover:bg-[#1A1A2E]/5 rounded cursor-pointer"
              >
                <input
                  type="radio"
                  name="page"
                  value={page.id}
                  checked={selectedPageId === page.id}
                  onChange={(e) => setSelectedPageId(e.target.value)}
                  className="mr-3"
                />
                <div className="flex items-center gap-3 flex-1">
                  {page.picture && (
                    <img
                      src={page.picture}
                      alt={page.name}
                      className="w-8 h-8 rounded"
                    />
                  )}
                  <div>
                    <div className="text-sm font-medium text-[#1A1A2E]">
                      {page.name}
                    </div>
                    <div className="text-xs text-[#1A1A2E]/50">{page.id}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#1A1A2E]/50 p-3 bg-[#1A1A2E]/5 rounded">
            {t("meta.noPages", lang)}
          </p>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={() => void handleSave()}
        disabled={saving || (!selectedPixelId && !selectedPageId)}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
      >
        {saving ? t("meta.saving", lang) : t("meta.saveConfiguration", lang)}
      </button>
    </div>
  );
}
