import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const FormPopupModal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 overflow-y-scroll !m-0"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg mt-[200px] mb-[50px] xl:mt-0 xl:mb-0"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          className="absolute top-4 right-4 text-white text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default FormPopupModal;
