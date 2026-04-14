import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-full">
      <Navbar />

      <div className="flex justify-center mt-6 px-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;