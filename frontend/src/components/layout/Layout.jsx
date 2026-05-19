import React from 'react';
import BottomNav from './BottomNav';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* 
        メインコンテンツ領域。
        max-w-md mx-auto でスマホ幅に制限し、中央寄せします。
        pb-20 は下部のBottomNavにコンテンツが隠れないようにするための余白です。
      */}
      <main className="flex-grow w-full max-w-md mx-auto bg-white shadow-sm pb-20 min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
