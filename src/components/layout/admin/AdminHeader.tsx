import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/auth.service";
import { useRouter } from "next/navigation";
export default function AdminHeader() {
  const router = useRouter();
   const handleLogout = async () => {
    try {
      await logout();

      // redirect after successful logout
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <header
      className="
        h-16
        bg-white
        border-b
        border-[#d9d9d8]
        px-6
        flex
        items-center
        justify-between
        shadow-sm
      "
    >
      <h1 className="font-semibold text-[#40332a]">
        Stone Cafe Dashboard
      </h1>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => router.push("/account")}
            className="
              flex
              items-center
              gap-2
              text-gray-700
              hover:text-[#40332a]
            "
          >
            <User size={18} />
            My Account
          </Button>

        <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="
                    flex
                    items-center
                    gap-2
                    text-gray-700
                    hover:text-[#40332a]
                  "
                >
                  <LogOut size={18} />
                  Logout
                </Button>
      </div>
    </header>
  );
}