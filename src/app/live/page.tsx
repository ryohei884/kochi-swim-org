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
            <Youtube />
            <LiveList page="1" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
