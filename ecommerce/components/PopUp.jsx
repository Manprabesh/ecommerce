import { useEffect } from "react";
import { usePopup } from "../context/popUpContext";
import { useNavigate } from "react-router";
const styles = {
  success: "border-green-500 text-green-600",
  error: "border-red-500 text-red-600",
  warning: "border-yellow-500 text-yellow-600",
};

export default function Popup() {
  const navigate=useNavigate()
  const { popup, closePopup,  } = usePopup();
// task()
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") closePopup();
    }

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
 
  }, []);


  if (!popup) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
      <div
        className={`w-full max-w-sm rounded-xl border-l-4 bg-white p-6 shadow-lg ${styles[popup.type]}`}
      >
        <h2 className="text-lg font-semibold capitalize">
          {popup.type}
        </h2>

        <p className="mt-2 text-sm text-gray-700">
          {popup.message}
        </p>

        <div className="mt-4 flex justify-end">
          <button
            onClick={()=>closePopup(false)}
            className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-900"
          >
            Close
          </button>
        </div> 
        <div className="mt-4 flex justify-end">
          <button
            onClick={()=>closePopup(true)}
            className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-900"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
