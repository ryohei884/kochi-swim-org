import { type ClassValue, clsx } from "clsx";
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
  { id: 10, name: "ご挨拶", href: "greetings" },
  { id: 11, name: "法人概要", href: "overview" },
  { id: 12, name: "利用規約", href: "terms_of_service" },
  { id: 13, name: "プライバシー・ポリシー", href: "privacy_policy" },
  { id: 14, name: "アンチ・ドーピング", href: "anti_doping" },
  { id: 15, name: "ハラスメント防止", href: "harassment_prevention" },
  { id: 16, name: "お問い合わせ", href: "contact" },
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

export const recordCategory = [
  { id: 0, herf: "null", label: "その他" },
  { id: 1, herf: "prefecture", label: "県" },
  { id: 2, herf: "high", label: "高校" },
  { id: 3, herf: "junior_high", label: "中学" },
  { id: 4, herf: "elementary", label: "学童" },
];

export const recordPoolsize = [
  { id: 0, label: "その他", herf: "null" },
  { id: 1, label: "長水路", herf: "long" },
  { id: 2, label: "短水路", herf: "short" },
];

export const recordSex = [
  { id: 0, label: "その他", herf: "null" },
  { id: 1, label: "男子", herf: "men" },
  { id: 2, label: "女子", herf: "women" },
  { id: 3, label: "混合", herf: "mixed" },
];

export const recordStyle = [
  { id: 0, label: "その他", herf: "null" },
  { id: 1, label: "自由形", herf: "free" },
  { id: 2, label: "背泳ぎ", herf: "back" },
  { id: 3, label: "平泳ぎ", herf: "breast" },
  { id: 4, label: "バタフライ", herf: "butterfly" },
  { id: 5, label: "個人メドレー", herf: "im" },
  { id: 6, label: "フリーリレー", herf: "free_relay" },
  { id: 7, label: "メドレーリレー", herf: "medley_relay" },
];

export const recordDistance = [
  { id: 0, label: "その他", herf: "null" },
  { id: 1, label: "50m", herf: "50m" },
  { id: 2, label: "100m", herf: "100m" },
  { id: 3, label: "200m", herf: "200m" },
  { id: 4, label: "400m", herf: "400m" },
  { id: 5, label: "800m", herf: "800m" },
  { id: 6, label: "1500m", herf: "1500m" },
  { id: 7, label: "4×50m", herf: "4_50m" },
  { id: 8, label: "4×100m", herf: "4_100m" },
  { id: 9, label: "4×200m", herf: "4_200m" },
];

export const intToTime = (time: number) => {
  if (time >= 6000) {
    const min = Math.floor(time / 6000);
    const sec = Math.floor((time - min * 6000) / 100);
    const msec = time - min * 6000 - sec * 100;
    return `${min}:${String(sec).padStart(2, "0")}.${String(msec).padStart(
      2,
      "0",
    )}`;
  } else {
    const sec = Math.floor(time / 100);
    const msec = time - sec * 100;
    return `${sec}.${String(msec).padStart(2, "0")}`;
  }
};

export const timeToInt = (time: number) => {
  if (time >= 10000) {
    const min = Math.floor(time / 10000);
    const sec = time - min * 10000;
    return min * 6000 + sec;
  } else {
    return time;
  }
};

export const copyToClipboard = async (meetId: string) => {
  await global.navigator.clipboard.writeText(meetId);
};

export const pdfCategory = [
  { id: 1, herf: "prefecture", label: "高知県記録" },
  { id: 2, herf: "high", label: "高知県高校記録" },
  { id: 3, herf: "junior_high", label: "高知県中学記録" },
  { id: 4, herf: "elementary", label: "高知県学童記録" },
];

export const pdfPoolsize = [
  { id: 1, label: "長水路", herf: "long" },
  { id: 2, label: "短水路", herf: "short" },
];

export const pdfSex = [
  { id: 1, label: "男子", herf: "men" },
  { id: 2, label: "女子", herf: "women" },
];
