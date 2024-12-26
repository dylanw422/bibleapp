import { BiblePage } from "@/components/bible-page";

export default async function Page({
  params,
}: {
  params: Promise<{ book: string }>;
}) {
  const book = (await params).book;
  return <BiblePage version="nkjv" book={book} />;
}
