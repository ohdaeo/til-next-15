"use client";

import { createReviewAction } from "@/actions/create-review-action";
import style from "@/components/editor.module.css";
import { useActionState } from "react";

export default function Editor() {
  // React 19 버전부터 적용가능
  // 서버액션의 상태를 파악해서 클라이언트에서 활용하는 방식
  const [state, formAction, isPending] = useActionState(
    createReviewAction,
    null
  );

  return (
    <div className={style.add_container}>
      <h3>제품 추가하기 </h3>
      <form action={formAction} className={style.form_container}>
        <input type="hidden" name="id" value={500} readOnly />
        <div className={style.input_container}>
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
        </div>
        <textarea
          name="description"
          placeholder="설명"
          required
          defaultValue={"lorem..."}
        />
        <div className={style.input_container}>
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
        </div>

        <button type="submit">작성하기</button>
      </form>
    </div>
  );
}
