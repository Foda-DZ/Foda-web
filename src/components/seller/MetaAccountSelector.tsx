import { useState } from "react";
import { sellerService, type MetaAccount } from "../../services/sellerService";
import { t, getLanguage } from "../../utils/i18n";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface MetaAccountSelectorProps {
  accounts: MetaAccount[];
  onSelect: (accountId: string) => void;
  isLoading?: boolean;
}

export default function MetaAccountSelector({
  accounts,
  onSelect,
  isLoading = false,
}: MetaAccountSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    accounts.length > 0 ? accounts[0].id : null,
  );
  const lang = getLanguage();

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId);
    }
  };

  return (
    <div className="bg-white border border-[#1A1A2E]/10 p-6 max-w-2xl mx-auto">
      <h2 className="font-display text-xl font-bold text-[#1A1A2E] mb-4">
        {t("meta.accounts.title", lang)}
      </h2>

      <div className="space-y-3 mb-6 max-h-96 overflow-auto">
        {accounts.map((account) => (
          <div
            key={account.id}
            onClick={() => setSelectedId(account.id)}
            className={`border p-4 cursor-pointer transition-colors ${
              selectedId === account.id
                ? "border-blue-500 bg-blue-50"
                : "border-[#1A1A2E]/10 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-[#1A1A2E]">{account.name}</p>
                <p className="text-sm text-[#1A1A2E]/60">
                  ID: {account.accountId || account.id}
                </p>
                <p className="text-xs text-[#1A1A2E]/50">
                  {t("meta.connection.currency", lang)}:{" "}
                  {account.currency || t("meta.accounts.noCurrency", lang)}
                </p>
              </div>
              {selectedId === account.id && (
                <CheckCircleIcon
                  sx={{ color: "#2196F3", fontSize: 24, ml: 2 }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={handleConfirm}
        disabled={!selectedId || isLoading}
        fullWidth
        sx={{ borderRadius: 0 }}
      >
        {isLoading
          ? t("meta.btn.syncing", lang)
          : t("meta.btn.selectAccount", lang)}
      </Button>
    </div>
  );
}
