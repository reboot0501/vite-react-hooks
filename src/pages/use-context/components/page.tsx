// src/pages/use-context/components/page.tsx
import Header from "./header";
import Content from "./content";
import Footer from "./footer";

// Header, Content, Footer 콤포넌트를 감싸는 부모 콤포넌트
const Page = () => {
  return (
    <div className="page">
      <Header />
      <Content />
      <Footer />
    </div>
  );
};

export default Page;