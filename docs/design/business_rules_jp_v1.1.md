# Business Rules（BR

AI Chatbot (Google Gemini API)

```text
Version : 1.1
Status  : FROZEN
Date    : 2026/01/31
Owner   : BrSE Dang
Input   : System Requirements v1.1, Use Case Specification v1.0
```

---

## 1. 目的

本書は、AIチャットボット（Google Gemini API）における**業務ルール（Business Rules）**を定義し、  
BrSE / Dev / QA 間での認識を統一するとともに、設計・実装・テストの判断基準（ベースライン）とすることを目的とする。

---

## 2. 適用範囲

本Business Rulesは、以下のUse Caseに適用される。

- UC-01 チャットボットの開閉
- UC-02 初期メッセージ表示
- UC-03 テキスト質問送信
- UC-04 画像付き質問送信（Vision）
- UC-05 絵文字入力
- UC-06 Thinking Indicator表示
- UC-07 チャット履歴の保存／復元
- UC-08 エラー処理
- UC-09 画像アップロード制限
- UC-10 言語自動判定

---

## 3. 用語定義

- **Message**：チャット画面に表示される1つの会話要素（user-message / bot-message）
- **Chat History**：UI表示およびAIコンテキスト用のメッセージ履歴
- **Thinking Indicator**：AI処理中を示す3点ドット表示の一時的バブル
- **Attachment**：ユーザーが送信する画像ファイル
- **Proxy API**：本番環境でAPIキーを保護するための中継サーバー

---

## 4. Business Rules
業務ルールサマリ

| No. | BR-ID      | 対象           | 概要                       | 適用UC           | トレースSR       |
| --- | ---------- | ------------ | ------------------------ | -------------- | ------------ |
| 1   | BR-UI-01   | UI/状態        | チャットボットの OPEN / CLOSE 状態 | UC-01          | SR-01, SR-02 |
| 2   | BR-UI-02   | UI/状態        | 自動スクロール                  | UC-03,04,06,08 | SR-02        |
| 3   | BR-UI-03   | UI/状態        | 1リクエスト＝1ボットレスポンス         | UC-03,04,06,08 | SR-04,10,11  |
| 4   | BR-IN-01   | 入力           | 送信条件                     | UC-03,04       | SR-04,07,08  |
| 5   | BR-IN-02   | 入力           | Enter / Shift+Enter 挙動   | UC-03          | SR-04        |
| 6   | BR-IN-03   | 入力           | 送信後の入力リセット               | UC-03,04       | SR-04,05     |
| 7   | BR-FILE-01 | 添付           | 画像フォーマット制限               | UC-09          | SR-13        |
| 8   | BR-FILE-02 | 添付           | 画像サイズ制限                  | UC-09          | SR-13        |
| 9   | BR-FILE-03 | 添付           | 画像プレビュー                  | UC-04          | SR-07        |
| 10  | BR-FILE-04 | 添付           | 画像キャンセル                  | UC-04          | SR-07        |
| 11  | BR-FILE-05 | 添付           | Base64 エンコード             | UC-04          | SR-08        |
| 12  | BR-FILE-06 | 添付           | 送信後の画像リセット               | UC-04          | SR-07,08     |
| 13  | BR-AI-01   | AI           | AI送信内容（parts）            | UC-03,04       | SR-05,08     |
| 14  | BR-AI-02   | AI           | チャット履歴を文脈に使用（FROZEN）     | UC-03,04,07    | SR-05,12     |
| 15  | BR-AI-03   | AI           | 言語自動判定                   | UC-10          | SR-14        |
| 16  | BR-AI-04   | AI           | 表示フォーマット整形               | UC-03,04       | SR-06        |
| 17  | BR-TH-01   | Thinking     | Thinking 表示              | UC-06          | SR-10        |
| 18  | BR-TH-02   | Thinking     | Thinking の終了保証           | UC-06,08       | SR-10,11     |
| 19  | BR-TH-03   | Thinking     | タイムアウト（FROZEN）           | UC-06,08       | SR-10,11     |
| 20  | BR-LS-01   | localStorage | Key / 形式                 | UC-07          | SR-12        |
| 21  | BR-LS-02   | localStorage | 保存タイミング                  | UC-07          | SR-12        |
| 22  | BR-LS-03   | localStorage | 履歴復元                     | UC-07          | SR-12        |
| 23  | BR-LS-04   | localStorage | 保存容量制限                   | UC-07          | SR-12        |
| 24  | BR-LS-05   | localStorage | 機密情報を保存しない               | UC-07          | NFR-01       |
| 25  | BR-ERR-01  | エラー          | エラー分類                    | UC-08          | SR-11        |
| 26  | BR-ERR-02  | エラー          | エラー時 Thinking 終了         | UC-08          | SR-10,11     |
| 27  | BR-ERR-03  | エラー          | UI 非クラッシュ                | UC-08          | SR-10,11     |


### 4.1 UI / 状態管理ルール

#### BR-UI-01：チャットボットの状態管理
- チャットボットは「OPEN / CLOSED」の2状態を持つ
- トグラーボタン押下で状態を切り替える
- クローズ操作でUI上の履歴は削除されない

**Applies to**：UC-01  
**Trace**：SR-01, SR-02

#### BR-UI-02：自動スクロール
- 新しいメッセージ追加後、必ず最下部へ自動スクロールする

**Applies to**：UC-03, UC-04, UC-06, UC-08  
**Trace**：SR-02

