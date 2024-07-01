import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg w-1/3">
                <div className="flex justify-between items-center p-4 border-b bg-zinc-800">
                    <h3 className="text-xl font-semibold text-gray-300">{title}</h3>
                    <button onClick={onClose} className="text-white hover:text-white">&times;</button>
                </div>
                <div className="p-4">
                    {children}
                </div>
                <div className="flex justify-end p-4 border-t">
                    <button
                        onClick={onClose}
                        className="bg-zinc-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-zinc-800 text-white px-4 py-2 rounded-lg"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
