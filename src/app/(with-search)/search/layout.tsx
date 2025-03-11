import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ border: "5px solid #000" }}>
      <h1>Search Layout</h1>
      <div>{children}</div>
    </div>
  );
}
