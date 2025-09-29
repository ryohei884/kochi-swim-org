type categoryDisplayType = {
  range: number;
  label: string;
};

export const categoryDisplay: categoryDisplayType[] = [
  { range: 0, label: "未設定" },
  { range: 1, label: "誰にも表示しない" },
  { range: 2, label: "管理者にのみに表示する" },
  { range: 3, label: "承認者にのみ表示する" },
  { range: 4, label: "編集者にのみ表示する" },
  { range: 5, label: "ログイン済みユーザー全員に表示する" },
];
