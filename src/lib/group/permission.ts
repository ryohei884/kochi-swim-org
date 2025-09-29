type groupDisplayType = {
  range: number;
  label: string;
};

export const groupDisplay: groupDisplayType[] = [
  { range: 0, label: "未設定" },
  { range: 1, label: "閲覧" },
  { range: 2, label: "作成" },
  { range: 3, label: "修正" },
  { range: 4, label: "削除" },
  { range: 5, label: "承認" },
];
