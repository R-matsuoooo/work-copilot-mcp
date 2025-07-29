# プロジェクト管理ガイド

このリポジトリでは、GitHub ProjectsとCopilot Agentを使用した自動化されたプロジェクト管理システムを導入しています。

## セットアップ手順

### 1. GitHub Projects の作成

1. GitHub上で新しいプロジェクトを作成します
2. プロジェクトURL: `https://github.com/users/R-matsuoooo/projects/1`
3. カラム設定:
   - **Todo**: 新規タスク・未着手の項目
   - **In Progress**: 作業中の項目
   - **Done**: 完了した項目

### 2. 自動化の設定

#### GitHub Actions ワークフロー
- `.github/workflows/project-automation.yml` が自動的にissueとPRをプロジェクトに追加します
- issue/PRの状態変更時に自動的にプロジェクトボードが更新されます

#### MCP設定
- `.vscode/mcp.json` にプロジェクト管理の設定が含まれています
- Copilot AgentがGitHub APIを通じてプロジェクトを管理します

## 使用方法

### Issue作成
1. 適切なissueテンプレートを選択してください:
   - **タスク・機能要求**: 新機能や改善の提案
   - **バグレポート**: バグや問題の報告

2. テンプレートに従って詳細を記入します

3. issueは自動的にプロジェクトボードに追加されます

### Pull Request作成
1. PRテンプレートに従って変更内容を記述します
2. 関連するissue番号を `Fixes #N` 形式で記載します
3. PRは自動的にプロジェクトボードに追加されます

### 進捗管理
- issueやPRの状態変更は自動的にプロジェクトボードに反映されます
- Copilot Agentが進捗を追跡し、適切な状態に更新します

## プロジェクトボードの構成

| カラム | 説明 | 自動移動条件 |
|--------|------|-------------|
| Todo | 新規作成されたissue/PR | issue/PR作成時 |
| In Progress | 作業中の項目 | PR作成時、issue割り当て時 |
| Done | 完了した項目 | issue/PRクローズ時 |

## Copilot Agent統合

このプロジェクトは以下のCopilot Agent機能を活用しています:

- **自動タスク管理**: issueの作成と状態管理
- **進捗追跡**: プロジェクトボードの自動更新
- **コード生成**: 機能実装の自動化
- **レビュー支援**: PRの内容確認とフィードバック

## トラブルシューティング

### よくある問題
1. **プロジェクトボードに追加されない**
   - GitHub Actionsの権限設定を確認してください
   - プロジェクトURLが正しいか確認してください

2. **自動化が動作しない**
   - `.github/workflows/project-automation.yml` の設定を確認してください
   - GitHub Secretsが正しく設定されているか確認してください

## カスタマイズ

### 新しいissueテンプレートの追加
1. `.github/ISSUE_TEMPLATE/` ディレクトリに新しいマークダウンファイルを追加
2. フロントマターでテンプレートの設定を記述

### ワークフローのカスタマイズ
1. `.github/workflows/project-automation.yml` を編集
2. 必要に応じて新しいステップやジョブを追加

---

このプロジェクト管理システムにより、効率的なタスク管理と進捗の可視化が実現されます。