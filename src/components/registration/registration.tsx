import { ExternalLink, MinusIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const faqs = [
  /*
  {
    title: "2026年度 翌年度登録の手順",
    description: `2026年度の競技者登録は、WebSWMSYSから行ってください。  
- [WebSWMSYS](https://webswmsys.swim.or.jp/login)
- [初回登録用マニュアル](https://nzprheefai1ubld0.public.blob.vercel-storage.com/registration/Registration_new_2026-O1GOW031nL3L8F3wjgIk8aaWq4zG6H)
- [年度更新マニュアル](https://nzprheefai1ubld0.public.blob.vercel-storage.com/registration/Registration_2026-ynYvPvM269iQ7cjB8V7mbvvqTelT5T)
- [団体・競技者登録マニュアル](https://nzprheefai1ubld0.public.blob.vercel-storage.com/registration/Registration_newFY_2026-3dzUpLVx4YtXw6ztT2nElrZhJ3A2W4)
- [選手登録送付書(学校用・SC用)](https://nzprheefai1ubld0.public.blob.vercel-storage.com/registration/Registration_submit_2026-ebwifLYc2xe3KtLw6a93Nv5y6Kr8UQ)
スイミングクラブで登録されている選手が高校や中学校で新規に登録する場合は、登録の際に7桁の選手登録番号が必要になりますので、事前にご準備ください。
ご不明な点がありましたら、（一社）高知県水泳連盟にご連絡ください。
* [お問い合わせ](https://swim-kochi.org/contact)`,
  },
  */
  {
    title: "登録マニュアルについて",
    description: `2026年度の登録に関するマニュアルは以下の通りです。
- [初回登録用マニュアル](https://nzprheefai1ubld0.public.blob.vercel-storage.com/registration/Initial_Registration_Manual_2026.pdf)
- [年度更新マニュアル](https://nzprheefai1ubld0.public.blob.vercel-storage.com/registration/Annual_Update_Manual_2026.pdf)
- [団体・競技者登録マニュアル](https://nzprheefai1ubld0.public.blob.vercel-storage.com/registration/Team_and_Athlete_Registration_Manual_2026.pdf)`,
  },
  {
    title: "WebSWMSYSについて",
    description: `選手登録・大会エントリーに使用するWebSWMSYSのURLは以下の通りです。ログインID等が不明な場合は、マニュアル内（団体・競技者登録マニュアル）の連絡先か、下記お問い合わせフォームからご連絡ください。
- [WebSWMSYS](https://webswmsys.swim.or.jp/login)`,
  },
  {
    title: "選手登録送付書",
    description: `選手登録に関しては、以下のエクセルファイルをダウンロードし、マニュアル（団体・競技者登録マニュアル）内の提出先まで必ず提出してください。その際に、中学校・高校とSCでは記載するシートが違うため、間違わないようにご注意ください。
- [選手登録送付書(学校用・SC用)](https://nzprheefai1ubld0.public.blob.vercel-storage.com/registration/Athlete_Registration_Form_2026.xlsx)`,
  },
  {
    title: "お問い合わせ",
    description: `ご不明な点がありましたら、マニュアル内（団体・競技者登録マニュアル）の連絡先か、下記お問い合わせフォームからご連絡ください。
- [お問い合わせ](https://swim-kochi.org/contact)`,
  },
  /*
  {
    title: "２０２６年度 翌年度登録の手順",
    description: `令和8年度の競技者登録は、
WebSWIMSYSから    行ってください。    
- [WebSWIMSYS](https://webswmsys.swim.or.jp/login)
- [初回登録用マニュアル]()
- [団体・競技者登録用手順]()
- [選手登録送付書(学校用・SC用・無償学校用)]()`,
  },
  {
    title: "中学校の監督の皆様へ",
    description: `以下の3大会へのエントリーは、WebSWIMSYSから行ってください。    
1. 高知地区中学校体育大会(大会コード：000000)
2. 高知県中学校体育大会(大会コード：000000)
3. 高知県学年別水泳競技大会(大会コード：000000)
    
上記の大会へエントリーする場合は、（公財）日本水泳連盟への団体登録と個人登録の両方が必要です。ただし、**登録費用は発生しません。**

スイミングクラブで登録されている選手が中学校で新規に登録する場合は、登録の際に7桁の選手登録番号が必要になりますので、事前にご準備ください。
 
- [WebSWIMSYS高知県中学校用簡易マニュアル]()
- [高知県内中学校登録番号一覧]()

ご不明な点がありましたら、（一社）高知県水泳連盟にご連絡ください。
* [お問い合わせ](https://swim-kochi.org/contact)`,
  },
  {
    title: "WebSWIMSYSのサービス停止案内",
    description: `[WebSWIMSYSのサービス停止案内]()`,
  },
  {
    title: "WebSWIMSYSの更新ログ",
    description: `[WebSWIMSYSの更新について]()
[エントリーの際の集計データをエクセルデータに変換する方法]()`,
  },
  {
    title: "WebSWIMSYSの利用マニュアル",
    description: `[WebSWIMSYSの利用マニュアル]()`,
  },
  */
];

export default function Registration() {
  const AnchorTag = ({ node, children, ...props }: any) => {
    try {
      props.href = URL.parse(props.href) ? props.href : "";
      props.target = "_blank";
      props.rel = "noopener noreferrer";
    } catch (e) {}
    return (
      <Link {...props} className="flex items-center underline">
        {children}
        <ExternalLink className="h-4 ml-1" />
      </Link>
    );
  };

  const UListTag = ({ node, children, ...props }: any) => {
    return (
      <ul {...props} className="list-disc list-outside pl-[1em] mb-[1em]">
        {children}
      </ul>
    );
  };

  const OListTag = ({ node, children, ...props }: any) => {
    return (
      <ol {...props} className="list-decimal list-outside pl-[1em] mb-[1em]">
        {children}
      </ol>
    );
  };

  const PTag = ({ node, children, ...props }: any) => {
    return (
      <p {...props} className="mb-[1em]">
        {children}
      </p>
    );
  };

  return (
    <dl className="mt-16 divide-y divide-gray-900/10 dark:divide-white/10">
      {faqs.map((faq) => (
        <Collapsible
          defaultOpen={true}
          key={faq.title}
          className="py-6 first:pt-0 last:pb-0"
        >
          <div>
            <dt>
              <CollapsibleTrigger className="group flex w-full items-start justify-between text-left text-gray-900 dark:text-white">
                <span className="text-base/7 font-semibold">{faq.title}</span>
                <span className="ml-6 flex h-7 items-center">
                  <PlusIcon
                    aria-hidden="true"
                    className="size-6 group-data-open:hidden"
                  />
                  <MinusIcon
                    aria-hidden="true"
                    className="size-6 group-not-data-open:hidden"
                  />
                </span>
              </CollapsibleTrigger>
            </dt>
          </div>
          <CollapsibleContent className="mt-2 pr-12">
            <dd className="prose">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  a: AnchorTag,
                  ul: UListTag,
                  ol: OListTag,
                  p: PTag,
                }}
              >
                {faq.description}
              </ReactMarkdown>
            </dd>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </dl>
  );
}

// <p className="text-base/7 text-gray-600 dark:text-gray-400">
// {faq.description}
// </p>
