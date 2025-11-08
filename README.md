# 英単語暗記アプリ

TOEIC500点突破のための英単語暗記アプリです。Next.jsで構築されています。

## 機能

- 50単語×10セット（合計500単語）から学習するセットを選択
- 英単語を順番に表示し、「わかる」「わからない」で回答
- わからない場合は答えを表示し、OKを押すまで確認可能
- 1周終了後、わからなかった単語のみで復習モードに自動移行
- 全ての単語を覚えたら選択画面に戻る

## 使い方

### セットアップ

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### ビルド

```bash
npm run build
npm start
```

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- React 18
- CSS Modules

## プロジェクト構造

```
EnglishQuiz/
├── app/
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # メインページ
│   ├── globals.css         # グローバルスタイル
│   └── page.module.css     # ページスタイル
├── components/
│   ├── SetSelection.tsx    # 単語セット選択コンポーネント
│   ├── SetSelection.module.css
│   ├── Quiz.tsx            # クイズコンポーネント
│   └── Quiz.module.css
└── data/
    └── words.ts            # 英単語データ（50単語×10セット）
```