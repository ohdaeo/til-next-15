// 쿼리를 서버에서 읽어들여서 처리함
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ keyword: string }>;
}) {
  const { keyword } = await searchParams;
  console.log("검색어", keyword);
  return <div>{keyword} : Search</div>;
}
