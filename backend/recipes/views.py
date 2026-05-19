import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google import genai
from google.genai import types
from dotenv import load_dotenv

# 環境変数の読み込みはリクエスト毎に行うように修正

class GenerateRecipeView(APIView):
    def post(self, request):
        # 最新の.envを強制的に読み込み、前後のスペースを削除
        load_dotenv(override=True)
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            api_key = api_key.strip()

        if not api_key or api_key == "your_api_key_here":
            return Response(
                {"error": "Gemini APIキーが設定されていません。バックエンドの.envファイルを確認してください。"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
        # APIクライアントの初期化
        client = genai.Client(api_key=api_key)

        ingredients = request.data.get("ingredients", [])
        allow_extra = request.data.get("allow_extra", False)

        if not ingredients:
            return Response({"error": "食材が入力されていません。"}, status=status.HTTP_400_BAD_REQUEST)

        # プロンプトの構築
        ingredients_str = "、".join(ingredients)
        extra_instruction = ""
        if not allow_extra:
            extra_instruction = "必ず上記の食材のみ（または一般的な調味料のみ）を使用し、追加の食材は極力提案しないでください。"
        else:
            extra_instruction = "上記の食材をメインにしますが、必要であれば少量の追加食材（1〜2品程度）を提案しても構いません。"

        prompt = f"""
あなたはプロの料理研究家です。以下の食材を使って作れる美味しいレシピを提案してください。

【現在の食材】
{ingredients_str}

【条件】
{extra_instruction}
初心者でもわかりやすく、手間がかかりすぎない料理が望ましいです。

【出力形式】
以下のJSON形式のみを出力してください。マークダウンブロック(```json ... ```)は不要です。純粋なJSON文字列のみを返してください。

{{
  "title": "料理名",
  "prep_time": "調理時間の目安（例：15分）",
  "ingredients": [
    {{"name": "食材名", "amount": "分量"}}
  ],
  "instructions": [
    "手順1",
    "手順2"
  ],
  "ai_comment": "料理のポイントや励ましのコメント"
}}
"""

        try:
            # 最新の公式クライアントを使用してレシピを生成
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                ),
            )
            
            # JSON文字列をパースしてディクショナリに変換
            recipe_data = json.loads(response.text)
            
            return Response(recipe_data, status=status.HTTP_200_OK)

        except json.JSONDecodeError:
            # AIが不正なJSONを返した場合のエラーハンドリング
            print("Failed to parse JSON. Raw response:", response.text)
            return Response(
                {"error": "AIが正しい形式でレシピを生成できませんでした。もう一度お試しください。"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            return Response(
                {"error": "レシピの生成中にエラーが発生しました。"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
