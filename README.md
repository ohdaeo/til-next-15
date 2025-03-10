![nextjs](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1738065463/noticon/gepermuh39ujljzf72e6.png)

# Next Js ver.15

### 시작하기

```bash
npx create-next-app@latest .
```

![Installing devDependencies](https://github.com/user-attachments/assets/a9f73c5c-5baf-4eea-815b-89bc8f1b9270)

- tailWind 는 일단 설치안함

1. `npm run dev`
2. `npm run build`
3. `npm run start`

### Router

1. Page Router

- src/pages/`routername`.tsx
- src/pages/board/[id].tsx

2. App Router

- src/`app`

**1. 일반 UIR 경로 처리**

- src/app/page.tsx `Home Page`

```tsx
export default function Home() {
  return <div>Hello</div>;
}
```

**2. UIR 쿼리 처리**

- src/app/search/page.tsx `Search Page`
- src/app/search/page.tsx `주소/search?keyword=검색어`

```tsx
// 쿼리를 서버에서 읽어들여서 처리함
export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ keyword: string }>;
}) {
  const { keyword } = await searchParams;
  console.log("검색어", keyword);
  return <div>{keyword} : Search</div>;
}
```

**Next 에서는 서버 컴포넌트가 기본이다.**

- console.log 를 출력 시 터미널(서버)에서 출력된다.

```
 GET /search?keyword=ddd 200 in 94ms
 ✓ Compiled in 247ms (708 modules)
검색어 ddd
 GET /search?keyword=ddd 200 in 58ms
```

**3. URI 의 Params 처리**

- src/app/good/page.tsx `Goods Page`
- src/app/good/[id]/page.tsx `주소/good/id`

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log(id);
  return <div>{id}번 : 제품 상세 페이지</div>;
}
```

- src/app/good/[...id]/page.tsx `주소/good/id/id/id` (중첩 라우터)

```
[ '100', '5', '12' ]
 GET /good/100/5/12 200 in 50ms
```

**4. 404 처리**

- src/app/not-found.tsx `주소/404` or `주소/notfound`

```tsx
export default function NotFound() {
  return <div>잘못된 경로입니다.</div>;
}
```

- src/app/search/not-found.tsx `주소/search/404`

* 추후에 업데이트 할 예정
