import Image from "next/image";
import Header from "@/components/top/header";
import Footer from "@/components/top/footer";

export default function Greeting() {
  return (
    <>
      <Header />
      <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
              ご挨拶
            </h2>
            <div className="overflow-hidden">
              <div className="mx-auto max-w-2xl lg:max-w-7xl">
                <section className="grid grid-cols-1 lg:mt-6 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16">
                  <div className="lg:row-span-2">
                    <div className="aspect-3/4 overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10">
                      <Image
                        alt=""
                        src={"/miura.jpg"}
                        className="block size-full object-cover"
                        width={560}
                        height={747}
                      />
                    </div>
                  </div>
                  <div>
                    {" "}
                    <div className="text-right lg:pr-8">
                      <p className="text-base/7 text-gray-600 dark:text-gray-400">
                        高知県水泳連盟会長
                      </p>
                      <h2 className="text-2xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-gray-100">
                        三浦 光夫
                      </h2>
                    </div>
                    <div className="lg:pr-8">
                      <p className="mt-6 text-justify indent-[1em] text-base/7 text-gray-600 dark:text-gray-400">
                        本連盟の活動目的は、「高知県における水泳及び水泳競技の健全なる普及と発展を図ること」としています。この目的達成のために競技力向上や競技会の開催、指導者や競技役員の育成及び各種講瑠会の開催などを実施しています。
                      </p>
                      <p className="mt-4 text-justify indent-[1em] text-base/7 text-gray-600 dark:text-gray-400">
                        競技会は常に選手のための大会であり、主役は選手であることをモットーに、また、人間形成の場であることとし、水泳のルールはもとより生活ルール、マナーの厳守等も指導しています。
                      </p>
                      <p className="mt-4 text-justify indent-[1em] text-base/7 text-gray-600 dark:text-gray-400">
                        水泳の普及、発展のためにはスイミングクラブ協会との連携は欠かせません。共同してコーチ研修や選手の強化育成合宿なども実施しています。競泳については、各ＳＣ、学校を主体に選手育成がなされていますが、そこでは出来ない「飛び込み」、「アーティスティックスイミング（AS）」、「水球」については本連盟直営の高知ＳＣを立ち上げ選手育成を図っています。競技者について申し上げますと、高知国体以来毎年全国大会に出場しており、中でも飛び込みの選手は近年全国でも常時上位に入賞しており、着実に成果を上げるに至っています。競泳、水球、ASも上位を狙える選手が育ってきています。
                      </p>
                      <p className="mt-4 text-justify indent-[1em] text-base/7 text-gray-600 dark:text-gray-400">
                        また、本連盟としては、スポーツ大会が地域の発展に貢献するものとして四国大会や全国大会の誘致にも積極的に取り組んでいるところです。心のこもった大会運営をしていくため、競技運営委員においては、これまでの大会運営事項のチェック、競技規則の再確認など細部に亘るチェックをしていただき万全の態勢で臨む心構えをしています。
                      </p>
                      <p className="mt-4 text-justify indent-[1em] text-base/7 text-gray-600 dark:text-gray-400">
                        それぞれの事業実施にあたっては沢山の競技役員や施設の充実が必要になります。行政の理解あるご協力や水泳に関心のある方々の本連盟へのご参加とご協力をお願い致します。
                      </p>
                      <p className="mt-4 text-justify indent-[1em] text-base/7 text-gray-600 dark:text-gray-400">
                        皆様方におかれましては、本年度も本連盟に対し変わらぬご厚情をいただき、格別のご支援。ご協力を賜りますようお願いいたします。
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
