![nextjs](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1738065463/noticon/gepermuh39ujljzf72e6.png)

# Loading

- 시작 전이나 시행 도중에 다음에 로드해야 할 부분을 미리 로드하는 방법이다.
- Dynamic Page에 해당한다.

1. Next 에서 제공하는 Loading.tsx 는 page 에 적용된다.
2. 컴포넌트에서는 Suspense 를 활용

### Page 에 로딩처리

- src\app\(with-search)\search\loading.tsx

```tsx
export default function loading() {
  return <div>검색 결과 로딩중...</div>;
}
```

**주의사항**

- 각 라우터마다 loading.tsx 을 설정해야하며, 특정 컴포넌트에 로딩을 설정할수없다.

### Component 에 로딩처리

- src\app\(with-search)\search\page.tsx

```tsx
import GoodItem from "@/components/good-item";
import { GoodDataType } from "@/types/types";
import style from "@/app/(with-search)/search/page.module.css";
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
```

### 스켈레톤 적용하기

- src\components\skeleton\good-item-skeleton.tsx

```tsx
import style from "@/components/skeleton/good-item-skeleton.module.css";

export default function GoodItemSkeleton() {
  return (
    <div className={style.container}>
      <div className={style.image}></div>
      <div className={style.box}>
        <div className={style.title}></div>
        <div className={style.category}></div>
        <br />
        <div className={style.rating}></div>
      </div>
    </div>
  );
}
```

- src\app\(with-search)\page.tsx

```tsx
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
```

### 스켈레톤 응용예제

- src\components\skeleton\good-item-skeleton-list.tsx

```tsx
import GoodItemSkeleton from "./good-item-skeleton";

export default function GoodItemSkeletonList({ count }: { count: number }) {
  const arr = new Array(count).fill(0);
  return (
    <>
      {arr.map((_, index) => (
        <GoodItemSkeleton key={index} />
      ))}
    </>
  );
}
```

- src\app\(with-search)\page.tsx

```tsx
import style from "@/app/(with-search)/page.module.css";
import { AllGoods } from "@/components/all-goods";
import { RandomGoods } from "@/components/random-goods";
import GoodItemSkeleton from "@/components/skeleton/good-item-skeleton";
import GoodItemSkeletonList from "@/components/skeleton/good-item-skeleton-list";
import { Suspense } from "react";

// 강제로 Dynamic 으로 변경하는 방안
// next 에서는 page 를 강제로 변경하는 방법 제공
// export const dynamic = "auto";
export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 상품</h3>
        <Suspense fallback={<GoodItemSkeletonList count={3} />}>
          <RandomGoods />
        </Suspense>
      </section>
      <section>
        <h3>전체 상품</h3>
        <Suspense fallback={<GoodItemSkeletonList count={5} />}>
          <AllGoods />
        </Suspense>
      </section>
    </div>
  );
}
```
