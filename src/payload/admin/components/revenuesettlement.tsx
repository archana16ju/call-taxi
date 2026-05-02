"use client";

import React, { useMemo, useState } from "react";

type ViewMode = "grid" | "list";

type Driver = {
  id: number;
  name: string;
  trips: number;
  net: number;
  status: "pending" | "paid";
};

type Transaction = {
  id: string;
  entity: string;
  type: "credit" | "payout";
  amount: number;
};

export default function WalletSettlementUI() {
  const [view, setView] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");

  const drivers: Driver[] = [
    { id: 1, name: "John Doe", trips: 120, net: 780.0, status: "pending" },
    { id: 2, name: "Lisa Martinez", trips: 98, net: 620.5, status: "paid" },
    { id: 3, name: "Samuel King", trips: 154, net: 1116.0, status: "paid" },
  ];

  const transactions: Transaction[] = [
    { id: "#TXN-90210", entity: "John Doe", type: "credit", amount: 84.2 },
    { id: "#TXN-90211", entity: "Anna Smith", type: "payout", amount: -450.0 },
  ];

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div style={container}>
      {/* HEADER */}
      <div style={header}>
        <div>
          <h2 style={{ margin: 0 }}>Wallet & Settlements</h2>
          <p style={{ margin: 0, color: "#666" }}>
            Manage driver balances and financial distributions.
          </p>
        </div>

      </div>

      {/* KPI CARDS */}
      <div style={kpiRow}>
        <KPI title="REVENUE" value="$245,892" />
        <KPI title="PAYOUTS" value="$184,200" color="#2563eb" />
        <KPI title="PENDING" value="$42,850" color="#f59e0b" />
      </div>

      {/* DRIVER SECTION */}
      <div style={section}>
        <div style={sectionHeader}>
          <h3>Driver Settlements</h3>

          <div style={{ display: "flex", gap: 10 }}>
            <input
              placeholder="Search driver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={input}
            />

            {/* TOGGLE VIEW */}
            <button
              onClick={() => setView("list")}
              style={{
                ...toggleBtn,
                background: view === "list" ? "#111827" : "#e5e7eb",
                color: view === "list" ? "#fff" : "#000",
              }}
            >
              List
            </button>

            <button
              onClick={() => setView("grid")}
              style={{
                ...toggleBtn,
                background: view === "grid" ? "#111827" : "#e5e7eb",
                color: view === "grid" ? "#fff" : "#000",
              }}
            >
              Grid
            </button>
          </div>
        </div>

        {/* LIST VIEW */}
        {view === "list" && (
          <table style={table}>
            <thead>
              <tr>
                <th>Driver</th>
                <th>Trips</th>
                <th>Net</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredDrivers.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.trips}</td>
                  <td>${d.net}</td>
                  <td>
                    <span
                      style={{
                        ...badge,
                        background:
                          d.status === "paid" ? "#16a34a" : "#f59e0b",
                      }}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td>
                    <button style={smallBtn}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* GRID VIEW */}
        {view === "grid" && (
          <div style={grid}>
            {filteredDrivers.map((d) => (
              <div key={d.id} style={card}>
                <h4 style={{ margin: 0 }}>{d.name}</h4>
                <p>Trips: {d.trips}</p>
                <p>Net: ${d.net}</p>

                <span
                  style={{
                    ...badge,
                    background:
                      d.status === "paid" ? "#16a34a" : "#f59e0b",
                  }}
                >
                  {d.status}
                </span>

                <button style={{ ...smallBtn, marginTop: 10 }}>
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM SECTION */}
      <div style={bottomGrid}>
        {/* TRANSACTIONS */}
        <div style={box}>
          <div style={boxHeader}>
            <h4>Recent Transactions</h4>
            <span style={{ color: "#2563eb", cursor: "pointer" }}>
              VIEW ALL
            </span>
          </div>

          {transactions.map((t) => (
            <div key={t.id} style={txnRow}>
              <div>
                <b>{t.id}</b>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {t.entity}
                </div>
              </div>

              <span
                style={{
                  color: t.type === "credit" ? "#16a34a" : "#dc2626",
                }}
              >
                {t.type === "credit" ? "+" : "-"}${Math.abs(t.amount)}
              </span>
            </div>
          ))}
        </div>

        {/* PENDING BOX */}
        <div style={box}>
          <div style={boxHeader}>
            <h4>Pending Settlements</h4>
          </div>

          <div style={pendingCard}>
            <div>
              <b>HDFC Bank **** 4210</b>
              <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
                Scheduled for Oct 25
              </p>
            </div>

            <b>$4,520.00</b>
          </div>

          <button style={primaryBtn}>CONFIGURE METHODS</button>
        </div>
      </div>
    </div>
  );
}

/* ===== KPI COMPONENT ===== */
const KPI = ({ title, value, color }: any) => (
  <div style={{ ...kpiCard, borderLeft: `4px solid ${color || "#111"}` }}>
    <h5 style={{ margin: 0, color: "#666" }}>{title}</h5>
    <h2 style={{ margin: 0 }}>{value}</h2>
  </div>
);

/* ===== STYLES ===== */
const container: React.CSSProperties = {
  padding: 20,
  fontFamily: "sans-serif",
  background: "#f9fafb",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const primaryBtn: React.CSSProperties = {
  background: "#111827",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
};

const kpiRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 12,
  marginBottom: 20,
};

const kpiCard: React.CSSProperties = {
  background: "#fff",
  padding: 16,
  borderRadius: 10,
};

const section: React.CSSProperties = {
  background: "#fff",
  padding: 16,
  borderRadius: 10,
  marginBottom: 20,
};

const sectionHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 10,
  alignItems: "center",
};

const input: React.CSSProperties = {
  padding: 8,
  borderRadius: 6,
  border: "1px solid #ddd",
};

const toggleBtn: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const badge: React.CSSProperties = {
  padding: "4px 10px",
  borderRadius: 20,
  color: "#fff",
  fontSize: 12,
};

const smallBtn: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 6,
  border: "1px solid #ddd",
  cursor: "pointer",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 12,
};

const card: React.CSSProperties = {
  padding: 14,
  border: "1px solid #eee",
  borderRadius: 10,
  background: "#fafafa",
};

const bottomGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: 12,
};

const box: React.CSSProperties = {
  background: "#fff",
  padding: 16,
  borderRadius: 10,
};

const boxHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 10,
};

const txnRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #eee",
};

const pendingCard: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: 12,
  border: "1px solid #eee",
  borderRadius: 8,
  marginBottom: 10,
};