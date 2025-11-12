import { useState, useEffect  } from "react";
import type { FormEvent, ChangeEvent } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; // adjust path if needed

interface TradeFormData {
  symbol: string;
  quantity: number | string;
  price: number | string;
  tradeType: "BUY" | "SELL";
  tradeDate: string;
  userId: string | null;
}

const TradeForm: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState<TradeFormData>({
    symbol: "",
    quantity: "",
    price: "",
    tradeType: "BUY",
    tradeDate: "",
    userId: null,
  });
    const backend_url = import.meta.env.VITE_BACKEND_URL;

  // ✅ get userId safely (after browser loads)
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) {
      setUserId(storedId);
      setForm((prev) => ({ ...prev, userId: storedId }));
    }
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!userId) {
    alert("⚠️ You must log in first!");
    return;
  }

  try {
  
    await axios.post(`${backend_url}/api/trades`, form);
    alert("✅ Trade submitted successfully!");

    setForm({
      symbol: "",
      quantity: "",
      price: "",
      tradeType: "BUY",
      tradeDate: "",
      userId,
    });
  } catch (err: unknown) {
    // ✅ Safe way to check for Axios errors
    if (axios.isAxiosError(err)) {
      alert("❌ Error submitting trade: " + err.response?.data?.message);
    } else {
      console.error("Unexpected Error:", err);
      alert("❌ Something went wrong. Please try again later.");
    }
  }
};

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Add Trade</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="symbol"
            placeholder="Symbol (AAPL)"
            value={form.symbol}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            type="date"
            name="tradeDate"
            value={form.tradeDate}
            onChange={handleChange}
            className="border p-2 w-full"
          />

          <select
            name="tradeType"
            value={form.tradeType}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default TradeForm;
