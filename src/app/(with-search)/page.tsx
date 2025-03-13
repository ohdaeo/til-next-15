import styles from "@/app/(with-search)/layout.module.css";
import { AllGoods } from "@/components/all-goods";
import { RandomGoods } from "@/components/random-goods";
import GoodItemSkeleton from "@/components/skeleton/good-item-skeleton";
import { Suspense } from "react";

// Dynamic 으로 변환
export const dynamic = "force-dynamic";

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
