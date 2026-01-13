import { redirect } from "next/navigation";
import { auth } from "@/auth";
import TasksPage from "@/components/TasksPage";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return <TasksPage />;
}

