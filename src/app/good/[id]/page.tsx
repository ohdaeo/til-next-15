import { GoodDataType } from "@/types/types";
import style from "@/app/good/[id]/page.module.css";
import Image from "next/image";
import { notFound } from "next/navigation";

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
