import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { File, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { revalidatePath } from "next/cache";
import { DeleteNoteButton } from "@/app/components/SubmitButtons";

async function getData(userId: string) {
  /* const data = await prisma.note.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  }); */

  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      Notes: true,
      Subscription: {
        select: {
          status: true,
        },
      },
    },
  });

  return data;
}

export default async function Dashboard() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userId = user?.id as string;

  const data = await getData(userId);

  async function deleteNote(formData: FormData) {
    "use server";

    const noteId = formData.get("noteId") as string;

    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });

    revalidatePath("/dashboard");
  }

  return (
    <div className="grid items-start gap-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-4">
          <h1 className="text-3xl md:text-4xl">Your Notes</h1>
          <p className="text-muted-foreground text-lg">
            Here you can manage your notes.
          </p>
        </div>

        {data?.Subscription?.status === "active" ? (
          <Button asChild>
            <Link href="/dashboard/new">Create a new Note</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/dashboard/billing">Upgrade to Pro</Link>
          </Button>
        )}
      </div>

      {data?.Notes.length === 0 ? (
        <div className="flex flex-col min-h-[50vh] items-center justify-center rounded-md border p-8 text-center animate-in fade-in-50">
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-primary/20">
            <File className="h-10 w-10 text-primary" />
          </div>
          <h3 className="mt-6 text-xl font-semibold">No Notes Available</h3>
          <p className="mb-8 mt-2 text-lg text-muted-foreground max-w-sm mx-auto">
            Start by clicking the button to add your first note and capture your
            thoughts!
          </p>

          {data?.Subscription?.status === "active" ? (
            <Button asChild>
              <Link href="/dashboard/new">Create a new Note</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/dashboard/billing">Upgrade to Pro</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data?.Notes.map((note) => (
            <Card
              key={note.id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <h2 className="text-2xl font-semibold text-primary">
                  {note.title}
                </h2>
                <p className="text-muted-foreground">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "full",
                  }).format(new Date(note.createdAt))}
                </p>
              </div>

              <div className=" flex gap-x-4">
                <Link href={`/dashboard/new/${note.id}`}>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <form action={deleteNote}>
                  <input type="hidden" name="noteId" value={note.id} />
                  <DeleteNoteButton />
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
