# GitHub Pages 公開手順ガイド (GitHub Pages Deployment)

本リポジトリのWeb指令器＆シミュレーター（[`web/`](file:///Users/hiro/SPCDirectionCurtain/web/) / [`index.html`](file:///Users/hiro/SPCDirectionCurtain/index.html)）は、GitHub Pagesを利用して**完全無料・サーバー契約不要で世界中にWebアプリとして公開**できます。

---

## 1. 公開URL

GitHub Pagesを有効化すると、以下のURLでスマホやPCのブラウザから直接アクセスできるようになります：

```text
https://sururu-k.github.io/SPCDirectionCurtain/
```

---

## 2. GitHubでの有効化手順（わずか3ステップ）

1. **GitHubリポジトリページを開く**:
   * ブラウザで `https://github.com/sururu-k/SPCDirectionCurtain` にアクセスします。
2. **Settings（設定）を開く**:
   * リポジトリ上部メニューの **「Settings」**（歯車アイコン）をクリックします。
3. **Pages設定を変更する**:
   * 左サイドバーの **「Pages」**（Code and automation 内）をクリックします。
   * **Build and deployment** の設定を以下のように指定します：
     * **Source**: `Deploy from a branch` を選択
     * **Branch**: `main` を選択
     * **Folder**: `/ (root)`（または `/docs`）を選択
   * **「Save」** ボタンをクリックします。

```text
【設定イメージ】
Source: [ Deploy from a branch  ▼ ]
Branch: [ main  ▼ ]  /  [ /(root)  ▼ ]   [ Save ]
```

4. **公開完了**:
   * 約1〜2分待つと、ページ上部に **「Your site is live at https://sururu-k.github.io/SPCDirectionCurtain/」** と表示され、公開が完了します！

---

## 3. 実機なしで遊べる機能（完全ブラウザモック）

公開されたURLをスマートフォンやPCで開くだけで、以下の機能が即座に動作します：

* 🔊 **実車サウンドシミュレーション**:
  * Web Audio APIにより、デジスイッチのクリック音、AC100Vモーターの回転音、リレー吸着・停止音をリアルタイム合成再生。
* 📜 **リアルな連続幕スクロール回転**:
  * 例えば「05: 急行 中部国際空港」から「10: 特急 豊橋」に切り替えると、5 ➔ 6 ➔ 7 ➔ 8 ➔ 9 ➔ 10 と実車通りに1コマずつ幕がスクロールして目的位置で停止。
* 🕒 **リアルタイム運行ダイヤ連動（名鉄名古屋駅）**:
  * スイッチをONにすると、現在の時計時刻に合わせて次の発車列車の行先へ自動的に幕が回転。
* 📡 **ESP32実機連携（任意）**:
  * 画面下の設定欄に自宅のESP32のIPアドレスを入力すれば、実物の方向幕ともWebSocketで完全連動。
