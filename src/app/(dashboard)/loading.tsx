import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="h-[calc(100vh-200px)] w-full flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse" />
        <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
      </div>
      <p className="text-muted-foreground animate-pulse font-medium tracking-tight">
        Loading workspace...
      </p>
    </div>
  );
}
