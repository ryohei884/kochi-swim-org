import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const newsLinkCategory = [
  { id: 1, name: "お知らせ", href: "news" },
  { id: 2, name: "競技会情報", href: "meet" },
  { id: 3, name: "ライブ配信", href: "live" },
  { id: 4, name: "県記録", href: "record" },
  { id: 5, name: "講習会情報", href: "seminar" },
  { id: 6, name: "スポンサー募集", href: "sponsor" },
  { id: 7, name: "競技役員募集", href: "official" },
  { id: 8, name: "指導者募集", href: "coach" },
  { id: 9, name: "クラブ員募集", href: "club" },
  { id: 10, name: "連盟情報", href: "federation" },
  { id: 11, name: "ご挨拶", href: "greetings" },
  { id: 12, name: "法人概要", href: "overview" },
  { id: 13, name: "利用規約", href: "terms_of_service" },
  { id: 14, name: "プライバシー・ポリシー", href: "privacy_policy" },
  { id: 15, name: "アンチ・ドーピング", href: "anti_doping" },
  { id: 16, name: "ハラスメント防止", href: "harassment_prevention" },
  { id: 17, name: "お問い合わせ", href: "contact" },
];

export const meetKind = [
  { id: 1, kind: "競泳", href: "swimming" },
  { id: 2, kind: "飛込", href: "diving" },
  { id: 3, kind: "水球", href: "waterpolo" },
  { id: 4, kind: "AS", href: "as" },
  { id: 5, kind: "OW", href: "ow" },
];

export const poolSize = [
  { id: 0, size: "その他" },
  { id: 1, size: "短水路" },
  { id: 2, size: "長水路" },
  { id: 3, size: "ダイビング・プール" },
];
