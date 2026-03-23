"use server";

import { list } from "@vercel/blob";
import { getAll } from "@vercel/edge-config";

import { getListAdminAll as meetGetListAdminAll } from "@/lib/meet/actions";
import { getListAdminAll as newsGetListAdminAll } from "@/lib/news/actions";
import { getListAdminAll as recordGetListAdminAll } from "@/lib/record/actions";
import { getListAdminAll as seminarGetListAdminAll } from "@/lib/seminar/actions";

function getURL(result: URL[], config: string | object) {
  const res: URL[] = result;
  if (typeof config === "string") {
    if (URL.canParse(config)) {
      res.push(config as unknown as URL);
    }
  } else {
    for (const [key, value] of Object.entries(config)) {
      if (URL.canParse(value)) {
        res.push(value);
      } else {
        if (value) {
          getURL(result, value);
        }
      }
    }
  }
  return res;
}

export async function getAllFiles() {
  // DB上のお知らせ、競技会情報、講習会情報
  const news = await newsGetListAdminAll();
  const meet = await meetGetListAdminAll();
  const seminar = await seminarGetListAdminAll();
  const records = await recordGetListAdminAll();
  // ()は含めていない
  const pattern =
    /https?:\/\/[-_.!~*\'a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g;

  // ニュース本文中
  const newsURL = news.map((item) => {
    const match = item.detail.match(pattern);
    return match ? match.flat(Infinity) : null;
  });

  // 競技会情報
  const meetDetailURL = meet.map((item) => {
    if (item.detail === null) return null;
    const match = item.detail.match(pattern);
    return match ? match.flat(Infinity) : null;
  });

  const meetAttachmentURL = meet.map((item) => {
    if (item.attachment === null) return null;
    const match = item.attachment.match(pattern);
    return match ? match.flat(Infinity) : null;
  });

  const meetDescriptionURL = meet.map((item) => {
    if (item.description === null) return null;
    const match = item.description.match(pattern);
    return match ? match.flat(Infinity) : null;
  });

  // 講習会情報
  const seminarDetailURL = seminar.map((item) => {
    if (item.detail === null) return null;
    const match = item.detail.match(pattern);
    return match ? match.flat(Infinity) : null;
  });

  const seminarAttachmentURL = seminar.map((item) => {
    if (item.attachment === null) return null;
    const match = item.attachment.match(pattern);
    return match ? match.flat(Infinity) : null;
  });

  const seminarDescriptionURL = seminar.map((item) => {
    if (item.description === null) return null;
    const match = item.description.match(pattern);
    return match ? match.flat(Infinity) : null;
  });

  // blob上のファイル
  const { folders, blobs } = await list({
    mode: "folded",
    prefix: "files/",
  });

  // Edge config files
  const configItems = await getAll();
  const configList = JSON.parse(JSON.stringify(configItems));
  const edgeConfigList = getURL([], configList);

  const blobUrl = [blobs.map((b) => b.url)].flat(Infinity).filter((s) => s);
  const result = blobUrl
    .filter((s) => {
      return news.find((n) => n.image == s) ? false : true;
    })
    .filter((s) => {
      return records.find((r) => r.image == s) ? false : true;
    })
    .filter((s) => {
      const list = [newsURL.map((n) => n)].flat(Infinity);
      return list.find((n) => n == s) ? false : true;
    })
    .filter((s) => {
      const list = [meetDetailURL.map((n) => n)].flat(Infinity);
      return list.find((n) => n == s) ? false : true;
    })
    .filter((s) => {
      const list = [meetAttachmentURL.map((n) => n)].flat(Infinity);
      return list.find((n) => n == s) ? false : true;
    })
    .filter((s) => {
      const list = [meetDescriptionURL.map((n) => n)].flat(Infinity);
      return list.find((n) => n == s) ? false : true;
    })
    .filter((s) => {
      const list = [seminarDetailURL.map((n) => n)].flat(Infinity);
      return list.find((n) => n == s) ? false : true;
    })
    .filter((s) => {
      const list = [seminarAttachmentURL.map((n) => n)].flat(Infinity);
      return list.find((n) => n == s) ? false : true;
    })
    .filter((s) => {
      const list = [seminarDescriptionURL.map((n) => n)].flat(Infinity);
      return list.find((n) => n == s) ? false : true;
    })
    .filter((s) => {
      return edgeConfigList.find((e) => e.toString() == s) ? false : true;
    });
  const deleteList = Array.from(new Set(result));
  const blobFiles = Array.from(new Set(blobUrl));
  return { deleteList, blobFiles };
}

export async function blobFileDelete() {
  // 削除候補ファイル
  const { deleteList, blobFiles } = await getAllFiles();

  const results = [];
  for (const url of deleteList) {
    // url && results.push(del(`${url}`));
    results.push(console.log(`${url}`));
  }

  await Promise.all(results);
  console.log(
    `Deleted ${deleteList.length} files out of ${blobFiles.length} files from files/`,
    deleteList,
  );
}

export async function getAllImages() {
  // DB上のお知らせ、競技会情報、講習会情報
  const news = await newsGetListAdminAll();
  const meet = await meetGetListAdminAll();
  const seminar = await seminarGetListAdminAll();
  const records = await recordGetListAdminAll();

  // ()は含めていない
  const pattern =
    /https?:\/\/[-_.!~*\'a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g;

  // ニュース本文中
  const newsURL = news.map((item) => {
    const match = item.detail.match(pattern);
    return match ? match.flat(Infinity) : null;
  });

  // 競技会情報
  const meetDetailURL = meet.map((item) => {
    if (item.detail === null) return null;
    const match = item.detail.match(pattern);
    return match ? match.flat(Infinity) : null;
  });

  const meetAttachmentURL = meet.map((item) => {
    if (item.attachment === null) return null;
    const match = item.attachment.match(pattern);
    return match ? match.flat(Infinity) : null;
  });

  const meetDescriptionURL = meet.map((item) => {
    if (item.description === null) return null;
    const match = item.description.match(pattern);
    return match ? match.flat(Infinity) : null;
  });

  // 講習会情報
  const seminarDetailURL = seminar.map((item) => {
    if (item.detail === null) return null;
    const match = item.detail.match(pattern);
    return match ? match.flat(Infinity) : null;
  });

  const seminarAttachmentURL = seminar.map((item) => {
    if (item.attachment === null) return null;
    const match = item.attachment.match(pattern);
    return match ? match.flat(Infinity) : null;
  });

  const seminarDescriptionURL = seminar.map((item) => {
    if (item.description === null) return null;
    const match = item.description.match(pattern);
    return match ? match.flat(Infinity) : null;
  });

  // blob上のファイル
  const { folders, blobs } = await list({
    mode: "folded",
    prefix: "images/",
  });

  // Edge config files
  const configItems = await getAll();
  const configList = JSON.parse(JSON.stringify(configItems));
  const edgeConfigList = getURL([], configList);

  const blobUrl = [blobs.map((b) => b.url)].flat(Infinity).filter((s) => s);
  const result = blobUrl
    .filter((s) => {
      return news.find((n) => n.image == s) ? false : true;
    })
    .filter((s) => {
      return records.find((r) => r.image == s) ? false : true;
    })
    .filter((s) => {
      const list = [newsURL.map((n) => n)].flat(Infinity);
      return list.find((n) => n == s) ? false : true;
    })
    .filter((s) => {
      const list = [meetDetailURL.map((n) => n)].flat(Infinity);
      return list.find((n) => n == s) ? false : true;
    })
    .filter((s) => {
      const list = [meetAttachmentURL.map((n) => n)].flat(Infinity);
      return list.find((n) => n == s) ? false : true;
    })
    .filter((s) => {
      const list = [meetDescriptionURL.map((n) => n)].flat(Infinity);
      return list.find((n) => n == s) ? false : true;
    })
    .filter((s) => {
      const list = [seminarDetailURL.map((n) => n)].flat(Infinity);
      return list.find((n) => n == s) ? false : true;
    })
    .filter((s) => {
      const list = [seminarAttachmentURL.map((n) => n)].flat(Infinity);
      return list.find((n) => n == s) ? false : true;
    })
    .filter((s) => {
      const list = [seminarDescriptionURL.map((n) => n)].flat(Infinity);
      return list.find((n) => n == s) ? false : true;
    })
    .filter((s) => {
      return edgeConfigList.find((e) => e.toString() == s) ? false : true;
    });
  const deleteList = Array.from(new Set(result));
  const blobFiles = Array.from(new Set(blobUrl));
  return { deleteList, blobFiles };
}

export async function blobImageDelete() {
  const { deleteList, blobFiles } = await getAllImages();

  const results = [];
  for (const url of deleteList) {
    // url && results.push(del(`${url}`));
    results.push(console.log(`${url}`));
  }

  await Promise.all(results);
  console.log(
    `Deleted ${deleteList.length} files out of ${blobFiles.length} files from images/`,
    deleteList,
  );
}
