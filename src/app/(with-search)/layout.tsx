import { ReactNode } from "react";
import SearchBar from "@/components/searchbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <h2>With-search Layout</h2>
      <SearchBar />
      <div>{children}</div>
    </>
  );
}
