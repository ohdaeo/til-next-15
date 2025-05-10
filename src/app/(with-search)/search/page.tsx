import style from "@/app/(with-search)/search/page.module.css";
import GoodItem from "@/components/good-item";
import { GoodDataType } from "@/types/types";
import { Suspense } from "react";

async function SearchResult({ keyword }: { keyword: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/category/${keyword}`,
    { cache: "force-cache" }
  );
  const goods: GoodDataType[] = await res.json();
  if (goods.length === 0) {
    return <h4>{keyword} 카데고리에 해당하는 제품이 없습니다</h4>;
  }
  return (
    <div>
      {goods.map((good) => (
        <GoodItem key={good.id} {...good} />
      ))}
    </div>
  );
}

// SEO 적용
/*
 export const metadata: Metadata = {
  title: "상품 검색 페이지",
  description: "상품 검색 페이지입니다.",
  openGraph: {
    title: "상품 검색 페이지",
    description: "상품 검색 페이지입니다.",
    images: [{ url: "/thumbnail.png" }],
  },
};
*/

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{ keyword: string }>;
}) => {
  const { keyword } = await searchParams;
  return {
    title: `상품 ${keyword}검색 페이지`,
    description: `상품 ${keyword}검색 페이지입니다.`,
    openGraph: {
      title: `상품 ${keyword}검색 페이지`,
      description: `상품 ${keyword}검색 페이지입니다.`,
      images: [{ url: "/thumbnail.png" }],
    },
  };
};

// 쿼리 처리하기
// 아래 페이지는 쿼리를 서버에서 읽어들여서 처리함.
// 주소/search?keword=iu
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ keyword: string }>;
}) {
  const { keyword } = await searchParams;
  // console.log(keyword);

  return (
    <div className={style.container}>
      <h4>
        카테고리 <strong>{keyword}</strong> 검색페이지
      </h4>
      <Suspense fallback={<p>{keyword} 검색 결과 로딩중 . . .</p>}>
        <SearchResult keyword={keyword} />
      </Suspense>
    </div>
  );
}
