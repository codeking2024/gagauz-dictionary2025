// components/SuggestModal.jsx
import React from "react";

const SuggestModal = ({ show, onClose, onSubmit, value, setValue }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] flex justify-center items-center z-50">
      <div className="bg-[#1f1f1f] text-white p-6 rounded-lg w-[380px] shadow-lg border border-orange-400">
        <h2 className="text-xl font-bold text-orange-400 mb-2 text-center">
          Предложить перевод
        </h2>
        <p className="text-sm text-gray-300 mb-2 text-center">Ваш перевод</p>
        <textarea
          className="w-full h-28 bg-[#2c2c2c] text-white rounded p-2 resize-none border border-gray-600"
          placeholder="Введите ваш перевод здесь..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={onSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm cursor-pointer"
          >
            Отправить
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm cursor-pointer"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestModal;
