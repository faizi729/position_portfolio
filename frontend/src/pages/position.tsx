"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
 

interface Position {
  symbol: string;
  openQty: number;
  avgPrice: number;
}

const Positions: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
      const backend_url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) {
      setUserId(storedId);
       
    }
  }, []);
  

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`${backend_url}/api/positions`, {
        params: { userId }, // 👈 passes userId as query param
      })
      .then((res) => setPositions(res.data))
      .catch((err) => console.error(err));
  }, [userId,backend_url]);

  

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Open Positions</h2>
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Symbol</th>
              <th className="border p-2">Total Qty</th>
              <th className="border p-2">Avg Cost</th>
            </tr>
          </thead>
          <tbody>
  {Array.isArray(positions) && positions.length > 0 ? (
    positions.map((pos) => (
      <tr key={pos.symbol}>
        <td className="border p-2">{pos.symbol}</td>
        <td className="border p-2">{pos.openQty}</td>
        <td className="border p-2">₹{pos.avgPrice.toFixed(2)}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={3} className="text-center p-4 text-gray-500">
        No open positions
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
