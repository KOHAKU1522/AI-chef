import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || 'https://ai-chef-ov88.onrender.com/api';
if (API_URL && !API_URL.endsWith('/api') && !API_URL.endsWith('/api/')) {
  // Netlify環境変数の末尾に /api が抜けていた場合の対策
  API_URL = API_URL.replace(/\/$/, '') + '/api';
}

/**
 * Gemini APIを利用してレシピを生成する
 * @param {string[]} ingredients - 食材の配列
 * @param {boolean} allowExtra - 追加食材を許可するかどうか
 * @returns {Promise<Object>} 生成されたレシピ情報
 */
export const generateRecipe = async (ingredients, allowExtra = false) => {
  try {
    const response = await axios.post(`${API_URL}/generate-recipe/`, {
      ingredients,
      allow_extra: allowExtra
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
