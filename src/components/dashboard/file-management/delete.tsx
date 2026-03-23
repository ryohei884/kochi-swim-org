"use client";
import { Button } from "@/components/ui/button";
import { blobFileDelete, blobImageDelete } from "@/lib/file-management/actions";
export default function Delete() {
  const handleClickImages = async () => {
    await blobImageDelete();
  };

  const handleClickFiles = async () => {
    await blobFileDelete();
  };

  return (
    <>
      <p>
        この機能は実装されていますが、サイト管理者（林）だけが使用できるように設定されています。
      </p>
      <Button onClick={handleClickImages}>画像を整理する</Button>
      <Button onClick={handleClickFiles}>ファイルを整理する</Button>
    </>
  );
}
