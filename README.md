# AI Chatbot với Google Gemini API

```text
version: 1.0
status : Draft → To be Frozen
Date : 29/01/2026
```
# 日本語

## 1. プロジェクト概要

チャットボットは、従来の手段に比べて、ユーザーが情報やサービスへ迅速・直感的・便利にアクセスできる重要なインタラクションチャネルとなっています。

本プロジェクト AI Chatbot with Google Gemini API は、Webサイトに組み込み可能な チャットボットウィジェット（embedded widget） を構築することを目的とし、以下を実現します。

- ユーザーが質問を入力し、AIから即時に回答を得られる

- Webサイト上でのユーザーエンゲージメントおよび滞在時間の向上

- コンテンツ案内、サービス相談、簡易的なエンターテインメントの提供

本アプリケーションは HTML / CSS / JavaScript により開発され、Google Gemini API（Free Tier） を統合し、以下の機能をサポートします。

- テキストチャット

- 画像アップロード（Vision）

- 絵文字ピッカー
Desktop / Mobile 両対応のレスポンシブUI

## 2. 想定ユーザー
### エンドユーザー（End User）

- 一般ユーザー
- 学生
- オフィスワーカー

### 利用シーン

- Web / Mobile ブラウザからWebサイトにアクセス

- AIとのクイックなQ&Aを通じて：

  - サービス内容の確認
  - 一般的な情報検索
  - ユーザー体験およびインタラクションの向上
## 3. 主な機能
### 3.1 AIとのテキストチャット

- ユーザーが質問を入力すると、Google Gemini により回答が生成される
- 会話は User / Bot のバブル形式 で表示される

### 3.2 ポップアップ型チャットボットウィジェット

- 画面右下に表示される 開閉ボタン（Toggler）
- ポップアップ構成：
  - Header（チャットボットタイトル）
  - Body（会話履歴）
  - Footer（入力欄・操作ボタン）

### 3.3 画像アップロード（Vision）

- ユーザーは以下が可能：
  - デバイスから画像を添付
  - 送信前に画像プレビューを確認
  - 選択した画像をキャンセル
- 画像はプロンプトと共に送信され、AIが画像内容を解析して回答する

### 3.4 絵文字ピッカー

- 絵文字パネルから絵文字を選択
- 選択した絵文字は カーソル位置 に正しく挿入される

### 3.5 Thinking Indicator

- Iの応答待ち中、「思考中（thinking）」状態を表示
- 応答取得またはエラー発生時に自動で消去される

### 3.6 レスポンシブUI

- Desktop：固定サイズのポップアップ表示
- Mobile：全画面表示（入力欄が隠れない設計）

## 4. 業務ルール・ロジック（Business Rules）

- BR-01：入力が空（テキストなし・画像なし）の場合、送信しない

