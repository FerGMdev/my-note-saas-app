import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();
  if (await isAuthenticated()) {
    redirect("/dashboard");
  }
  return (
    <section className="flex items-center justify-center bg-background h-[90vh]">
      <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 max-w-7xl md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <span className="w-auto px-6 py-3 rounded-full bg-secondary font-medium text-muted-foreground">
              <span className="text-primary font-medium text-lg">
                Sort your notes easily
              </span>
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Create <span className="text-primary">Notes</span> with ease
            </h1>
            <p className="max-w-xl mx-auto mt-8 lg:text-xl text-muted-foreground">
              Our AI-powered note sorting tool makes it easy to organize your
              notes and keep them in the right order.
            </p>
          </div>

          <div className="flex justify-center max-w-xl mx-auto mt-12">
            <RegisterLink>
              <Button>Sign Up for Free</Button>
            </RegisterLink>
          </div>
        </div>
      </div>
    </section>
  );
}
