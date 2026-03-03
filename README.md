# hakoniwa-pdu-javascript

[日本語](./README.md) | [English](./README.en.md)

`hakoniwa-pdu-javascript` は、箱庭シミュレータの PDU を WebSocket 経由で扱うための JavaScript ライブラリです。

箱庭では、シミュレータ間や外部アプリケーションとの通信を PDU で行います。PDU は ROS IDL をもとにした独自バイナリ形式で表現されます。このライブラリは、その PDU 通信をブラウザや Node.js から扱いやすくするための実装です。

最初の具体例としては、箱庭ドローンシミュレータに接続し、ブラウザから状態を監視したり可視化したりする用途を想定しています。

## このライブラリでできること

- 箱庭シミュレータの PDU を WebSocket 経由で読み書きする
- ブラウザからドローンやセンサ状態を監視する
- Three.js などを使って箱庭シミュレータの状態を可視化する
- RPC 用の PDU を使って外部ツールと連携する

代表的なユースケース:

- Readonly なモニタやビューアをブラウザで作る
- 箱庭ドローンの位置や姿勢を Three.js で描画する
- Scratch などの外部ツールから箱庭シミュレータを操作する

## 想定する構成

このライブラリ単体でシミュレータが動くわけではありません。通常は次のような構成で使います。

1. `hakoniwa-drone-core` などの箱庭シミュレータを起動する
2. `hakoniwa-pdu-bridge-core` の WebSocket ブリッジを起動する
3. このライブラリを使ったブラウザアプリまたは Node.js アプリからブリッジへ接続する

最初に試す構成としては、箱庭ドローンシミュレータを題材にするのが分かりやすいです。

```text
+------------------------+       +-------------------------------+       +-------------------------------+
| hakoniwa-drone-core    | <---> | hakoniwa-pdu-bridge-core      | <---> | Browser / Node.js App         |
| (simulation)           |       | (WebSocket bridge)            |       | (hakoniwa-pdu-javascript)     |
+------------------------+       +-------------------------------+       +-------------------------------+
```

## 最初に試すなら

最初の対象として、次の構成をおすすめします。

- シミュレータ: `hakoniwa-drone-core`
- PDU ブリッジ: `hakoniwa-pdu-bridge-core`
- ブラウザ可視化の参考: `hakoniwa-threejs-drone`
- RPC 連携の参考: `hakoniwa-scratch`

これらの関連リポジトリは README 後半の「関連プロジェクト」にまとめています。

## インストール

npm パッケージとして使う場合:

```bash
npm install hakoniwa-pdu-javascript
```

このリポジトリをローカルで試す場合:

```bash
git clone https://github.com/hakoniwalab/hakoniwa-pdu-javascript.git
cd hakoniwa-pdu-javascript
npm install
```

前提:

- Node.js 18 以上
- npm 9 以上

## 最小接続例

次の例は、WebSocket ブリッジへ接続し、PDU 定義ファイルを読み込んで PDU を扱う最小構成です。

```javascript
import {
  PduManager,
  PduConvertor,
  WebSocketCommunicationService
} from 'hakoniwa-pdu-javascript';

async function main() {
  const manager = new PduManager({ wire_version: 'v2' });
  const transport = new WebSocketCommunicationService('v2');

  // まずは hakoniwa-drone-core 側で使っている PDU 定義ファイルをそのまま使う想定
  await manager.initialize('./drone_pdu_config.json', transport);
  await manager.start_service('ws://127.0.0.1:8080');

  const channelId = manager.get_pdu_channel_id('Drone', 'pos');
  const pduSize = manager.get_pdu_size('Drone', 'pos');
  const convertor = new PduConvertor('', manager.pdu_config);

  console.log('channelId =', channelId);
  console.log('pduSize =', pduSize);

  const raw = manager.read_pdu_raw_data('Drone', 'pos');
  if (raw) {
    const pos = await convertor.convert_binary_to_json('Drone', 'pos', raw);
    console.log(pos);
  }

  await manager.stop_service();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

PDU を構造化データとして読む場合:

```javascript
const raw = manager.read_pdu_raw_data('Drone', 'pos');
if (raw) {
  const convertor = new PduConvertor('', manager.pdu_config);
  const pos = await convertor.convert_binary_to_json('Drone', 'pos', raw);
  console.log(pos);
}
```

PDU を書く場合:

```javascript
const raw = new ArrayBuffer(8);
const view = new DataView(raw);
view.setBigUint64(0, 42n, true);

await manager.flush_pdu_raw_data('Drone', 'motor', raw);
```

箱庭ドローンでは、実際には `pos`、`velocity`、`status`、`motor` などの PDU を扱うことが多くなります。最初は read-only で `pos` や `status` を読むところから始めるのが分かりやすいです。

## PDU 定義ファイルについて

このライブラリは、PDU 定義ファイルを読み込んで `robot / pdu_name / channel_id / pdu_size / type` の対応を解決します。

現時点での実運用上のおすすめは、既存の箱庭ドローンシミュレータで使われている PDU 定義ファイルをそのまま使うことです。

補足:

- legacy 形式の PDU 定義ファイルを読み込めます
- compact 形式の PDU 定義ファイルも読み込めます
- compact 形式では `pdudef.json` から `pdutypes.json` を参照します

運用方針:

- 既存の legacy 形式の PDU 定義ファイルも引き続き利用できます
- 新しく PDU 定義ファイルを管理する場合は compact 形式を推奨します
- ただし、現時点で最も簡単な導入方法は、既存の箱庭ドローン用 legacy 定義ファイルをそのまま使う方法です

ただし、独自の PDU 定義ファイルをどう設計・作成するかについては、この README では扱いません。まずは既存のドローン用定義ファイルを利用してください。

## 関連プロジェクト

- 箱庭ドローンシミュレータ: https://github.com/toppers/hakoniwa-drone-core
- WebSocket ベースの PDU ブリッジ: https://github.com/hakoniwalab/hakoniwa-pdu-bridge-core
- Three.js によるドローン可視化例: https://github.com/hakoniwalab/hakoniwa-threejs-drone
- Scratch 連携の例: https://github.com/hakoniwalab/hakoniwa-scratch

使い分けの目安:

- 状態監視や描画をしたい場合は `hakoniwa-threejs-drone`
- 外部ツール連携や操作系を試したい場合は `hakoniwa-scratch`

## テスト

このリポジトリはライブラリなので、主に単体テストと通信テストで動作確認しています。

```bash
npm test
```

テストでは主に次を確認しています。

- PDU 定義ファイルの読み込み
- legacy / compact 両形式の互換性
- `PduManager` の初期化
- WebSocket を使った送受信

## API 概要

通常は `PduManager` を入口として使います。

主要クラス:

- `PduManager`
  - PDU 定義ファイルの読み込み
  - 通信サービスの初期化
  - PDU の read / write
- `WebSocketCommunicationService`
  - WebSocket ブリッジへの接続
- `PduConvertor`
  - バイナリ PDU と JavaScript オブジェクトの変換
- `RemotePduServiceClientManager` / `RemotePduServiceServerManager`
  - RPC 用の補助

基本的な流れ:

1. `PduManager.initialize()` で PDU 定義ファイルを読み込む
2. `start_service()` で WebSocket ブリッジへ接続する
3. `get_pdu_channel_id()` や `get_pdu_size()` でメタ情報を参照する
4. `read_pdu_raw_data()` または `flush_pdu_raw_data()` で通信する

## ライセンス

MIT License
