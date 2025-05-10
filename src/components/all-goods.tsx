import { GoodDataType } from "@/types/types";
import GoodItem from "./good-item";

export async function AllGoods() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?limit=10`,
    { cache: "force-cache" }
  );
  const allGoods: GoodDataType[] = await res.json();
  // console.log("allGoods :", allGoods);

  return (
    <>
      {allGoods.map((good) => (
        <GoodItem key={good.id} {...good} />
      ))}
    </>
  );
}
