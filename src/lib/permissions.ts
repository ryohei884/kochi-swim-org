type categoryPermissionType = {
  range: number;
  label: string;
};

export const categoryPermission: categoryPermissionType[] = [
  { range: 1, label: "全員に表示する" },
  { range: 2, label: "管理者にのみに表示する" },
  { range: 3, label: "特定の役割の人にのみ表示する" },
  { range: 4, label: "誰にも表示しない" },
];
