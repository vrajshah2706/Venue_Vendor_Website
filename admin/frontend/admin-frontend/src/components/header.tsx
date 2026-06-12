import { useAppContext } from "@/appContext/AppContext";

export default function Header() {
  const { isSignedIn, signOut } = useAppContext();

  const handleSignOut = (): void => {
    signOut();  //updates context 

    setTimeout(() => {
      window.location.href = "/";
    }, 300);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#FEF9FF] text-[#736CED] border-b border-[#D4C1EC] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* logo/name  */}
        <div className="font-bold text-lg">
          Admin Dashboard
        </div>

        {/* adding sign in / out button  */}
        <nav className="flex items-center gap-4">

          {!isSignedIn ? (
            <a
              href="/"
              className="text-[#736CED] hover:text-[#6259d9] font-medium"
            >
              Sign In
            </a>
          ) : (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-[#736CED] text-white rounded-lg hover:bg-[#6259d9] transition"
            >
              Sign Out
            </button>
          )}

        </nav>
      </div>
    </header>
  );
}