# おばけ3Dビューアー

Three.jsとTailwind CSS v4を使用したインタラクティブな3Dおばけビューアーです。

## 機能

- 👻 リアルな3Dおばけモデル
- 🎮 マウス操作で自由に回転
- ✨ 美しいライティング効果
- 📱 レスポンシブデザイン
- 💨 Tailwind CSS v4で構築されたモダンUI

## デモ

[GitHub Pages でライブデモを見る](https://kazuhiroito0127.github.io/learn_threejs/)

## ローカル開発

### 必要な環境

- Node.js (v18以上)
- npm

### セットアップ

1. リポジトリをクローン
```bash
git clone https://github.com/yourusername/learn_threejs.git
cd learn_threejs
```

2. 依存関係をインストール
```bash
npm install
```

3. 開発サーバーを起動
```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

### ビルド

本番用にビルドするには：
```bash
npm run build
```

### プレビュー

ビルド後のファイルをローカルでプレビュー：
```bash
npm run preview
```

### GitHub Pagesにデプロイ

```bash
npm run deploy
```

## 技術スタック

- **Three.js** - 3Dグラフィックスライブラリ
- **Tailwind CSS v4** - 最新のユーティリティファーストCSSフレームワーク
- **Vite** - 高速ビルドツール
- **ES Modules** - モダンJavaScript

## ファイル構成

```
learn_threejs/
├── src/
│   ├── index.js      # メインアプリケーション
│   └── styles.css    # Tailwind CSS v4スタイル
├── dist/             # ビルド出力
├── index.html        # HTMLテンプレート
├── vite.config.js    # Vite設定
└── package.json      # プロジェクト設定
```

## 操作方法

- **マウス移動**: おばけモデルを回転
- **ホバー効果**: リストアイテムにマウスオーバーで視覚的フィードバック

## Tailwind CSS v4について

このプロジェクトではTailwind CSS v4を使用しています：

- **新しいCSS設定**: `@import "tailwindcss"`で簡単にインポート
- **高速ビルド**: 新しいエンジンによる最適化
- **モダンCSS機能**: カスケードレイヤー、カスタムプロパティなどを活用
- **Viteプラグイン**: `@tailwindcss/vite`でシームレスな統合

## カスタマイズ

スタイルを変更する場合は`src/styles.css`を編集してください：

```css
@import "tailwindcss";

/* カスタムスタイル */
.text-shadow-md {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}
```
