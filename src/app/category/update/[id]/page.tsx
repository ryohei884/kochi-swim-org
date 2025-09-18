import CategoryUpdateForm from "@/components/category/update-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryUpdateForm id={id} />;
}
