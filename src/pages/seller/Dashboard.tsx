import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Plus,
  Clock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSellerContext } from "../../context/SellerContext";
import SellerLayout from "../../components/seller/SellerLayout";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  Icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className="bg-white border border-[#1A1A2E]/8 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/40">
          {label}
        </p>
        <div
          className={`w-9 h-9 flex items-center justify-center ${
            accent ? "gold-gradient" : "bg-[#1A1A2E]/5"
          }`}
        >
          <Icon
            size={16}
            className={accent ? "text-[#1A1A2E]" : "text-[#C9A84C]"}
          />
        </div>
      </div>
      <p className="font-display text-2xl font-bold text-[#1A1A2E]">{value}</p>
      {sub && <p className="text-xs text-[#1A1A2E]/40">{sub}</p>}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const { getSellerStats, getSellerOrders } = useSellerContext();
  const navigate = useNavigate();

  const stats = useMemo(
    () => (user ? getSellerStats(user.id) : null),
    [user, getSellerStats],
  );
  const recentOrders = useMemo(
    () =>
      user
        ? getSellerOrders(user.id)
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .slice(0, 5)
        : [],
    [user, getSellerOrders],
  );

  return (
    <SellerLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">
              Welcome back, {user?.firstName}
            </h1>
            <p className="text-[#1A1A2E]/50 text-sm mt-0.5">
              Here's how your store is performing.
            </p>
          </div>
          <button
            onClick={() => navigate("/seller/products/new")}
            className="btn-gold flex items-center gap-2"
          >
            <Plus size={15} /> Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue"
            value={`${(stats?.revenue ?? 0).toLocaleString()} DZD`}
            sub="From completed orders"
            Icon={TrendingUp}
            accent
          />
          <StatCard
            label="Total Orders"
            value={stats?.totalOrders ?? 0}
            sub="Containing your products"
            Icon={ShoppingBag}
          />
          <StatCard
            label="Products Listed"
            value={stats?.productCount ?? 0}
            sub="Active in marketplace"
            Icon={Package}
          />
          <StatCard
            label="Low Stock"
            value={stats?.lowStock.length ?? 0}
            sub="Items with ≤ 5 units"
            Icon={AlertTriangle}
          />
        </div>

        {/* Low stock alert */}
        {(stats?.lowStock.length ?? 0) > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={16}
                className="text-amber-500 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Low stock warning
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  The following products have 5 or fewer units remaining:
                </p>
                <ul className="mt-2 space-y-1">
                  {stats?.lowStock.map((p) => (
                    <li
                      key={p.id}
                      className="text-xs text-amber-700 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                      <span className="font-medium">{p.name}</span>
                      <span className="text-amber-500">— {p.stock} left</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Recent orders */}
        <div>
          <h2 className="font-display font-bold text-[#1A1A2E] text-lg mb-4">
            Recent Orders
          </h2>
          {recentOrders.length === 0 ? (
            <div className="bg-white border border-[#1A1A2E]/8 p-10 text-center">
              <ShoppingBag
                size={32}
                className="text-[#1A1A2E]/15 mx-auto mb-3"
              />
              <p className="text-[#1A1A2E]/40 text-sm">
                No orders yet. Orders containing your products will appear here.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1A1A2E]/8">
                    {["Order ID", "Date", "Items", "Revenue", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-start text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/40"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const myItems = order.items.filter(
                      (i) => i.product.sellerId === user?.id,
                    );
                    const myRevenue = myItems.reduce(
                      (s, i) => s + i.product.price * i.quantity,
                      0,
                    );
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-[#1A1A2E]/5 last:border-0 hover:bg-[#FAF7F2] transition-colors duration-150"
                      >
                        <td className="px-4 py-3 font-display font-bold text-[#C9A84C] text-xs tracking-wide">
                          {order.id}
                        </td>
                        <td className="px-4 py-3 text-[#1A1A2E]/50 flex items-center gap-1.5">
                          <Clock size={11} />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-[#1A1A2E]/70">
                          {myItems.reduce((s, i) => s + i.quantity, 0)} unit(s)
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#1A1A2E]">
                          {myRevenue.toLocaleString()} DZD
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
}
