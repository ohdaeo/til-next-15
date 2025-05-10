import styles from "@/app/(with-search)/layout.module.css";
import { AllGoods } from "@/components/all-goods";
import { RandomGoods } from "@/components/random-goods";
import GoodItemSkeleton from "@/components/skeleton/good-item-skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

// Dynamic 으로 변환
export const dynamic = "force-dynamic";

// SEO 적용
export const metadata: Metadata = {
  title: "상품 홍보 페이지",
  description: "상품 홍보 페이지입니다.",
  openGraph: {
    title: "상품 홍보 페이지",
    description: "상품 홍보 페이지입니다.",
    images: [{ url: "/thumbnail.png" }],
  },
};

export default async function Home() {
  return (
    <div className={styles.container}>
      <section>
        <h3>지금 추천하는 상품들</h3>
        <Suspense
          fallback={
            <>
              <GoodItemSkeleton />
              <GoodItemSkeleton />
              <GoodItemSkeleton />
            </>
          }
        >
          <RandomGoods />
        </Suspense>
      </section>
      <section>
        <h3>전체 상품</h3>
        <Suspense
          fallback={
            <>
              <GoodItemSkeleton />
              <GoodItemSkeleton />
              <GoodItemSkeleton />
              <GoodItemSkeleton />
              <GoodItemSkeleton />
            </>
          }
        >
          <AllGoods />
        </Suspense>
      </section>
    </div>
  );
}
