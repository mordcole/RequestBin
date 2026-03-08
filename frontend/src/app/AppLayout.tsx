import type { CSSProperties } from "react";
import { Link, Outlet } from "react-router-dom";

const headerStyles: CSSProperties = {
  alignItems: "center",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  padding: "1rem 1.25rem",
};

const AppLayout = () => {
  return (
    <div>
      <header style={headerStyles}>
        <Link
          to="/"
          style={{ color: "#111827", fontWeight: 700, textDecoration: "none" }}
        >
          RequestBin
        </Link>
      </header>
      <main style={{ margin: "0 auto", maxWidth: "980px", padding: "1.25rem" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
