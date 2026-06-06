import { useEffect, useState } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import { sellerService } from "../../services/sellerService";
import { useParams } from "react-router-dom";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { useLang } from "../../context/LangContext";

export default function ProductAnalyticsPage() {
  const { tr, isRTL } = useLang();
  const t = tr.seller.productAnalyticsPage;
  const { id } = useParams<{ id: string }>();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const r = await sellerService.getProductAnalytics(id);
        setAnalytics(r);
      } catch (err: any) {
        setError(err?.message || t.toastLoadError);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, t.toastLoadError]);

  return (
    <SellerLayout>
      <div className="p-6 sm:p-8 lg:p-10 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-center gap-3.5 sl-rise">
          <div className="w-12 h-12 sl-icon-tile-gold flex items-center justify-center shrink-0">
            <BarChartOutlinedIcon sx={{ fontSize: 24, color: "#C9A84C" }} />
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A2E]">{t.title}</h1>
          </div>
        </div>

        {loading ? (
          <div className="sl-card p-6">
            <Stack spacing={1.5}>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} variant="rounded" height={24} sx={{ borderRadius: "0.5rem" }} />
              ))}
            </Stack>
          </div>
        ) : error ? (
          <div className="sl-card p-6 text-red-500 text-sm">{error}</div>
        ) : (
          <>
            {/* Totals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sl-card sl-card-hover p-5 flex items-center gap-4">
                <div className="w-11 h-11 sl-icon-tile-gold flex items-center justify-center shrink-0">
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 20, color: "#C9A84C" }} />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="sl-eyebrow">{t.unitsSold}</p>
                  <p className="font-display text-2xl font-bold text-[#1A1A2E] mt-0.5">
                    {analytics.totals?.unitsSold ?? 0}
                  </p>
                </div>
              </div>
              <div className="sl-card sl-card-hover p-5 flex items-center gap-4">
                <div className="w-11 h-11 sl-icon-tile-gold flex items-center justify-center shrink-0">
                  <PaymentsOutlinedIcon sx={{ fontSize: 20, color: "#C9A84C" }} />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="sl-eyebrow">{t.revenue}</p>
                  <p className="font-display text-2xl font-bold text-[#1A1A2E] mt-0.5">
                    {(analytics.totals?.revenue ?? 0).toLocaleString()} {tr.common.dzd}
                  </p>
                </div>
              </div>
            </div>

            {/* By size */}
            <div className="sl-card overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1A1A2E]/8 bg-[#FBF9F5]">
                <span className="sl-eyebrow">{t.bySize}</span>
              </div>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t.size}</TableCell>
                    <TableCell>{t.unitsSold}</TableCell>
                    <TableCell>{t.revenue}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.bySize?.length ? (
                    analytics.bySize.map((b: any) => (
                      <TableRow key={b._id}>
                        <TableCell>{b._id}</TableCell>
                        <TableCell>{b.unitsSold}</TableCell>
                        <TableCell>{b.revenue}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3}>{t.noSalesYet}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      </div>
    </SellerLayout>
  );
}
