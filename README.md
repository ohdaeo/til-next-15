![nextjs](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1738065463/noticon/gepermuh39ujljzf72e6.png)

# Sever Action

1. 웹브라우저에서 BE 서버로 호출하는 비동기 함수
2. BE 에서 DB 로 자료를 돌려받는다.
3. BE 에서 웹브라우저로 자료를 돌려준다.
4. FE 에서 화면 처리

## Next `Server Action`

1. 웹브라우저에서 `Next 서버`로 호출하는 비동기 함수
2. `Next 서버`가 DB 에 자료를 돌려받는다.
3. FE 에서 화면 출력을 진행.

### 기본예제

```tsx
export default function Page() {
  const 서버액션 = async (formData: FormData) => {
    "use server";

    const nickName = formData.get("nickname");

    // awiat 서버기능호출(nicName)
    // await sql`INSERT INTO NickName (nickname) VALUES (${nickname})`;
  };

  return (
    <>
      <form action={서버액션}>
        <input type="text" name="nickname" />
        <button type="submit">입력</button>
      </form>
    </>
  );
}
```

### 응용예제 (액션코드 적용)

- src\app\good\[id]\page.tsx

```tsx
import { GoodDataType } from "@/types/types";
import style from "@/app/good/[id]/page.module.css";
import Image from "next/image";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
}

async function Detail({ id }: { id: string }) {
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
    notFound();
    // return <div>존재하지 않는 상품입니다.</div>;
  }

  const { title, image, category, rating, description } = good;
  return (
    <>
      <p className={style.title}>{title}</p>
      <div className={style.image} style={{ backgroundImage: `url(${image})` }}>
        <Image src={image} width={245} height={350} alt={title} />
      </div>
      <p className={style.category}>{category}</p>
      <p className={style.rating}>
        별점 : {rating.rate} 점 ({rating.count})
      </p>
      <p className={style.description}>{description}</p>
    </>
  );
}
// 사용자 평가 입력 컴포넌트
// 서버액션 처리
function Editor() {
  async function createReviewAction(formData: FormData) {
    "use server";
    const id = formData.get("id")?.toString();
    const title = formData.get("title")?.toString();
    const price = formData.get("price")?.toString();
    const description = formData.get("description")?.toString();
    const image = formData.get("image")?.toString();
    const category = formData.get("category")?.toString();

    if (!id || !title || !price || !description || !image || !category) {
      return;
    }

    console.log("formData", id, title, price, description, image, category);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        body: JSON.stringify({ title, price, description, image, category }),
      });
      console.log("res.formData", res.formData);
    } catch (error) {
      console.log("error", error);
    }
  }
  return (
    <div>
      <form action={createReviewAction}>
        <input type="hidden" name="id" value={500} readOnly />

        <input
          type="text"
          name="title"
          placeholder="상품명"
          required
          defaultValue={"test product"}
        />
        <input
          type="text"
          name="price"
          placeholder="가격"
          required
          defaultValue={"13.5"}
        />
        <input
          type="text"
          name="description"
          placeholder="설명"
          required
          defaultValue={"lorem..."}
        />
        <input
          type="text"
          name="image"
          placeholder="이미지"
          required
          defaultValue={"https://i.pravatar.cc"}
        />
        <input
          type="text"
          name="category"
          placeholder="카테고리"
          required
          defaultValue={"category"}
        />

        <button type="submit">작성하기</button>
      </form>
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // console.log(id);

  return (
    <div className={style.conteiner}>
      <Detail id={id} />
      <Editor />
    </div>
  );
}
```

### 심화예제 (액션분리)

- src\actions\create-review-action.ts

```tsx
"use server";

export async function createReviewAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString();
  const price = formData.get("price")?.toString();
  const description = formData.get("description")?.toString();
  const image = formData.get("image")?.toString();
  const category = formData.get("category")?.toString();

  if (!id || !title || !price || !description || !image || !category) {
    return;
  }

  console.log("formData", id, title, price, description, image, category);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: "POST",
      body: JSON.stringify({ title, price, description, image, category }),
    });
    console.log("res.formData", res.formData);
  } catch (error) {
    console.log("error", error);
  }
}
```

### 심화예제 (새로운 데이터가 처리 되었을 때 리렌더링)

Static Page 로 데이터 패칭, 캐싱을 하였다
Static 된 내용을 새로이 랜더링 하도록 요청

**주의사항**
오직 서버에서만 호출 한다.
클라이언트에서 요청을 해도 화면이 리렌더링 될 경우 새로운 내용을 출력하지 못한다.
revalidatePath (인자)

**revalidatePath 방식**

1. 특정 페이지만 내용갱신 revalidatePath(`/주소/${id}`)
2. 특정 경로의 모든 동적 페이지 내용 갱신 revalidatePath (`/주소/${id}`, "page")
3. 특정 레이아웃을 갖는 모든 페이지 내용 갱신 (`/(with-search)`, "layout")
4. 전체 내용을 갱신 revalidatePath(`/`, "layout")

**revalidateTag 방식**

1. 특정 태그 값을 기준으로 데이터 내용 갱신 : revalidateTag(`good-${id}`)

### 기본예제

- src\app\good\[id]\page.tsx

```tsx
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
       cache: "force-cache", ===> next: {tags[`good-${id}`]}
    });

```

