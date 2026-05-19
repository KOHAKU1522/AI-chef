import React from 'react';

const Recipes = () => {
  return (
    <div className="p-4 flex flex-col items-center justify-center h-full min-h-[60vh]">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">🍳</span>
      </div>
      <h2 className="text-lg font-bold text-gray-700 mb-2">保存済みレシピ</h2>
      <p className="text-sm text-gray-500 text-center">
        この機能はフェーズ2で実装予定です。<br />
        お楽しみに！
      </p>
    </div>
  );
};

export default Recipes;
