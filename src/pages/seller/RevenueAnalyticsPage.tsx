import React, { useEffect, useState } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import { sellerService } from "../../services/sellerService";
import {
  Typography,
  Paper,
  Skeleton,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";

export default function RevenueAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const r = await sellerService.getRevenueAnalytics();
        setAnalytics(r);
      } catch (err: any) {
        setError(err?.message || "Failed to load revenue analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <SellerLayout>
      <div className="p-6">
        <Typography variant="h5" gutterBottom>
          Revenue Analytics
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
              <div>Total Revenue: {analytics.totals?.revenue ?? 0}</div>
              <div>Orders: {analytics.totals?.orders ?? 0}</div>
              <div style={{ marginTop: 12 }}>
                <strong>Daily</strong>
                <ul>
                  {analytics.daily?.length ? (
                    analytics.daily.map((d: any) => (
                      <li key={d._id}>
                        {d._id}: {d.revenue} ({d.orders} orders)
                      </li>
                    ))
                  ) : (
                    <li>No daily data</li>
                  )}
                </ul>
              </div>
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