### 기본예제

- src\actions\create-review-action.ts

```tsx
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function createReviewAction(formData: FormData) {
  console.log("Next 서버 액션");
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString();
  const price = formData.get("price")?.toString();
  const description = formData.get("description")?.toString();
  const image = formData.get("image")?.toString();
  const category = formData.get("category")?.toString();

  console.log(
    "Next 서버 액션 전달 변수 : ",
    id,
    title,
    price,
    description,
    image,
    category
  );
  if (!id || !title || !price || !description || !image || !category) {
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: "POST",
      body: JSON.stringify({ title, price, description, image, category }),
    });
    const { id } = await res.json();
    console.log("상품 등록 성공", id);

    // 태그를 이용하는 경우
    revalidateTag(`good-${id}`);

    // 패스를 이용하는 경우
    revalidatePath(`/good/${id}`);
  } catch (error) {
    console.log(error);
  }
}
```

### 응용예제 (클라이언트 컴포넌트에서 서버 액션 호출시 제어)

1. 서버액션 호출 시 로딩 상태, 에러상태를 제어하고싶다.

## 실습

- src\components\editor.tsx ➡ 클라이언트로 변경

```tsx
"use client";
import { createReviewAction } from "@/actions/create-review-action";
import style from "@/components/editor.module.css";
import { stat } from "fs";
import { useActionState, useEffect } from "react";

export default function Editor() {
  // React 19 버전 부터 적용가능
  // 서버액션의 상태를 파악해서 클라이언트에서 활용하는 방식
  const [state, formAction, isPending] = useActionState(
    createReviewAction,
    null
  );

  // state 가 변경되면 실행하기
  useEffect(() => {
    if (state && !state.status) {
      alert(state.message);
    }
  }, [state]);

  // 서버 액션이 진행중..
  if (isPending) {
    return <div>서버 액션 진행중 ...</div>;
  }

  // // 서버 액션의 결과가 status 가 false 라면
  if (state?.status === false) {
    return <p>{state.message}</p>;
  }

  return (
    <div className={style.add_container}>
      <h3>제품 추가하기 </h3>
      <form action={formAction} className={style.form_container}>
        <input type="hidden" name="id" value={500} readOnly />
        <div className={style.input_container}>
          <input
            disabled={isPending}
            type="text"
            name="title"
            placeholder="상품명"
            required
            defaultValue={"test product"}
          />
          <input
            disabled={isPending}
            type="text"
            name="price"
            placeholder="가격"
            required
            defaultValue={"13.5"}
          />
        </div>
        <textarea
          disabled={isPending}
          name="description"
          placeholder="설명"
          required
          defaultValue={"lorem..."}
        />
        <div className={style.input_container}>
          <input
            disabled={isPending}
            type="text"
            name="image"
            placeholder="이미지"
            required
            defaultValue={"https://i.pravatar.cc"}
          />
          <input
            disabled={isPending}
            type="text"
            name="category"
            placeholder="카테고리"
            required
            defaultValue={"category"}
          />
        </div>
        <button disabled={isPending} type="submit">
          {isPending ? "작성중.." : "작성하기"}
        </button>
      </form>
    </div>
  );
}
```

## 삭제하기 기능을 통한 서버액션 및 컴포넌트 복습

- requestSubmit: https://www.devdic.com/javascript/reference/dom/method:2766/requestSubmit()

### 1. 서버 액션 만들기

- /src/actions/deleteAction.ts

```ts
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteAction(_: any, formData: FormData) {
  const goodId = formData.get("goodid") as string;
  if (!goodId) {
    return {
      status: false,
      message: `해당하는 ${goodId}가 없습니다.`,
    };
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${goodId}`,
      { method: "DELETE" }
    );
    const { id } = await res.json();

    revalidatePath(`/good/${goodId}`);
    revalidateTag(`good-${id}`);
    return {
      status: true,
      message: `${goodId} 삭제에 성공하였습니다.`,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: `해당하는 ${goodId}가 삭제에 실패하였습니다. 다시 시도해주세요.`,
    };
  }
}
```

- /src/components/delete-bt.tsx

```tsx
"use client";
import { deleteAction } from "@/actions/deleteAction";
import style from "@/components/delete-bt.module.css";
import { GoodDataType } from "@/types/types";
import { useActionState, useEffect, useRef } from "react";
export default function DeleteBt({ id }: GoodDataType) {
  const [state, formAction, isPending] = useActionState(deleteAction, null);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && !state.status) {
      alert(state.message);
    }
  }, [state]);
  return (
    <>
      <form action={formAction} className={style.container} ref={formRef}>
        <input type="hidden" name="goodid" value={id} readOnly hidden />
        {isPending ? (
          <div className={style.delete_btn}>Deleting...</div>
        ) : (
          <div
            className={style.delete_btn}
            onClick={() => formRef.current?.requestSubmit()}
          >
            Delete
          </div>
        )}
      </form>
    </>
  );
}
```

- /src/components/delete-bt.module.css

```css
.container {
  position: relative;
}
.delete_btn {
  position: absolute;
  right: 0;
  top: -50px;
  cursor: pointer;
  border: 1px solid rgb(220, 220, 220);
  padding: 5px 10px;
  border-radius: 5px;
}
```
