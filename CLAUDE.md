# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code へのガイドです。

## 言語

- **返答は必ず日本語で行うこと。**
- コード内のコメントも日本語で書く。変数名・関数名などの識別子は英語にする。

## プロジェクト概要

- **プロジェクト名**: quiz-app
- **内容**: 一般常識クイズアプリ
- **技術スタック**: HTML / CSS / JavaScript（フレームワーク・ビルドツールなし）

## ファイル構成

```
quiz-app/
├── index.html    # 画面の骨組み（スタート画面・問題画面・結果画面）
├── style.css     # スタイル
└── script.js     # 問題データとクイズの進行ロジック
```

ファイルは上記の3つに分けて管理する。

## 実行方法

- ビルド不要。`index.html` をブラウザで直接開けば動く。
- 必要であれば簡易サーバーを使う: `python3 -m http.server 8000` → http://localhost:8000

## コーディング方針

### 全般
- 外部ライブラリや CDN は使わず、素の HTML / CSS / JavaScript で書く。
- 初学者でも読めるシンプルなコードを優先する。

### HTML
- セマンティックなタグ（`header`, `main`, `section`, `button` など）を使う。
- `lang="ja"` と `<meta charset="UTF-8">`、viewport の meta タグを入れる。

### CSS
- クラス名はケバブケース（例: `quiz-container`, `answer-button`）。
- 色などは `:root` の CSS 変数にまとめる。
- スマートフォンでも見やすいレスポンシブなレイアウトにする。

### JavaScript
- `const` / `let` を使い、`var` は使わない。
- 変数名・関数名はキャメルケース（例: `currentQuestionIndex`, `showResult`）。
- DOM 操作は `document.querySelector` / `addEventListener` を使い、HTML 内の `onclick` 属性は使わない。
- 問題データは `script.js` の先頭にある `questions` 配列にまとめ、ロジックと混ぜない。

## 問題データの形式

```js
const questions = [
  {
    question: "日本の首都はどこ？",
    choices: ["大阪", "京都", "東京", "名古屋"],
    answer: 2, // 正解の choices のインデックス（0 始まり）
  },
];
```

- 問題は一般常識の範囲（地理・歴史・科学・言葉・時事など）から出題する。
- 正解が事実として正しいことを確認してから追加する。

## 基本機能

- スタート画面 → 問題表示 → 選択肢を選ぶ → 正誤判定 → 次の問題 → 結果（正解数）表示
- 結果画面から最初からやり直せる。

## GitHubリポジトリ

https://github.com/mamiott/practice-quiz.git
