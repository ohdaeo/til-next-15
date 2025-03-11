import { GoodDataType } from "@/types/types";
import Link from "next/link";
import style from "@/components/good-item.module.css";

const GoodItem = ({ id, title, image, category, rating }: GoodDataType) => {
  return (
    <div>
      <Link href={`/good/${id}`} className={style.container}>
        <img src={image} width={80} height={150} alt={title} />
        <div>
          <p className={style.title}>{title}</p>
          <p className={style.category}>{category}</p>
          <br />
          <div className={style.rating}>
            별점 : {rating.rate}점 ({rating.count})
          </div>
        </div>
      </Link>
    </div>
  );
};

export default GoodItem;
