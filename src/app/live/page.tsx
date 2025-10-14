import LiveList from "@/components/live/live-list";
import Youtube from "@/components/live/youtube";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";

export default function Live() {
  return (
    <>
      <Header />
      <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
              ライブ配信
            </h2>
            <Youtube />
            <LiveList page="1" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
