![nextjs](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1738065463/noticon/gepermuh39ujljzf72e6.png)

# Data Fetching

- Next.js 앱 라우터는 React와 Web 플랫폼을 기반으로 한 간소화된 데이터 가져오기 시스템을 도입한다.

- 사용자 페이지 요청 시 데이터를 사전에 호출하여 처리함

1. 서버에서 데이터 가져오기
   : 서버 컴포넌트를 사용하여 서버에서 데이터를 가져옵니다.

2. 병렬 및 순차 데이터 가져오기
   : 워터폴을 최소화하고 로딩 시간을 줄이기 위해 데이터를 병렬로 가져옵니다.

3. 레이아웃과 페이지에 대한 자동 가져오기 요청 중복 처리
   : 레이아웃과 페이지에서 데이터를 가져옵니다. Next.js는 트리 내에서 요청을 자동으로 중복 처리합니다.

4. 로딩 UI, 스트리밍 및 서스펜스 사용
   : 페이지를 점진적으로 렌더링하고 나머지 콘텐츠를 로드하는 동안 사용자에게 결과를 표시합니다.

**순서**

사용자 라우터 요청
-> Next 서버가 html 에 필요한 데이터
-> BE 요청 Next 서버가 완성된 html 을 반환하고
-> 만약, 클라이언트 컴포넌트가 있다면 클라이언트 컴포넌트만 번들링한 js 를 돌려주고, 다시 Hydratin 과정으로 진행

## Page Router

- SSR (Server Side Rendering) : getServerSideProps 함수
- SSG (Server Static Generation) : getStaticProps 함수
- ISR (Incremental Static Regeneration) : SSG, revalidate 를 이용해서 갱신
- 동적 라우터를 위해 필요한 함수(/good/1, /good/2..) : getStaticPaths 함수
- 위의 함수들은 무조건 라우터 경로에 맞는 페이지에만 작성할 수 있다.
  `http://localhost:3000/setting` ===> /src/pages/setting.tsx
- 일반 컴포넌트는 Props 로 전달받는 방법 또는 Context 를 이용하는 방법으로 활용.

## App Router

- 서버 컴포넌트라면 마음대로 데이터를 패칭할 수 있도록 적용함.

### 기본예제 (인덱스 페이지 데이터 패칭)

- src\app\(with-search)\page.tsx

```tsx
import styles from "@/app/(with-search)/layout.module.css";
import GoodItem from "@/components/good-item";
import { GoodDataType } from "@/types/types";

export default async function Home() {
  const res = await fetch("https://fakestoreapi.com/products");
  const allGoods: GoodDataType[] = await res.json();
  console.log("allGoods :", allGoods);

  const resRandom = await fetch("https://fakestoreapi.com/products");
  const RandomGoods: GoodDataType[] = await resRandom.json();
  console.log("RandomGoods :", RandomGoods);

  return (
    <div className={styles.container}>
      <section>
        <h3>지금 추천하는 상품들</h3>
        {RandomGoods.map((good) => (
          <GoodItem key={good.id} {...good} />
        ))}
      </section>
      <section>
        <h3>전체 상품</h3>
        {allGoods.map((good) => (
          <GoodItem key={good.id} {...good} />
        ))}
      </section>
    </div>
  );
}
```

- src\components\all-goods.tsx

```tsx
import { GoodDataType } from "@/types/types";
import GoodItem from "./good-item";

export async function AllGoods() {
  const res = await fetch("https://fakestoreapi.com/products");
  const allGoods: GoodDataType[] = await res.json();
  console.log("allGoods :", allGoods);

  return (
    <>
      {allGoods.map((good) => (
        <GoodItem key={good.id} {...good} />
      ))}
    </>
  );
}
```

- src\components\random-goods.tsx

```tsx
import { GoodDataType } from "@/types/types";
import GoodItem from "./good-item";

export async function RandomGoods() {
  const resRandom = await fetch("https://fakestoreapi.com/products?limit=3");
  const RandomGoods: GoodDataType[] = await resRandom.json();
  console.log("RandomGoods :", RandomGoods);

  return (
    <>
      {RandomGoods.map((good) => (
        <GoodItem key={good.id} {...good} />
      ))}
    </>
  );
}
```

