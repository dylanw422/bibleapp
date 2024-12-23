import { niv } from "@/bibles/niv/NIV";
import { BiblePage } from "@/components/bible-page";

export default async function Page({
  params,
}: {
  params: Promise<{ book: string }>;
}) {
  const book = (await params).book;
  return <BiblePage version={JSON.stringify(niv)} book={book} />;
}
