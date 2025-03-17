import style from "@/app/good/[id]/page.module.css";
import CateList from "@/components/cate-list";
import Editor from "@/components/editor";

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