- BR-02：画像送信時：
  - image/* のみ許可
  - API送信前に base64 エンコードを行う

- BR-03：1回の送信につき、必ず
  - 1 user-message
  - 1 bot-messageを生成する

- BR-04：Thinking indicator は以下の場合に必ず削除される
  - AI応答を取得した場合
  - APIエラーが発生した場合

- BR-05：メッセージ送信後、画像アップロード状態をリセットする

## 5. 技術仕様
### 5.1 フロントエンド

- HTML5
- CSS3（レスポンシブ、アニメーション）
- JavaScript（Vanilla JS）

### 5.2 AI / API
- Google Gemini API（gemini-1.5-flash）

- リクエスト構成：
  - テキストプロンプト
  - 画像（base64 + mimeType）

### 5.3 推奨アーキテクチャ
- デモ環境
  - フロントエンドから直接 Gemini API を呼び出し（ローカル用途のみ）

- 本番環境
  - Frontend → Backend Proxy（Node.js / Serverless）
  - Backend 側で API Key を管理し、Gemini API を呼び出す

### 5.4 非機能要件

- 本番環境では API Key をフロントエンドに露出させない

- 目標レスポンスタイム：通常ネットワーク環境で 5秒以内

- 対応ブラウザ：

  - Desktop：Chrome / Edge
  - Mobile：Safari iOS / Chrome Android

## 6. 対象外（Out of Scope）

- チャットボットユーザーのログイン／管理
- サーバー側でのチャット履歴保存
- ストリーミングレスポンス（文字逐次表示）
- 管理ダッシュボード
- 高度なモデレーション／コンテンツフィルタ
- 多言語自動判定（デフォルト設定外）

## 7. プロジェクトドキュメント構成

本プロジェクトは 高いトレーサビリティ を持つドキュメント体系で管理されます。

- 目的（Goal）
  - Client Requirements → System Requirements

- ロジック定義
  - Business Rules → Use Case Specification

- 検証（Validation）
  - Validation Specification → Test Case Specification

# TIẾNG VIỆT
## 1. Giới thiệu dự án
Chatbot đang trở thành một kênh tương tác quan trọng giúp người dùng tiếp cận thông tin và dịch vụ nhanh chóng, trực quan và thuận tiện hơn so với các hình thức truyền thống.

Dự án AI Chatbot với Google Gemini API nhằm xây dựng một chatbot nhúng (embedded widget) trên website, cho phép:

- Người dùng đặt câu hỏi và nhận phản hồi tức thời từ AI.
- Tăng mức độ tương tác và thời gian ở lại trang.
- Hỗ trợ nội dung, tư vấn dịch vụ, hoặc giải trí cơ bản.

Ứng dụng được phát triển bằng HTML, CSS, JavaScript, tích hợp Google Gemini API (free tier), hỗ trợ:

- Chat văn bản
- Upload ảnh (Vision)
- Emoji picker
- Giao diện responsive cho Desktop & Mobile

## 2. Đối tượng sử dụng
- Người dùng cuối (End User)
  - Người dùng phổ thông
  - Học sinh / sinh viên
  - Nhân viên văn phòng

- Ngữ cảnh sử dụng
  - Truy cập website trên Web hoặc Mobile
  - Thực hiện hỏi–đáp nhanh với AI để:
    - Tìm hiểu dịch vụ
    - Hỏi thông tin tổng quát
    - Tăng tính tương tác, trải nghiệm người dùng
  
## 3. Các tính năng chính
### 3.1 Chat văn bản với AI

- Người dùng nhập câu hỏi → chatbot trả lời bằng Google Gemini.
- Hiển thị hội thoại dạng bubble (User / Bot).

### 3.2 Widget chatbot dạng popup

- Nút mở/đóng (toggler) ở góc phải dưới màn hình.
- Popup gồm:
  - Header (tiêu đề chatbot)
  - Body (lịch sử hội thoại)
  - Footer (ô nhập + control)

### 3.3 Upload ảnh (Vision)

- Người dùng có thể:
  - Đính kèm ảnh từ thiết bị
  - Xem preview ảnh trước khi gửi
  - Hủy ảnh đã chọn
- Ảnh được gửi kèm prompt để AI phân tích nội dung ảnh.

### 3.4 Emoji picker

- Chọn emoji từ bảng emoji.
- Emoji được chèn đúng vị trí con trỏ trong textarea.

### 3.5 Thinking indicator

- Khi chờ phản hồi từ AI, chatbot hiển thị trạng thái “đang suy nghĩ”.
- Trạng thái này tự động biến mất khi có kết quả hoặc lỗi.

### 3.6 Responsive UI

- Desktop: popup kích thước cố định.
- Mobile: chatbot hiển thị full màn hình, không che nội dung nhập.
## 4. Quy tắc nghiệp vụ & Logic tính toán (Business Rules)
- BR-01: Không gửi tin nhắn khi input rỗng (không text và không ảnh).

- BR-02: Khi gửi ảnh:
  - Ảnh phải là image/*
  - Dữ liệu ảnh được encode base64 trước khi gửi API.

- BR-03: Mỗi lần gửi tạo đúng 1 user-message và 1 bot-message.

- BR-04: Thinking indicator phải được xóa khi:
  - Có phản hồi AI
  - Hoặc xảy ra lỗi API.

- BR-05: Sau khi gửi tin nhắn, trạng thái upload ảnh phải được reset.

## 5. Đặc tính kỹ thuật
### 5.1 Frontend

- HTML5
- CSS3 (responsive, animation)
- JavaScript (Vanilla JS)

### 5.2 AI / API

- Google Gemini API (gemini-1.5-flash)
- Gửi request theo schema:
  - Text prompt
  - Ảnh (base64 + mimeType)

### 5.3 Kiến trúc khuyến nghị

- Demo: Frontend gọi trực tiếp Gemini API (chỉ dùng local).
- Triển khai thực tế:
  - Frontend → Backend proxy (Node.js / Serverless)
  - Backend giữ API Key, gọi Gemini API.

### 5.4 Phi chức năng

- Không để lộ API Key trên môi trường production.
- Thời gian phản hồi mục tiêu: < 5 giây (mạng bình thường).
- Tương thích:
  - Chrome / Edge (desktop)
  - Safari iOS / Chrome Android (mobile)

## 6. Phạm vi ngoài (Out of Scope)

- Đăng nhập / quản lý người dùng chatbot
- Lưu lịch sử chat trên server
- Streaming token (hiển thị chữ chạy)
- Dashboard quản trị
- Moderation, filter nội dung nâng cao
- Multi-language auto-detect (ngoài cấu hình mặc định)

## 7. Cấu trúc tài liệu dự án
Dự án được quản lý chặt chẽ thông qua hệ thống tài liệu có tính truy vết cao (Traceability):
- Mục đích (Goal): Client Requirements → System Requirements.
- Logic: Business Rules → Use Case Specification.
- Xác thực (Validation): Validation Specification → Test Case Specification.

### Ý nghĩa từng loại tài liệu:
- Tài liệu Client Requirements và System Requirements là quan trọng nhất để làm rõ yêu cầu khách hàng và chuyển giao cho team phát triển.
- Tài liệu Business Rules và Use Case Specification giúp định nghĩa chi tiết các quy tắc nghiệp vụ và kịch bản sử dụng.
- Tài liệu Validation Specification và Test Case Specification đảm bảo hệ thống được kiểm thử đầy đủ theo yêu cầu đã định nghĩa.

### Vai trò BrSE - Các tài liệu phụ trách:
- Các tài liệu BrSE phụ trách soạn thảo và duy trì bao gồm:
  - Client Requirements
  - System Requirements
  - Business Rules
  - Use Case Specification 
  
## 8. Tổ chức cây thư mục
```text
/ ai-chatbot-gemini
  / docs
    / requirements
      - client_requirements_v1.0.md
      - system_requirements_v1.0.md
    / design
      - business_rule_v1.0.md
      - usecase_spec_v1.0.md
      - validation_spec_v1.0.md
      - testcase_spec_v1.0.md
      - sc-01.png
  / src
    / components
    / styles
    - index.html
    - app.js
    - styles.css
  / tests
    - unit_tests.js
    - integration_tests.js
  - README.md
  - .gitignore
```