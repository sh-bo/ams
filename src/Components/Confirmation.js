import React from 'react';

function Confirmation({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Confirmation</h2>
        <p className="mb-4">Are you sure you want to continue?</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-zinc-300 text-gray px-6 py-1 rounded-lg mr-4"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="bg-zinc-800 text-white px-6 py-1 rounded-lg"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
