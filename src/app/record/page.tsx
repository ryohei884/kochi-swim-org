import RecordTable from "@/components/record/record-table";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";
export default function Page() {
  return (
    <>
      <Header />
      <RecordTable category="prefecture" poolsize="long" sex="men" />
      <Footer />
    </>
  );
}
