"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { reOrder } from "@/lib/news/actions";

interface Props {
  fetchListData: () => Promise<void>;
}

export default function ReOrder(props: Props) {
  const { fetchListData } = props;

  const handleClick = async () => {
    await reOrder();
    toast("表示順を整理しました。", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchListData();
  };

  return (
    <Button variant="outline" onClick={handleClick}>
      表示順を整理する
    </Button>
  );
}
