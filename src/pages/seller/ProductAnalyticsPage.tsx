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

export default function ProductAnalyticsPage() {
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
        setError(err?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <SellerLayout>
      <div className="p-6">
        <Typography variant="h5" gutterBottom>
          Product Analytics
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
              <Typography variant="subtitle1">Totals</Typography>
              <div>Units Sold: {analytics.totals?.unitsSold ?? 0}</div>
              <div>Revenue: {analytics.totals?.revenue ?? 0}</div>

              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                By Size
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Size</TableCell>
                    <TableCell>Units Sold</TableCell>
                    <TableCell>Revenue</TableCell>
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
                      <TableCell colSpan={3}>
                        No sales for this product yet
                      </TableCell>
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
