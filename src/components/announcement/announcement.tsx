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
  {
    title: "2026年度(令和8年度)競技者登録について",
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
];

export default function Announcement() {
  const AnchorTag = ({ node, children, ...props }: any) => {
    try {
      new URL(props.href ?? "");
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
        <Collapsible key={faq.title} className="py-6 first:pt-0 last:pb-0">
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
