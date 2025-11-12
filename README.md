

---

# 📈 Lotwise Portfolio Tracker

A simple portfolio tracking tool that manages **buy/sell trades using a FIFO-based lot system**, calculates **open positions**, and shows **realized profit & loss (PnL)** for each user.

---

## 🚀 Features

* **Buy & Sell trades** with FIFO-based matching
* **Open Positions** view (remaining quantities & average cost)
* **Realized P&L** view (profit/loss per trade and symbol summary)
* **Kafka integration** for trade event logging
* **User authentication** (login/register)
* **Full frontend (Vite + React + Tailwind)**
* **PostgreSQL + Sequelize ORM**

---

## 🧠 Core Concept

### FIFO (First-In-First-Out) Matching

When a user **buys**, a new *lot* is created.
When they **sell**, the system matches that sell against the *oldest open buy lots first* (FIFO order).

**Example:**

| Date   | Action | Qty | Price | Notes                                  |
| ------ | ------ | --- | ----- | -------------------------------------- |
| Jan 1  | BUY    | 10  | ₹100  | Creates Lot #1                         |
| Jan 5  | BUY    | 10  | ₹120  | Creates Lot #2                         |
| Jan 10 | SELL   | 15  | ₹150  | Matches 10 from Lot #1 + 5 from Lot #2 |

**Realized P&L Calculation:**

```
Profit = (Sell Price - Buy Price) × Quantity Matched
```

So for above:

```
(150 - 100)×10 + (150 - 120)×5 = 500 + 150 = ₹650
```

Remaining open quantity = 5 (from Lot #2).

---

## 🧩 Data Model

| Table       | Description                                     | Key Fields                                                                     |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------------------------ |
| **users**   | Stores registered users                         | id, name, email, password                                                      |
| **trade**   | Stores each trade (buy/sell)                    | id, symbol, quantity, price, tradeType, tradeDate, userId                      |
| **lot**     | Represents each buy lot                         | id, symbol, originalQty, openQty, avgPrice, userId                             |
| **realize** | Stores realized profits/losses per matched sell | id, symbol, qty, proceeds, cost, profit, timestamp, sourceTradeId, sourceLotId |

### 🔗 Relationships

* `User` → `Trade` → `Lot` → `Realize`
* `TradeTable.hasMany(realizeTable, { foreignKey: "sourceTradeId" })`
* `LotTable.hasMany(realizeTable, { foreignKey: "sourceLotId" })`
* Each `Realize` entry records how a sell consumed a part of a lot.

---

## ⚙️ Backend Architecture

* **Node.js + Express** for REST APIs
* **Sequelize ORM** with PostgreSQL
* **Kafka Producer** emits messages for trade events
* **Winston Logger** for clean logging
* **Docker** (optional) for DB + service orchestration

---

## 🔢 API Endpoints

| Method | Endpoint                 | Description                         |
| ------ | ------------------------ | ----------------------------------- |
| `POST` | `/api/trades`            | Record a buy/sell trade             |
| `GET`  | `/api/positions?userId=` | Get open positions (remaining lots) |
| `GET`  | `/api/realized?userId=`  | Get realized profit/loss            |
| `POST` | `/api/auth/register`     | Register new user                   |
| `POST` | `/api/auth/login`        | Login existing user                 |

---

## 💾 Kafka Setup

* Kafka is used to publish a message every time a new trade is created.
* Example message structure:

```json
{
  "symbol": "AAPL",
  "tradeType": "BUY",
  "quantity": 10,
  "price": 150,
  "timestamp": "2025-11-11T10:00:00Z"
}
```

Used for audit, analytics, or external stream processing.

---

## 💻 Frontend (Vite + React + Tailwind)

### Pages

| Page               | Path                  | Description                               |
| ------------------ | --------------------- | ----------------------------------------- |
| **Login/Register** | `/login`, `/register` | User authentication                       |
| **Trade Form**     | `/trade`              | Submit new BUY/SELL trade                 |
| **Positions**      | `/positions`          | Shows all open lots & average cost        |
| **PnL (Realized)** | `/pnl`                | Shows realized profits/losses and summary |

**Tech Stack:**

* React (TypeScript)
* Tailwind CSS
* Axios (API calls)
* React Router (Navigation)

---

⚙️ How to Run Locally
🧩 Setup Instructions

Clone the repository:

git clone https://github.com/<your-username>/portfolio_tracker.git
cd portfolio_tracker


Create your .env file:
Copy from the example and update credentials.

cp .env.example .env


Example:

# PostgreSQL
DB_URL=postgres://postgres:postgres@localhost:5432/portfolio

# Kafka
KAFKA_BROKER=localhost:9092

# Server
PORT=5000
JWT_SECRET=your_secret


Install dependencies (backend + frontend together):

npm run install:all


This script installs:

/backend dependencies

/frontend dependencies
all in one command 🔥

This spins up Kafka + Zookeeper locally for trade event streaming.

Start the entire app (backend + frontend):

npm run start


This launches both servers concurrently:

Backend: http://localhost:5000

Frontend: http://localhost:5173

## 🧠 Assumptions

* A user must be logged in before trading.
* All prices and quantities are numeric and positive.
* Only **BUY** and **SELL** trades are supported.
* FIFO matching occurs automatically at each `SELL`.
* Each SELL can close multiple lots (partial or full).
* Profit/loss is computed in absolute terms (no tax/fees).
* `userId` is stored in `localStorage` after login.

---

## 🧰 Example Workflow

1️⃣ User registers and logs in.
2️⃣ Buys shares → creates a new lot.
3️⃣ Sells shares → FIFO-matched with oldest open lots.
4️⃣ Open lots appear under **Positions**.
5️⃣ Closed trades appear in **Realized P&L** with computed profit/loss.

---

## 🧾 Example Realized Response

```json
{
  "summary": [
    { "symbol": "Tesla", "totalQty": 4, "totalProfit": "-60" }
  ],
  "realizedTrades": [
    {
      "symbol": "Tesla",
      "qty": 3,
      "proceeds": "120",
      "cost": "150",
      "profit": "-30",
      "lot": { "avgPrice": 50 },
      "trade": { "tradeType": "SELL", "userId": "ccf0c03e..." }
    }
  ]
}
```

---

## 🧩 Folder Structure

```
portfolio_tracker/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── kafka/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.tsx
│   └── vite.config.ts
│
└── README.md
```

---

## 🧰 Tech Stack Summary

| Layer     | Tech                      |
| --------- | ------------------------- |
| Backend   | Node.js, Express          |
| ORM       | Sequelize                 |
| Database  | PostgreSQL                |
| Messaging | Kafka                     |
| Frontend  | React (Vite + TypeScript) |
| Styling   | Tailwind CSS              |
| Auth      | JWT                       |
| Logging   | Winston                   |

---

## 📜 License

