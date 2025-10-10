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
            <Youtube src="https://www.youtube.com/embed/-JUlN4zCKBA?si=wYi0pHqJ1Cyq1qzR" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
