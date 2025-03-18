import style from "@/app/good/[id]/page.module.css";
import CateList from "@/components/cate-list";
import Editor from "@/components/editor";
import { GoodDataType } from "@/types/types";

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

  return (
    <div className={style.conteiner}>
      <CateList id={id} />
      <Editor />
    </div>
  );
}

// SEO
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
    );
    const good: GoodDataType = await res.json();
    const { title, description } = good;
    return {
      title: `상품 ${title} 상세 페이지`,
      description: `상품 설명 - ${description}`,
      openGraph: {
        title: `상품 ${title} 상세 페이지`,
        description: `상품 설명 - ${description}`,
        images: [{ url: "/thumbnail.png" }],
      },
    };
  } catch (error) {
    console.log(error);
  }
};
