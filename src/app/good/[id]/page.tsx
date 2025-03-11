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
  console.log(id);

  const { title, category, description, image, rating } = mockData;

  return (
    <div className={style.conteiner}>
      <div>
        <p className={style.title}>{title}</p>
        <div className={style.image} style={{ backgroundImage: `url${image}` }}>
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
