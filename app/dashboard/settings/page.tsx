import prisma from "@/app/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import SubmitButtons from "@/app/components/SubmitButtons";
import { revalidatePath } from "next/cache";

/* Get the user data from the database. */
async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      colorScheme: true,
    },
  });
  return data;
}

export default async function SettingsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  /* Update the user data in the database. */
  async function onSubmit(formData: FormData) {
    "use server";

    const name = formData.get("name") as string | undefined;
    const colorScheme = formData.get("color") as string | undefined;

    await prisma.user.update({
      where: {
        id: user?.id as string,
      },
      data: {
        name: name,
        colorScheme: colorScheme,
      },
    });
    /* Revalidate the path to update the color scheme. */
    revalidatePath("/", "layout");
  }

  return (
    <div className="grid items-start gap-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl tracking-tight">Settings</h1>
          <p className="text-lg text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>
      <Card>
        <form action={onSubmit}>
          <CardHeader>
            <CardTitle>General Data</CardTitle>
            <CardDescription>
              Please provide general information about yourself. Please do not
              forget to save after changing anything.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Your Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your Name"
                  defaultValue={data?.name ?? undefined}
                />
              </div>
              <div className="space-y-2">
                <Label>Your Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Your Email"
                  disabled
                  defaultValue={data?.email ?? undefined}
                />
              </div>
              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <Select
                  name="color"
                  defaultValue={data?.colorScheme ?? undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="theme-green">Green</SelectItem>
                      <SelectItem value="theme-blue">Blue</SelectItem>
                      <SelectItem value="theme-violet">Violet</SelectItem>
                      <SelectItem value="theme-yellow">Yellow</SelectItem>
                      <SelectItem value="theme-rose">Rose</SelectItem>
                      <SelectItem value="theme-red">Red</SelectItem>
                      <SelectItem value="theme-orange">Orange</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButtons />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
