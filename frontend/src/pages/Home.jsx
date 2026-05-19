import React, { useState } from 'react';
import { generateRecipe } from '../services/api';
import { Plus, Loader2, ChefHat, Clock } from 'lucide-react';

const SUGGESTED_TAGS = ['卵', '玉ねぎ', 'チーズ', '鶏肉', '豚肉', 'キャベツ', '牛乳', '豆腐', 'トマト'];
// ここの表示をランダムでできるように実装（予定）

const Home = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [allowExtra, setAllowExtra] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recipeResult, setRecipeResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAddIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const removeIngredient = (tagToRemove) => {
    setIngredients(ingredients.filter(tag => tag !== tagToRemove));
  };

  const addSuggestedTag = (tag) => {
    if (!ingredients.includes(tag)) {
      setIngredients([...ingredients, tag]);
    }
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      setError('食材を1つ以上入力してください。');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecipeResult(null);

    try {
      const data = await generateRecipe(ingredients, allowExtra);
      setRecipeResult(data);
    } catch (err) {
      const errMsg = err.response?.data?.error || 'エラーが発生しました。バックエンドの起動状態やAPIキーを確認してください。';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <header className="py-2">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ChefHat className="text-primary-500" />
          AIレシピ提案
        </h1>
        <p className="text-sm text-gray-500 mt-1">今ある食材から、ぴったりの料理を作ります。</p>
      </header>

      {/* 食材入力セクション */}
      <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-sm font-bold text-gray-700 mb-3">冷蔵庫にある食材は？</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="例: 卵、ベーコン"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
          <button
            onClick={handleAddIngredient}
            className="bg-primary-500 text-white p-2 rounded-xl hover:bg-primary-600 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* 選択された食材（タグ表示） */}
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {ingredients.map(ing => (
              <span key={ing} className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium border border-primary-100">
                {ing}
                <button onClick={() => removeIngredient(ing)} className="text-primary-400 hover:text-primary-700">
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}

        {/* タグ補助（サジェスト） */}
        <div>
          <p className="text-xs text-gray-400 mb-2">よく使われる食材:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => addSuggestedTag(tag)}
                className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 追加食材許可スイッチ */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
          <input
            type="checkbox"
            id="allowExtra"
            checked={allowExtra}
            onChange={(e) => setAllowExtra(e.target.checked)}
            className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 border-gray-300"
          />
          <label htmlFor="allowExtra" className="text-sm text-gray-600 cursor-pointer">
            少量の追加食材（買い足し）を許可する
          </label>
        </div>
      </section>

      {/* 生成ボタン */}
      <button
        onClick={handleGenerate}
        disabled={isLoading || ingredients.length === 0}
        className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-md"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            AIがレシピを考案中...
          </>
        ) : (
          'AIに提案してもらう ✨'
        )}
      </button>

      {/* エラー表示 */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex flex-col gap-2">
          <span className="font-bold">エラーが発生しました</span>
          <span>{error}</span>
        </div>
      )}

      {/* 生成結果表示（レシピカード） */}
      {recipeResult && (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
          <div className="h-48 bg-gray-200 relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <span className="text-xs bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">料理のイメージ画像</span>
            </div>
            {/* 画像上のグラデーションとタイトル */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-16">
              <h2 className="text-xl font-bold text-white leading-tight">{recipeResult.title}</h2>
              <div className="flex items-center gap-1 text-white/90 text-sm mt-2 font-medium">
                <Clock size={14} />
                <span>目安時間: {recipeResult.prep_time}</span>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-6">
            {/* 材料 */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary-500 rounded-full"></span>
                材料
              </h3>
              <ul className="space-y-2">
                {recipeResult.ingredients.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm text-gray-600 border-b border-gray-50 pb-2">
                    <span>{item.name}</span>
                    <span className="font-semibold text-gray-800">{item.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 作り方 */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary-500 rounded-full"></span>
                作り方
              </h3>
              <ol className="space-y-4">
                {recipeResult.instructions.map((step, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xs mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* AIコメント */}
            <div className="bg-primary-50 p-4 rounded-xl relative mt-2">
              <ChefHat className="absolute top-0 right-0 -mt-2 -mr-2 text-primary-200" size={40} />
              <p className="text-sm text-primary-800 font-medium leading-relaxed relative z-10 pr-4">
                「{recipeResult.ai_comment}」
              </p>
            </div>
          </div>
        </section>
      )}

      {/* おすすめレシピ (MVP用ダミー) */}
      <section className="pt-6 border-t border-gray-100 mt-8 pb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">おすすめレシピ</h2>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm items-center active:scale-[0.98] transition-transform cursor-pointer">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                {item === 1 ? '🍳' : item === 2 ? '🥗' : '🍲'}
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-800">絶品おすすめ料理 {item}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">冷蔵庫の余り物でパパッと作れる、満足感の高い一品です。</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-3 text-sm font-medium text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
          もっと表示
        </button>
      </section>
    </div>
  );
};

export default Home;
