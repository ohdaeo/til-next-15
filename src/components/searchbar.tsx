"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import style from "@/components/searchbox.module.css";

const SearchBar = () => {
  const [search, setSearch] = useState<string>("");
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // 동적 라우팅
  const router = useRouter();
  const handleSearch = () => {
    if (!search) {
      return;
    }
    router.push(`/search?keyword=${search}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key = "Enter")) {
      handleSearch();
    }
  };
  return (
    <div className={style.conteiner}>
      <input
        type="text"
        value={search}
        onChange={onChangeSearch}
        onKeyDown={onKeyDown}
        style={{ padding: "3px 10px" }}
      />
      <button
        onClick={handleSearch}
        style={{
          backgroundColor: "#000",
          color: "#fff",
          border: "none",
          padding: "5px 10px",
        }}
      >
        검색
      </button>
    </div>
  );
};

export default SearchBar;
