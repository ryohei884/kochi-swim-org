import { MinusIcon, PlusIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AnchorTag } from "@/lib/utils";

const faqs = [
  {
    title: "2026年度水泳資格表",
    description: `2026年度の性別・年齢区分別資格級は以下のとおりです。
- [2026年度水泳資格表](https://nzprheefai1ubld0.public.blob.vercel-storage.com/standard/qualification_standard.pdf)`,
  },
  /*
  {
    title: "2026年度〇〇大会標準記録",
    description: `2026年度の年齢・性別資格級は以下のとおりです。
- [2026年度水泳資格表](https://nzprheefai1ubld0.public.blob.vercel-storage.com/registration/Initial_Registration_Manual_2026.pdf)`,
  },
    {
    title: "2026年度泳力検定合格基準",
    description: `2026年度の年齢・性別資格級は以下のとおりです。
- [2026年度水泳資格表](https://nzprheefai1ubld0.public.blob.vercel-storage.com/registration/Initial_Registration_Manual_2026.pdf)`,
  },
  */
];

export default function Standard() {
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
