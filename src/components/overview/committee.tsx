import Image from "next/image";

export default function Committee() {
  return (
    <div className="overflow-hidden">
      <div className="mx-auto max-w-2xl lg:max-w-7xl">
        <div className="mx-auto grid grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:max-w-none lg:min-w-full lg:flex-none lg:gap-y-8">
          <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
            <p className="text-justify indent-[1em] text-xl/8 text-gray-600 lg:mt-6 dark:text-gray-400">
              本連盟の活動は有志の会員によって支えられています。各会員はそれぞれの経験・知識・関心を活かしながら、各委員会で活躍しています。
            </p>
            <p className="mt-4 text-justify indent-[1em] text-base/7 text-gray-600 dark:text-gray-400">
              活動にご興味がありましたら、ぜひ各委員会にお問い合わせください。私たちと一緒に高知県の水泳を盛り上げていきましょう。
            </p>
          </div>
          <div className="pt-16 lg:row-span-2 lg:-mr-16 xl:mr-auto">
            <div className="-mx-8 grid grid-cols-2 gap-4 sm:-mx-16 sm:grid-cols-4 lg:mx-0 lg:grid-cols-2 xl:gap-8">
              <div className="aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10 dark:shadow-none dark:outline-white/10">
                <Image
                  alt=""
                  width={320}
                  height={320}
                  src={"/wp_club.jpg"}
                  priority={true}
                  className="block size-full object-cover"
                />
              </div>
              <div className="-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10 lg:-mt-40 dark:shadow-none dark:outline-white/10">
                <Image
                  alt=""
                  width={320}
                  height={320}
                  src={"/meeting.jpg"}
                  priority={true}
                  className="block size-full object-cover"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10 dark:shadow-none dark:outline-white/10">
                <Image
                  alt=""
                  width={320}
                  height={320}
                  src={"/as_club.jpg"}
                  priority={true}
                  className="block size-full object-cover"
                />
              </div>
              <div className="-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10 lg:-mt-40 dark:shadow-none dark:outline-white/10">
                <Image
                  alt=""
                  width={320}
                  height={320}
                  src={"/soukai.jpg"}
                  priority={true}
                  className="block size-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
