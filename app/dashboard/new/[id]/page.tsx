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
import { revalidatePath } from "next/cache";

async function getData({ userId, noteId }: { userId: string; noteId: string }) {
  const data = await prisma.note.findUnique({
    where: {
      id: noteId,
      userId,
    },
    select: {
      title: true,
      description: true,
      id: true,
    },
  });

  return data;
}

export default async function EditNotePage({
  params,
}: {
  params: { id: string };
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userId = user?.id as string;

  const data = await getData({ userId, noteId: params.id });

  async function postData(formData: FormData) {
    "use server";

    if (!userId) throw new Error("You are not allowed to edit this note");

    const title = formData.get("title");
    const description = formData.get("description");

    if (typeof title !== "string" || typeof description !== "string")
      throw new Error("Invalid form data");

    await prisma.note.update({
      where: {
        id: data?.id,
        userId: user.id,
      },
      data: {
        title,
        description,
      },
    });

    /* Revalidate the dashboard page to update the list of notes */
    revalidatePath("/dashboard");

    /* Redirect to the dashboard page */
    return redirect("/dashboard");
  }

  return (
    <Card>
      <form action={postData}>
        <CardHeader>
          <CardTitle>Edit Note</CardTitle>
          <CardDescription>Edit your note with the form below</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-4">
            <Label>Title</Label>
            <Input
              required
              type="text"
              name="title"
              placeholder="Title for your note"
              defaultValue={data?.title}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Content</Label>
            <Textarea
              required
              name="description"
              placeholder="Write your note here..."
              defaultValue={data?.description}
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
