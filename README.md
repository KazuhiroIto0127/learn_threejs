# Three.js Cube Project

Three.jsを使用してインタラクティブなキューブを表示するプロジェクトです。

## 機能

- 🎮 マウス操作でキューブを回転
- ✨ 自動回転アニメーション
- 📱 レスポンシブデザイン
- 🌟 美しいライティング効果

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
- **Vite** - 高速ビルドツール
- **ES Modules** - モダンJavaScript

## ファイル構成

```
learn_threejs/
├── src/
│   ├── index.js      # メインアプリケーション
│   └── cube.js       # キューブ作成ロジック
├── dist/             # ビルド出力
├── index.html        # HTMLテンプレート
├── vite.config.js    # Vite設定
└── package.json      # プロジェクト設定
```

## 操作方法

- **マウス移動**: キューブを回転
- **自動回転**: 常に少しずつ回転し続けます

## カスタマイズ

`src/cube.js` でキューブの色やマテリアルを変更できます：

```javascript
const material = new THREE.MeshPhongMaterial({ 
    color: 0x00ff88,  // 色を変更
    shininess: 100,   // 光沢を調整
    specular: 0x222222
});
```