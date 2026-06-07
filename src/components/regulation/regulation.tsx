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
    title: "宣伝・広告の媒体について",
    description: `
- [大切なことですから、本欄を読んで必ず守ってください](https://nzprheefai1ubld0.public.blob.vercel-storage.com/regulation/regulation3-W0qqYZCuPJCGlSX6BbVUM5WtIERT5R.pdf)`,
  },
  {
    title: "ロゴマーク等の取扱規程",
    description: `
- [競技会において着用又は携行することができる水泳用品、用具のロゴマーク等についての取扱規程](https://nzprheefai1ubld0.public.blob.vercel-storage.com/regulation/regulation2-wek1Qvw4md5DDaYn0kBSix3mLlPKbO.pdf)`,
  },
  {
    title: "マーケティング活動ガイドライン",
    description: `
- [（公財） 日本水泳連盟 競技者のマーケティング活動ガイドライン](https://nzprheefai1ubld0.public.blob.vercel-storage.com/regulation/regulation1-OmlsDuUmsO9pDWJLuKjT2ufeb7PdXJ.pdf)`,
  },
];

export default function Regulation() {
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
