import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus2, Play, Settings } from "lucide-react";
import { Logo } from "@/components/logo";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between p-4">
          <Logo />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Welcome to Your Workflow
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your tasks and processes efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FilePlus2 className="w-6 h-6 text-primary" />
                Create New Task
              </CardTitle>
              <CardDescription>Start a new process or add a task to your workflow.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">New Task</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-6 h-6 text-primary" />
                Run Workflow
              </CardTitle>
              <CardDescription>Execute your predefined workflow sequence.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Run</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-primary" />
                Configure
              </CardTitle>
              <CardDescription>Adjust settings and customize your workflow.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Settings</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="border-t mt-12 py-6 md:px-8 md:py-0 bg-card">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Built with Next.js and Firebase.
          </p>
        </div>
      </footer>
    </div>
  );
}
