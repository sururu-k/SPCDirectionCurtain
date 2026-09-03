# GitHub Pages 公開手順ガイド (GitHub Pages Deployment)

本リポジトリのWeb指令器＆シミュレーター資産はすべて **[`web/`](file:///Users/hiro/SPCDirectionCurtain/web/) ディレクトリ** に集約・管理されています。
GitHub Actions ワークフロー（[`.github/workflows/deploy-pages.yml`](file:///Users/hiro/SPCDirectionCurtain/.github/workflows/deploy-pages.yml)）により、`web/` ディレクトリ配下が自動的にビルドされ、GitHub Pagesへ直接デプロイされます。

---

## 1. 公開URL

以下のURLでスマホやPCのブラウザから直接アクセスできます：

```text
https://sururu-k.github.io/SPCDirectionCurtain/
```

---

## 2. デプロイの仕組み (GitHub Actions連携)

リポジトリ直下を汚すことなく、Web関連アセット（HTML/CSS/JS/JSON）をすべて `web/` に配置した状態でGitHub Pagesを公開しています。

* **ワークフロー定義**: [`.github/workflows/deploy-pages.yml`](file:///Users/hiro/SPCDirectionCurtain/.github/workflows/deploy-pages.yml)
* **対象ディレクトリ**: `./web`
* **トリガー**: `main` ブランチへのプッシュ時に自動実行

```yaml
- name: Upload artifact from web/
  uses: actions/upload-pages-artifact@v3
  with:
    path: './web'
```

リポジトリにコミット＆プッシュするだけで、GitHub Actionsが自動的に `web/` の最新アセットを取り込んでデプロイします。

---

## 3. 実機なしで遊べる機能（完全ブラウザモック）

公開URLにアクセスするだけで、以下の機能が即座に動作します：

* 🚉 **駅LED発車標 ＆ 車両方向幕の完全連動**:
  * 名鉄駅ホームの2段LED発車標の列車をクリックすると、方向幕がリアルタイムに回転。
* 🔊 **実車サウンドシミュレーション**:
  * Web Audio APIにより、デジスイッチのクリック音、AC100Vモーターの回転音、リレー吸着・停止音をリアルタイム合成再生。
* 📜 **リアルな連続幕スクロール回転**:
  * 実車通りに1コマずつ幕が上下にスクロールしながら目的位置で自動停止。
* 🕒 **リアルタイム運行ダイヤ自動連動（名鉄名古屋駅等）**:
  * スイッチをONにすると、現在の時計時刻に合わせて次の発車列車の行先へ自動的に幕が回転。
