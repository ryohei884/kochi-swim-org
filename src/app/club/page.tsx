import ClubList from "@/components/club/club-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";


export default function Page() {
  return (
    <>
      <Header />
      <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-5xl">
            <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
              直営クラブ
            </h2>
            <ClubList />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
