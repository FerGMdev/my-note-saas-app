import SubmitButtons from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
export default async function NewNoteRoute() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  async function onSubmit(formData: FormData) {
    "use server";
    if (!user) {
      throw new Error("No authorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    await prisma.note.create({
      data: {
        userId: user?.id,
        description,
        title,
      },
    });

    return redirect("/dashboard");
  }
  return (
    <Card>
      <form action={onSubmit}>
        <CardHeader>
          <CardTitle>Create a new Note</CardTitle>
          <CardDescription>
            Create a new note with the form below
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-4">
            <Label>Title</Label>
            <Input
              required
              type="text"
              name="title"
              placeholder="Title for your note"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Content</Label>
            <Textarea
              required
              name="description"
              placeholder="Write your note here..."
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" asChild variant="outline">
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <SubmitButtons />
        </CardFooter>
      </form>
    </Card>
  );
}
