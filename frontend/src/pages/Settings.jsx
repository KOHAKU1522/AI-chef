import React from 'react';

const Settings = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-gray-900 mb-6">設定</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">ダークモード</span>
          <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-full">Coming Soon</span>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">アカウント設定</span>
          <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-full">Coming Soon</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
