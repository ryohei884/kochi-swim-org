"use client";

// import RecordTable from "@/components/record/record-table";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";
import Link from "next/link";
export default function Page() {
  return (
    <>
      <Header />
      {/* <RecordTable /> */}
      <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-5xl">
            <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
              県記録
            </h2>
            <div className="mt-16 space-y-20 lg:mt-20">
              <Link
                href="https://sc-shikoku.net/kochi/?page_id=3219"
                rel="noopener noreferrer"
                target="_blank"
              >
                高知県スイミングクラブ協会のページへ
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
