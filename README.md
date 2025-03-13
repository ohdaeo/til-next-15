![nextjs](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1738065463/noticon/gepermuh39ujljzf72e6.png)

# Error

- Next.js 에서 에러를 담당하는 error.tsx

**주의사항**

1. 서버와 클라이언트 둘다 처리해야한다.
2. `use client` 를 사용해야한다.

```tsx
"use client";

- src\app\(with-search)\error.tsx

export default function Error() {
  return (
    <div>
      <h3>error 가 발생하였습니다</h3>
    </div>
  );
}
```

3. 에러 메세지 출력

- src\app\(with-search)\error.tsx

```tsx
"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div>
      <h3>{error.message} 가 발생하였습니다</h3>
    </div>
  );
}
```

4. 에러 새로고침

- reset : 오류 범위를 재설정하는 함수. 실행되면 함수는 경로 세그먼트를 다시 렌더링하려고 시도한다.

- src\app\(with-search)\error.tsx

```tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h3>{error.message} 가 발생하였습니다</h3>
      <button onClick={() => reset()}></button>
    </div>
  );
}
```

OR

```tsx
"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div>
      <h3>{error.message} 가 발생하였습니다</h3>
      <button onClick={() => window.location.reload()}></button>
    </div>
  );
}
```

5. Next 제공하는 기능

- Next 서버에 자료를 다시 호출한다.
- 컴포넌트도 같이 리렌더링 된다.

```tsx
"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div>
      <h3>{error.message} 가 발생하였습니다</h3>
      <button
        onClick={() => {
          // react 18 버전에 추가
          startTransition(() => {
            router.refresh(); // 서버 컴포넌트 다시 실행하기를 요청
            reset(); // 컴포넌트 새로고침
          });
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
```
