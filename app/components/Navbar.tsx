import Link from "next/link";
import { ThemeToggle } from "@/app/components/Themetoggle";
import { Button } from "@/components/ui/button";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import UserNav from "@/app/components/UserNav";

export async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className="border-b bg-background h-[10vh] flex items-center justify-center">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <h1 className="text-3xl font-bold">
            Note<span className="text-primary">Saas</span>
          </h1>
        </Link>
        <div className="flex items-center gap-x-4">
          <ThemeToggle />
          {(await isAuthenticated()) ? (
            <UserNav
              user={user?.given_name as string}
              email={user?.email as string}
              imageUrl={user?.picture as string}
            />
          ) : (
            <div className="flex items-center gap-x-5">
              <LoginLink>
                <Button>Sign In</Button>
              </LoginLink>
              <RegisterLink>
                <Button variant="secondary">Sign Up</Button>
              </RegisterLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