**Be 의 API 주소를 .env 에 환경설정파일로 저장하기**

- 환경설정 파일이 웹브라우저에 노출이 되는 경우
  `NEXT_PUBLIC_API_URL=https://fakestoreapi.com`

- 환경설정 파일이 서버에서만 활용되는 경우
  `API_URL=https://fakestoreapi.com`

### 응용예제 (검색 페이지 데이터 패칭)

- src\app\(with-search)\search\page.tsx

```tsx
import GoodItem from "@/components/good-item";
import { GoodDataType } from "@/types/types";
import style from "@/app/(with-search)/search/page.module.css";
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

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/category/${keyword}`
  );
  const goods: GoodDataType[] = await res.json();
  if (goods.length === 0) {
    return <h4>{keyword} 카데고리에 해당하는 제품이 없습니다</h4>;
  }

  return (
    <div className={style.container}>
      <h4>
        카테고리 <strong>{keyword}</strong> 검색페이지
      </h4>
      <div>
        {goods.map((good) => (
          <GoodItem key={good.id} {...good} />
        ))}
      </div>
    </div>
  );
}
```

**그렇지만 검색창의 데이터 패칭은 사용자가 검색 할 내용을 예측하기 어려움으로 데이터 패칭을 하는 것은 부적합하다**

## 응용예제 (상세페이지 데이터 패칭)

- src\app\good\[id]\page.tsx

```tsx
import { GoodDataType } from "@/types/types";
import style from "@/app/good/[id]/page.module.css";
import Image from "next/image";

const mockData: GoodDataType = {
  id: 1,
  title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
  price: 109.95,
  description:
    "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
  category: "men's clothing",
  image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  rating: { rate: 3.9, count: 120 },
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // console.log(id);

  let good: GoodDataType | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
    );
    good = await res.json();
    // console.log(good);
  } catch (error) {
    console.log(error);
  }

  if (!good) {
    return <div>존재하지 않는 상품입니다.</div>;
  }

  const { title, image, category, rating, description } = good;

  return (
    <div className={style.conteiner}>
      <div>
        <p className={style.title}>{title}</p>
        <div
          className={style.image}
          style={{ backgroundImage: `url(${image})` }}
        >
          <Image src={image} width={245} height={350} alt={title} />
        </div>
        <p className={style.category}>{category}</p>
        <p className={style.rating}>
          별점 : {rating.rate} 점 ({rating.count})
        </p>
        <p className={style.description}>{description}</p>
      </div>
    </div>
  );
}
```

# Data Caching

- 서버가 실행되는 동안에 요청된 데이터를 서버에 보관하는 것
- 서버 요청 및 배포 전반에 걸쳐 fetch 요청에 대한 결과를 유지
- 서버에 요청하는 횟수를 줄이기 위해 데이터를 저장하는 과정
- next.js는 자동적으로 fetch가 리턴한 값을 서버의 Data Cache에 캐싱한다.

## 사용 방법

1. Next 의 fetch 를 사용한다.

2. 개별 fetch 요청을 캐싱하려면, cache: 'force-cache'

```ts
fetch("https://...", { cache: "force-cache" });
```

3. 개별 fetch 요청에 대한 캐싱을 사용하지 않으려면, cache: 'no-store'

```ts
fetch("https://...", { cache: "no-store" });
```

4. Revalidating data (데이터 재검증)

- 데이터 캐시를 비우고 최신 데이터를 다시 가져오는 과정
- 정해진 시간 간격으로 데이터를 revalidate 하려면, fetch의 next.revalidate 옵션을 사용하여 리소스의 캐시 수명을 설정할 수 있다

```ts
fetch("https://...", { next: { revalidate: 3600 } }); // 최대 1시간마다 revalidate
```

5. revalidateTag

- 여러 라우트에 걸쳐 있는 fetch 요청을 revalidate

```ts
fetch("https://...", { next: { tags: ["collection"] } });
```

### Next 서버에서 API 호출하는 과정

- next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
/_ config options here _/
images: {
remotePatterns: [
{
protocol: "https",
hostname: "fakestoreapi.com",
},
],
},
// Data Caching
logging: {
fetches: {
fullUrl: true,
},
},
};

export default nextConfig;

```

### 기본예제

- src\components\random-goods.tsx

