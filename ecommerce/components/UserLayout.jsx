import UserNavbar from "./UserNavbar";

function UserLayout({ children }) {
    console.log("children----->",children)
  return (
    <div className="min-h-screen flex flex-col ">
      <UserNavbar />
      <main className="">
        {children}
      </main>
    </div>  
  );
}

export default UserLayout;
