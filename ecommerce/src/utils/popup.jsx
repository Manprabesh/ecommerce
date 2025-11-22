// src/components/Popup.jsx
export default function Popup({ visible, message, onConfirm, onCancel }) {
  if (!visible) return null; // Do not render if not visible

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
