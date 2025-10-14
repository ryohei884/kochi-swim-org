import { Fragment } from "react";

const teams = [
  {
    title: "名誉会長",
    committees: [
      {
        id: 0,
        name: "名誉会長",
        head: "中西 清二",
        description: "",
        contact: "",
      },
    ],
  },
  {
    title: "代表理事",
    committees: [
      {
        id: 1,
        name: "会長",
        head: "三浦 光夫",
        description: "",
        contact: "",
      },
    ],
  },
  {
    title: "理事",
    committees: [
      {
        id: 2,
        name: "副会長",
        head: "清水 雅明",
        description: "高知SC(競泳)",
        contact: "",
      },
      {
        id: 3,
        name: "副会長",
        head: "寺尾 緑",
        description: "競技力強化委員会(AS)、高知SC(AS)",
        contact: "",
      },
      {
        id: 4,
        name: "理事長",
        head: "堤 知之",
        description: "学生委員会、競技委員会、記録委員会",
        contact: "",
      },
      {
        id: 5,
        name: "副理事長",
        head: "和田 英晃",
        description: "競技委員会、記録委員会、スイミングクラブ委員会",
        contact: "",
      },
      {
        id: 6,
        name: "副理事長",
        head: "北村 和代",
        description: "総務委員会、障害者スポーツ委員会",
        contact: "",
      },
      {
        id: 7,
        name: "常任理事",
        head: "赤崎 由香",
        description: "競技力強化委員会(競泳)",
        contact: "",
      },
      {
        id: 8,
        name: "常任理事",
        head: "小谷 直美",
        description: "会計委員会、高知SC(水球)",
        contact: "",
      },
      {
        id: 9,
        name: "常任理事",
        head: "竹田 礼子",
        description: "競技力強化委員会(AS)",
        contact: "",
      },
      {
        id: 10,
        name: "常任理事",
        head: "竹村 和洋",
        description: "事務局長、競技委員会、中体連委員会",
        contact: "",
      },
      {
        id: 11,
        name: "常任理事",
        head: "徳田 毅",
        description: "競技力強化委員会(水球)",
        contact: "",
      },
      {
        id: 12,
        name: "常任理事",
        head: "西岡 伸朗",
        description: "競技委員会、情報システム委員会、高体連委員会",
        contact: "",
      },
      {
        id: 13,
        name: "常任理事",
        head: "平田 大",
        description: "普及委員会",
        contact: "",
      },
      {
        id: 14,
        name: "常任理事",
        head: "瓶子 勇次郎",
        description: "競技力強化委員会(飛込)",
        contact: "",
      },
      {
        id: 15,
        name: "常任理事",
        head: "瓶子 笑里佳",
        description: "競技力強化委員会(飛込)、高知SC(飛込)",
        contact: "",
      },
      {
        id: 16,
        name: "常任理事",
        head: "山本 泰士",
        description: "競技委員会",
        contact: "",
      },
      {
        id: 17,
        name: "常任理事",
        head: "吉川 彰二郎",
        description: "マスターズ委員会",
        contact: "",
      },
      {
        id: 18,
        name: "常任理事",
        head: "林 良平",
        description: "情報システム委員会",
        contact: "",
      },
      {
        id: 19,
        name: "監事",
        head: "中島 喜久夫",
        description: "",
        contact: "",
      },
      {
        id: 20,
        name: "監事",
        head: "安岡 輝雄",
        description: "",
        contact: "",
      },
    ],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Team() {
  return (
    <div className="mx-auto mt-6 max-w-2xl lg:max-w-7xl">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <table className="min-w-full">
            <thead className="lg:bg-white dark:bg-zinc-900 dark:text-gray-100">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                >
                  委員会
                </th>
                <th
                  scope="col"
                  className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3 dark:text-gray-100"
                >
                  委員長
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                >
                  主な業務内容
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 dark:text-gray-100">
              {teams.map((team) => (
                <Fragment key={team.title}>
                  <tr className="border-t border-gray-200 dark:border-gray-800">
                    <th
                      scope="colgroup"
                      colSpan={5}
                      className="bg-gray-50 py-2 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3 dark:bg-zinc-950 dark:text-gray-100"
                    >
                      {team.title}
                    </th>
                  </tr>
                  {team.committees.map((committee, committeeIdx) => (
                    <tr
                      key={committee.id}
                      className={classNames(
                        committeeIdx === 0
                          ? "border-gray-300 dark:border-gray-700"
                          : "border-gray-200 dark:border-gray-800",
                        "border-t odd:bg-gray-50 dark:border-gray-950 dark:odd:bg-gray-950"
                      )}
                    >
                      <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-3 dark:text-gray-100">
                        {committee.name}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {committee.head}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {committee.description}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
