import { Loader2 } from "lucide-react";

export default function Loader({ message = "Uploading product..." }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <Loader2 className="h-12 w-12 animate-spin text-blue-400 mb-4" />
      <p className="text-white text-lg font-semibold">{message}</p>
    </div>
  );
}
