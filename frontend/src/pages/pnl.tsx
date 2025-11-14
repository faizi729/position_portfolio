import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
interface SummaryRow {
  symbol: string;
  totalQty: number;
  totalProfit: number;
}

interface RealizedTrade {
  id: string;
  symbol: string;
  qty: number;
  proceeds: string;
  cost: string;
  profit: string;
  timestamp: string;
  trade?: {
    symbol: string;
    tradeType: string;
    userId: string;
  };
  lot?: {
    symbol: string;
    avgPrice: number;
  };
}

interface ApiResponse {
  summary: SummaryRow[];
  realizedTrades: RealizedTrade[];
}
const PnLPage: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true); // ⬅️ NEW
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  // Load userId once
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) setUserId(storedId);
  }, []);

  // Fetch PnL once userId is available
  useEffect(() => {
    if (!userId) return;

    setLoading(true); // start loader

    axios
      .get(`${backend_url}/api/realized-pnl`, { params: { userId } })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("❌ Error fetching PnL:", err))
      .finally(() => setLoading(false)); // stop loader
  }, [userId]);

  return (
    <>
      <Navbar />

      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">
          Realized Profit &amp; Loss
        </h2>

        {/* ⛔ Show Loader Until Data Fetch Completes */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          </div>
        )}

        {/* ⛔ Hide content while loading */}
        {!loading && data && (
          <>
            {/* Summary Table */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Summary</h3>
              <table className="w-full border">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">Symbol</th>
                    <th className="border p-2">Qty Sold</th>
                    <th className="border p-2">Total Profit</th>
                  </tr>
                </thead>

                <tbody>
                  {data.summary.map((row) => (
                    <tr key={row.symbol}>
                      <td className="border p-2">{row.symbol}</td>
                      <td className="border p-2">{row.totalQty}</td>
                      <td
                        className={`border p-2 ${
                          Number(row.totalProfit) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ₹{Number(row.totalProfit).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Detailed Trades */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Detailed Trades</h3>
              <table className="w-full border">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">Symbol</th>
                    <th className="border p-2">Trade Type</th>
                    <th className="border p-2">Qty</th>
                    <th className="border p-2">Proceeds</th>
                    <th className="border p-2">Cost</th>
                    <th className="border p-2">Profit</th>
                    <th className="border p-2">Avg Price</th>
                    <th className="border p-2">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {data.realizedTrades.length > 0 ? (
                    data.realizedTrades.map((trade) => (
                      <tr key={trade.id}>
                        <td className="border p-2">{trade.symbol}</td>
                        <td className="border p-2">
                          {trade.trade?.tradeType || "—"}
                        </td>
                        <td className="border p-2">{trade.qty}</td>
                        <td className="border p-2">₹{trade.proceeds}</td>
                        <td className="border p-2">₹{trade.cost}</td>
                        <td
                          className={`border p-2 ${
                            Number(trade.profit) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ₹{Number(trade.profit).toFixed(2)}
                        </td>
                        <td className="border p-2">
                          {trade.lot?.avgPrice ?? "—"}
                        </td>
                        <td className="border p-2">
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center p-4 text-gray-500">
                        No realized trades found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PnLPage;