```tsx
import { GoodDataType } from "@/types/types";
import GoodItem from "./good-item";

export async function RandomGoods() {
  let randomGoods: GoodDataType[] = [];
  try {
    const resRandom = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?limit=3`,
      { cache: "force-cache" }
    );
    randomGoods = await resRandom.json();
    // console.log(randomGoods);
  } catch (error) {
    console.log(error);
  }
  if (randomGoods.length === 0) {
    return <div>상품이 없습니다.</div>;
  }
  return (
    <>
      {randomGoods.map((good) => (
        <GoodItem key={good.id} {...good} />
      ))}
    </>
  );
}
```

### 기본예제 (Revalidating data)

- src\components\random-goods.tsx

```tsx
import { GoodDataType } from "@/types/types";
import GoodItem from "./good-item";

export async function RandomGoods() {
  let randomGoods: GoodDataType[] = [];
  try {
    const resRandom = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?limit=3`,
      { next: { revalidate: 3 } }
    );
    randomGoods = await resRandom.json();
    // console.log(randomGoods);
  } catch (error) {
    console.log(error);
  }
  if (randomGoods.length === 0) {
    return <div>상품이 없습니다.</div>;
  }
  return (
    <>
      {randomGoods.map((good) => (
        <GoodItem key={good.id} {...good} />
      ))}
    </>
  );
}
```

### 기본예제 (동적 라우팅 페이지)

- /src/app/good/[id]/page.tsx

```tsx
import { GoodDataType } from "@/types/types";
import style from "@/app/good/[id]/page.module.css";
import Image from "next/image";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // console.log(id);

  let good: GoodDataType | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        cache: "force-cache",
      }
    );
    good = await res.json();
    // console.log(good);
  } catch (error) {
    console.log(error);
  }

  if (!good) {
    return <div>존재하지 않는 상품입니다.</div>;
  }

  const { title, image, category, rating, description } = good;

  return (
    <div className={style.container}>
      <div className={style.title}>{title}</div>
      <div className={style.image} style={{ backgroundImage: `url(${image})` }}>
        <Image src={image} width={245} height={350} alt={title} />
      </div>
      <div className={style.category}>{category}</div>
      <div className={style.rating}>
        Rating: {rating.rate} | {rating.count}
      </div>
      <div className={style.description}>{description}</div>
    </div>
  );
}
```

# Full Route Cache (전체 라우트 캐시)

- 빌드 타임에 페이지를 생성하고, 렌더링 결과를 Next.js 서버의 캐시에 저장한다.
- 라우트의 렌더링 결과를 캐시하여 서버에서 클라이언트로의 반복적인 렌더링 요청을 줄이고, 페이지 로드 성능을 향상시키는 것.

1. Static Page

- 풀 라우트 캐시 적용
- Dynamic Page로 분류되지 않는 경우, 기본적으로 Static Page로 설정된다.

2. Dynamic Page

- 페이지 내부에서 cache: "no-store"로 설정된 fetch 요청.
- 언제든지 시간에 따라서 자유롭게 변화할 수 있는 쿠키, 헤더, 쿼리스트링과 같은 동적 값들을 꺼내 사용하는 경우.

### 기본예제 (동적 라우터를 Static Page 만들기)

- src\app\good\[id]\page.tsx

```tsx
import { GoodDataType } from "@/types/types";
import style from "@/app/good/[id]/page.module.css";
import Image from "next/image";

// 특정한 페이지를 Static Page 로 생성
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // console.log(id);

  let good: GoodDataType | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        cache: "force-cache",
      }
    );
    good = await res.json();
    // console.log(good);
  } catch (error) {
    console.log(error);
  }

  if (!good) {
    // 404 띄우기
    notFound();
    return <div>존재하지 않는 상품입니다.</div>;
  }

  const { title, image, category, rating, description } = good;

  return (
    <div className={style.container}>
      <div className={style.title}>{title}</div>
      <div className={style.image} style={{ backgroundImage: `url(${image})` }}>
        <Image src={image} width={245} height={350} alt={title} />
      </div>
      <div className={style.category}>{category}</div>
      <div className={style.rating}>
        Rating: {rating.rate} | {rating.count}
      </div>
      <div className={style.description}>{description}</div>
    </div>
  );
}
```