#### BR-UI-03：1リクエスト＝1レスポンス
- 1回の送信につき
  - user-message：1件
  - bot-message：1件
- bot-messageはthinking表示から必ず置換される

**Applies to**：UC-03, UC-04, UC-06, UC-08  
**Trace**：SR-04, SR-10, SR-11

---

### 4.2 入力／送信ルール

#### BR-IN-01：送信条件
- 以下の場合は送信不可
  - テキストなし、画像なし
- 以下はいずれも送信可
  - テキストのみ
  - 画像のみ
  - テキスト＋画像

**Applies to**：UC-03, UC-04  
**Trace**：SR-04, SR-07, SR-08

#### BR-IN-02：Enter / Shift+Enter
- Desktop：
  - Enter：送信
  - Shift+Enter：改行
- Mobile：
  - 送信はボタン操作を優先

**Applies to**：UC-03  
**Trace**：SR-04

#### BR-IN-03：送信後リセット
- 送信成功後：
  - textareaをクリア
  - 高さを初期値に戻す
  - 添付画像はBR-FILE-06に従う

**Applies to**：UC-03, UC-04  
**Trace**：SR-04, SR-05

---

### 4.3 添付ファイル（画像）

#### BR-FILE-01：対応フォーマット
- image/png
- image/jpeg（jpg / jpeg）
- image/webp

**Applies to**：UC-09  
**Trace**：SR-13

#### BR-FILE-02：サイズ制限
- 最大5MB
- 超過時はクライアント側で拒否しAPI呼び出しを行わない

**Applies to**：UC-09  
**Trace**：SR-13

#### BR-FILE-03：プレビュー
- 有効な画像選択時、サムネイル表示を行う

**Applies to**：UC-04  
**Trace**：SR-07

#### BR-FILE-04：キャンセル
- キャンセル時、プレビューと内部データを完全に削除

**Applies to**：UC-04  
**Trace**：SR-07

#### BR-FILE-05：画像エンコード
- Base64形式で送信（data:プレフィックス除外）
- payloadに data / mimeType を含める

**Applies to**：UC-04  
**Trace**：SR-08

#### BR-FILE-06：送信後リセット
- 送信後は必ず添付状態を初期化する

**Applies to**：UC-04  
**Trace**：SR-07, SR-08

---

### 4.4 AIリクエスト／レスポンス

#### BR-AI-01：送信内容
- text → image の順で parts を構成

**Applies to**：UC-03, UC-04  
**Trace**：SR-05, SR-08

#### BR-AI-02：履歴コンテキスト（FROZEN）
- v1では全chatHistoryを送信
- thinking表示は含めない

**Applies to**：UC-03, UC-04, UC-07  
**Trace**：SR-05, SR-12

#### BR-AI-03：言語自動判定
- ユーザー言語に応じてAIが同言語で応答

**Applies to**：UC-10  
**Trace**：SR-14

#### BR-AI-04：表示フォーマット整形
- Markdown簡易除去（例：**bold** → bold）

**Applies to**：UC-03, UC-04  
**Trace**：SR-06

---

### 4.5 Thinking Indicator

#### BR-TH-01：表示
- AIリクエスト中は必ず表示

#### BR-TH-02：終了保証
- 成功・失敗いずれでも必ず消去／置換

#### BR-TH-03：タイムアウト（FROZEN）
- 5秒超過時はエラー表示に切替

**Applies to**：UC-06, UC-08  
**Trace**：SR-10, SR-11

---

### 4.6 localStorage

#### BR-LS-01：キー／形式
- key：chatHistory
- 内容：role / text のみ（base64保存禁止）

#### BR-LS-02：保存タイミング
- user-message追加後
- bot-message追加後

#### BR-LS-03：復元
- 読込失敗時はクリアして初期化

#### BR-LS-04：容量制限（FROZEN）
- 最大50メッセージ
- 超過時は古いものから削除

#### BR-LS-05：機密情報非保存
- APIキー等の機密情報は保存禁止

**Applies to**：UC-07  
**Trace**：SR-12, NFR-01

---

### 4.7 エラー処理

#### BR-ERR-01：エラー分類
- Network / API / Quota / Key / Timeout

#### BR-ERR-02：ユーザー向け表示
- 簡潔・安全な文言

#### BR-ERR-03：UI継続性
- エラー後もチャット継続可能

**Applies to**：UC-08  
**Trace**：SR-10, SR-11

---

## 5. BR ↔ UC ↔ SR 対応表

| BR-ID | Use Case | System Req |
|------|----------|------------|
| BR-UI-01 | UC-01 | SR-01, SR-02 |
| BR-UI-03 | UC-03/04/06/08 | SR-04, SR-10, SR-11 |
| BR-IN-01 | UC-03/04 | SR-04, SR-07, SR-08 |
| BR-FILE-01/02 | UC-09 | SR-13 |
| BR-FILE-05 | UC-04 | SR-08 |
| BR-AI-03 | UC-10 | SR-14 |
| BR-TH-02 | UC-06/08 | SR-10, SR-11 |
| BR-LS-01/03 | UC-07 | SR-12 |
| BR-ERR-03 | UC-08 | SR-10, SR-11 |

---

## 6. Open Points – Resolved
- Chat履歴送信：全件送信
- localStorage方針：50件・base64除外
- Timeout：5秒

---

## 7. Revision History

| Version | Date | Description | Author |
|-------|------|-------------|--------|
| 1.0 | 2026-01-29 | Initial draft | BrSE Dang |
| 1.1 | 2026-01-31 | Rules frozen | BrSE Dang |
