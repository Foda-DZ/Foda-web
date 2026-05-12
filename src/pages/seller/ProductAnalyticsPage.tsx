import React, { useEffect, useState } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import { sellerService } from "../../services/sellerService";
import { useParams } from "react-router-dom";
import {
  Typography,
  Paper,
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
      <div className="p-6" dir={isRTL ? "rtl" : "ltr"}>
        <Typography variant="h5" gutterBottom>
          {t.title}
        </Typography>
        <Paper className="p-4">
          {loading ? (
            <Stack spacing={1}>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={24} />
              ))}
            </Stack>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <>
              <Typography variant="subtitle1">{t.totals}</Typography>
              <div>
                {t.unitsSold}: {analytics.totals?.unitsSold ?? 0}
              </div>
              <div>
                {t.revenue}: {analytics.totals?.revenue ?? 0}
              </div>

              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                {t.bySize}
              </Typography>
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
            </>
          )}
        </Paper>

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
