# SPC方向幕指令器 詳細回路設計書 (Circuit Design Specification)

## 1. 回路概要と全体構成ブロック図

本回路は、名古屋鉄道等の実物方向幕（小糸工業製 **SPC3制御基板** 搭載機）に対し、商用AC100V 60Hz電源と完全に同期した「SPC 60Hz」指令信号を生成・送受信するための高信頼性制御回路です。
先行技術書『SPC 指令で方向幕を動かしたい本』（三河技工 yasai 著、[`md/info.md`](file:///Users/hiro/SPCDirectionCurtain/md/info.md)）を絶対的な設計基準としています。

### 1.1 全体ブロック図

```mermaid
flowchart TD
    subgraph AC_POWER["商用電源入力部 AC100V"]
        AC_IN["AC100V入力 L N E"]
        FUSE["速断ヒューズ 1A"]
        VARISTOR["バリスタ 470V"]
        AC_IN --> FUSE
        FUSE --> VARISTOR
    end

    subgraph TRANSFORMER_RECTIFIER["中点変圧・全波整流部"]
        TRANS["単巻変圧器 NSR-05LN 5VA"]
        RECT_P["正側整流ダイオード D1 D2"]
        RECT_M["負側整流ダイオード D3 D4"]
        RAIL_P["プラス100Vレール 正脈流"]
        RAIL_M["マイナス100Vレール 負脈流"]
        V0_LINE["V0基準線 GND 0V N共通"]
        
        VARISTOR --> TRANS
        TRANS --> RECT_P
        RECT_P --> RAIL_P
        TRANS --> RECT_M
        RECT_M --> RAIL_M
        TRANS --> V0_LINE
    end

    subgraph SWITCHING["信号スイッチング部 送信系"]
        TRIAC_P["正側トライアック BTA16"]
        TRIAC_M["負側トライアック BTA16"]
        SSR_DRV_P["フォトトライアック MOC3041 正"]
        SSR_DRV_M["フォトトライアック MOC3041 負"]
        RELAY["保護リレー R"]
        S_LINE["SPC信号線 S"]

        RAIL_P --> TRIAC_P
        RAIL_M --> TRIAC_M
        TRIAC_P --> RELAY
        TRIAC_M --> RELAY
        RELAY --> S_LINE
    end

    subgraph DETECTOR["ゼロクロスおよびアンサーバック検出部"]
        PC_U0P["正側ゼロクロス検出 U0p"]
        PC_U0M["負側ゼロクロス検出 U0m"]
        PC_SP["S線正側モニタ Sp"]
        PC_SM["アンサーバック検出 Sm"]

        TRANS --> PC_U0P
        TRANS --> PC_U0M
        S_LINE --> PC_SP
        S_LINE --> PC_SM
    end

    subgraph MCU_BLOCK["制御マイコンおよびUI部"]
        MCU["マイコン ESP32またはArduino"]
        SHIFT_REG["シフトレジスタ 74HC165"]
        DIGI_SW["2桁デジスイッチ BCD"]
        LCD["1602 LCD表示器"]
        
        DIGI_SW --> SHIFT_REG
        SHIFT_REG --> MCU
        MCU --> LCD
        MCU -->|正半波トリガ| SSR_DRV_P
        MCU -->|負半波トリガ| SSR_DRV_M
        MCU -->|リレー駆動| RELAY
        SSR_DRV_P --> TRIAC_P
        SSR_DRV_M --> TRIAC_M
        PC_U0P -->|割り込み| MCU
        PC_U0M -->|割り込み| MCU
        PC_SP --> MCU
        PC_SM -->|AB検知| MCU
    end

    subgraph ROLLSIGN["方向幕実機コネクタ"]
        CONN["方向幕コネクタ U V U0 S V0"]
        AC_IN --> CONN
        V0_LINE --> CONN
        RAIL_P --> CONN
        S_LINE --> CONN
    end
```

---

## 2. 電源・中点トランス整流回路（±100V生成部）

### 2.1 変圧動作の理論と結線仕様
実車のSPC制御回路では、AC100Vニュートラル線（`V`）を接地電位 `0V（V0）` と共通にした状態で、`V0` を基準として **正の100V（+100V）** および **負の100V（-100V）** の電圧が必要です。
一般的なダイオードブリッジ整流回路では、ブリッジ内のダイオードによってACのニュートラルが浮いてしまうため、V線接地基準の±100Vを生成できません。
そこで、**単巻変圧器（オートトランス）** を利用して「逆位相のAC100V」を合成し、**中点タップ全波整流回路** を構成します。

#### トランス仕様・選定
* **型式**: 相原電機 **`NSR-05LN`**（単相単巻変圧器 5VA）
* **端子構成**: `0V` - `100V` - `200V`（一次 0-200V, 二次 0-100V）
* **結線**:
  * **`100V` 端子** ── AC100V `V`（ニュートラル / 接地側）に接続（**これを `V0` ＝ 基準0Vとする**）
  * **`0V` 端子** ── AC100V `U`（ホット / 非接地側）に接続
  * **`200V` 端子** ── **逆相100V出力端子**（`100V` 端子に対して電位が完全に180°反転）

### 2.2 電源・中点変圧・全波整流機能ブロック図

```mermaid
flowchart TD
    subgraph AC_INPUT["商用AC100V入力"]
        HOT_U["AC100V L ホット線 U"]
        NEU_V["AC100V N ニュートラル線 V"]
    end

    subgraph TRANS_BLOCK["相原電機 単巻変圧器 NSR-05LN"]
        TERM_0V["0V端子 同相100V"]
        TERM_100V["100V端子 中点0V基準"]
        TERM_200V["200V端子 逆相100V"]
    end

    subgraph RECT_BLOCK["中点両波整流回路 1N4007"]
        D1_D2["正側整流ダイオード D1 D2"]
        D3_D4["負側整流ダイオード D3 D4"]
    end

    subgraph DC_RAILS["出力電源レール"]
        RAIL_POS["プラス100Vレール 正の全波脈流 U0"]
        RAIL_NEG["マイナス100Vレール 負の全波脈流"]
        RAIL_V0["基準0Vレール V0線 ACニュートラル共通"]
    end

    HOT_U --> TERM_0V
    NEU_V --> TERM_100V
    TERM_100V --> RAIL_V0
    TERM_0V --> D1_D2
    TERM_200V --> D1_D2
    TERM_0V --> D3_D4
    TERM_200V --> D3_D4
    D1_D2 --> RAIL_POS
    D3_D4 --> RAIL_NEG
```

* **動作**:
  * U が正の半波のとき：
    * `0V` 端子が正 ──> `D1` が導通して `+100V` レールに正の半波が出力。
    * `200V` 端子は負 ──> `D4` が導通して `-100V` レールに負の半波が出力。
  * U が負の半波のとき：
    * `0V` 端子が負 ──> `D3` が導通して `-100V` レールに負の半波が出力。
    * `200V` 端子は正 ──> `D2` が導通して `+100V` レールに正の半波が出力。
  * これにより、`V0`（0V基準）に対して常に **正の脈流（+100V Peak ≒ +141V）** と **負の脈流（-100V Peak ≒ -141V）** が得られます。
  * 平滑コンデンサは**あえて接続しません**（ゼロクロス同期信号として利用するため、AC周期の脈流波形をそのまま保持します）。

---

## 3. 信号スイッチング部（トライアック・SSR送信回路）

秋月電子の「電力制御用SSRキット」の回路定数をベースに、ゼロクロスフォトトライアックと高耐圧トライアックによるスイッチング回路を2系統（正波用・負波用）構築します。

### 3.1 信号スイッチング部（送信系）機能ブロック図

```mermaid
flowchart LR
    subgraph MCU_OUT["マイコン制御出力"]
        OUT_SPOUT["Spout 正側トリガ信号"]
        OUT_SMOUT["Smout 負側トリガ信号"]
        OUT_R["R リレー制御信号"]
    end

    subgraph ISO_TRIGGER["ゼロクロス絶縁トリガ部"]
        MOC_POS["ゼロクロスフォトトライアック MOC3041 正"]
        MOC_NEG["ゼロクロスフォトトライアック MOC3041 負"]
    end

    subgraph POWER_SWITCH["高圧スイッチング部"]
        POWER_POS["プラス100Vレール"]
        POWER_NEG["マイナス100Vレール"]
        TRIAC_POS["主トライアック BTA16 正側"]
        TRIAC_NEG["主トライアック BTA16 負側"]
        SNUBBER_POS["CRスナバ 47オーム 0.01uF"]
        SNUBBER_NEG["CRスナバ 47オーム 0.01uF"]
    end

    subgraph PROTECTION["保護および出力ライン"]
        RELAY_CONTACT["保護リレー接点 R NO"]
        LINE_S["SPC信号線 S 方向幕へ"]
    end

    OUT_SPOUT --> MOC_POS
    OUT_SMOUT --> MOC_NEG
    POWER_POS --> TRIAC_POS
    POWER_NEG --> TRIAC_NEG
    MOC_POS --> TRIAC_POS
    MOC_NEG --> TRIAC_NEG
    TRIAC_POS --- SNUBBER_POS
    TRIAC_NEG --- SNUBBER_NEG
    TRIAC_POS --> RELAY_CONTACT
    TRIAC_NEG --> RELAY_CONTACT
    OUT_R --> RELAY_CONTACT
    RELAY_CONTACT --> LINE_S
```

### 3.2 フォトトライアック入力ドライブ回路（低圧マイコン側）
* **素子構成**:
  * フォトトライアック: `MOC3041`（ゼロクロス点弧タイプ、LED順方向電圧 V_F ≒ 1.3V、推奨IF ≒ 15mA）
  * 主トライアック: `BTA16-600B`（耐圧600V、16A、絶縁フランジ型）
  * ゲート抵抗: 330Ω 1/2W
  * スナバ回路: 47Ω 2W ＋ 0.01μF 630Vフィルムコンデンサ（直列接続でトライアック両主端子T1-T2間に並列接続）
* **マイコン側ドライブ定数**:
  * 電源 V_CC = 5V（Arduino等）の場合:
    ```text
    R_in = (5.0V - 1.3V) / 15mA = 246Ω  ==>  220Ω (I_F ≒ 16.8mA)
    ```
  * ESP32（3.3V駆動）の場合は、2N7002等の小型N-ch MOSFETを介して5Vラインから吸い込む構成を推奨。

---

## 4. ゼロクロス検出＆アンサーバック検出回路（フォトカプラ絶縁入力部）

商用AC100VおよびS線の高電圧信号を、マイコンが安全に読めるロジックレベル（0V / 3.3V〜5V）にフォトカプラで絶縁変換します。

### 4.1 絶縁検出部（ゼロクロス＆アンサーバック）機能ブロック図

```mermaid
flowchart LR
    subgraph HIGH_VOLTAGE_IN["高電圧入力ライン"]
        SIG_U0["SPC基準線 U0 または U"]
        SIG_S["SPC信号線 S"]
        SIG_V0["基準線 V0 GND 0V"]
    end

    subgraph CURRENT_LIMIT["電流制限・発熱分散抵抗"]
        RES_U0["15kオーム 2W 直列2本 計30kオーム"]
        RES_S["15kオーム 2W 直列2本 計30kオーム"]
    end

    subgraph OPTO_ISOLATION["フォトカプラ完全絶縁部 PC817"]
        PC_U0P["PC817A 正半波検出 逆並列D5"]
        PC_U0M["PC817B 負半波検出 逆並列D6"]
        PC_SM["PC817C AB負パルス検出 逆並列D7"]
        PC_SP["PC817D S線正パルスモニタ 逆並列D8"]
    end

    subgraph MCU_IN["マイコン割り込みおよび入力"]
        IN_U0P["U0p 正半波ゼロクロス割り込み"]
        IN_U0M["U0m 負半波ゼロクロス割り込み"]
        IN_SM["Sm アンサーバック検知入力"]
        IN_SP["Sp 送信モニタ入力"]
    end

    SIG_U0 --> RES_U0
    SIG_S --> RES_S
    RES_U0 --> PC_U0P
    RES_U0 --> PC_U0M
    RES_S --> PC_SM
    RES_S --> PC_SP
    PC_U0P --- SIG_V0
    PC_U0M --- SIG_V0
    PC_SM --- SIG_V0
    PC_SP --- SIG_V0
    PC_U0P -->|プルアップ ActiveLOW| IN_U0P
    PC_U0M -->|プルアップ ActiveLOW| IN_U0M
    PC_SM -->|プルアップ ActiveLOW| IN_SM
    PC_SP -->|プルアップ ActiveLOW| IN_SP
```

* **動作ロジック**:
  * **U0が正のとき**: PC817A がON ──> マイコン入力 **`U0p` は LOW**（`U0m` は HIGH）
  * **U0が負のとき**: PC817B がON ──> マイコン入力 **`U0m` は LOW**（`U0p` は HIGH）
  * **ゼロクロス点付近**: 両方のフォトカプラが消灯 ──> `U0p` / `U0m` が共に HIGH
  * **アンサーバック（Sm）**: 方向幕が目的コマに未到達の時、休止期間（サイクル0〜5）中にS線に負パルスが返送され、PC817CがON ──> マイコン入力 **`Sm` が LOW** にアサートされる。
* **抵抗の定格電力計算**:
  * AC100Vの実効値 100V、合成抵抗 R_total = 30kΩ。
  * 電流 I_rms = 100V / 30kΩ ≒ 3.33mA、ピーク電流 I_peak ≒ 4.7mA（PC817を確実に点灯させるのに十分）。
  * 抵抗全体の消費電力:
    ```text
    P = V^2 / R = 100^2 / 30000 ≒ 0.33W
    ```
  * 安全マージン（半波期間の発熱集中と連続稼働）を考慮し、**15kΩ / 2W 金属酸化皮膜抵抗を2本直列（計30kΩ / 4W定格）**として熱を分散。

---

## 5. マイコン・UI周辺回路設計

### 5.1 マイコンピンアサイン仕様表

| ピン番号 (Arduino Nano例) | ESP32 GPIO例 | 信号名 | 入出力 | 接続先・用途 | 論理 |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **D2** | **GPIO 18** | `U0p` | 入力 (INT) | 正半波ゼロクロス検出 (外部割り込み0) | Active LOW |
| **D3** | **GPIO 19** | `U0m` | 入力 (INT) | 負半波ゼロクロス検出 (外部割り込み1) | Active LOW |
| **D4** | **GPIO 21** | `Spout`| 出力 | 正側トライアックSSRトリガ (MOC3041) | Active HIGH (またはLow) |
| **D5** | **GPIO 22** | `Smout`| 出力 | 負側トライアックSSRトリガ (MOC3041) | Active HIGH (またはLow) |
| **D6** | **GPIO 23** | `Sm` | 入力 | アンサーバック受信入力 (PC817C) | Active LOW |
| **D7** | **GPIO 25** | `Sp` | 入力 | S線正側モニタ入力 (PC817D) | Active LOW |
| **D8** | **GPIO 26** | `R` | 出力 | 送信イネーブル保護リレー駆動 | Active HIGH |
| **D9** | **GPIO 27** | `SHIFT_PL` | 出力 | 74HC165 パラレルロード (/PL) | Active LOW |
| **D10** | **GPIO 14** | `SHIFT_CP` | 出力 | 74HC165 クロックパルス (CP) | 立ち上がり |
| **D11** | **GPIO 12** | `SHIFT_Q7` | 入力 | 74HC165 シリアルデータ入力 (Q7) | デジスイッチ8bit |
| **A0** | **GPIO 34** | `TYPE_SW` | アナログ入力 | 種別切替ロータリースイッチ (抵抗ラダー分圧) | アナログ電圧 (0〜VCC) |
| **A4 / A5** | **GPIO 21/22** | `SDA / SCL` | I2C | 1602 LCD 表示器 (アドレス `0x27` / `0x3F`) | I2Cバス |

### 5.2 操作入力および表示部 機能ブロック図

```mermaid
flowchart LR
    subgraph UI_INPUT["操作パネル部"]
        DIGI_10["10の位 デジスイッチ BCD 4bit"]
        DIGI_01["1の位 デジスイッチ BCD 4bit"]
        ROTARY_TYPE["種別切替ロータリースイッチ 6接点"]
        RES_LADDER["抵抗ラダー分圧ネットワーク"]
    end

    subgraph EXPANDER["信号集約部"]
        SHIFT_IC["シフトレジスタ 74HC165 8bit"]
    end

    subgraph MCU_CORE["制御マイコン ESP32またはArduino"]
        PIN_SPI["GPIO 3本 PL CP Q7"]
        PIN_ADC["アナログ入力ピン A0"]
        PIN_I2C["I2Cバス SDA SCL"]
    end

    subgraph UI_OUTPUT["表示部"]
        LCD_MODULE["1602キャラクタLCD I2Cバックパック"]
    end

    DIGI_10 --> SHIFT_IC
    DIGI_01 --> SHIFT_IC
    ROTARY_TYPE --> RES_LADDER
    RES_LADDER --> PIN_ADC
    SHIFT_IC --> PIN_SPI
    PIN_I2C --> LCD_MODULE
```

* **デジスイッチ入力 (74HC165)**:
  2桁のサムロータリスイッチ（デジスイッチ）のBCD 8bit信号を `74HC165` でシリアル変換し、マイコンピンを3本（PL, CP, Q7）に集約。
* **種別選択 (抵抗ラダー)**:
  ロータリースイッチの各接点に分圧抵抗（2.2kΩ, 4.7kΩ, 10kΩ, 22kΩ等）を配し、アナログピンA0の電圧値で「普通・準急・急行・特急」を瞬時判定。

---

## 6. 実車方向幕コネクタ接続仕様

方向幕本体（および制御基板SPC3）との接続には、実車の配線色・信号定義に完全準拠した結線を行います。

### 6.1 指令器と方向幕実機の配線接続ブロック図

```mermaid
flowchart LR
    subgraph CONTROLLER["自作SPC指令器"]
        TERM_U["端子 U ホット AC100V"]
        TERM_V["端子 V ニュートラル AC100V"]
        TERM_U0["端子 U0 SPC基準プラス100V"]
        TERM_S["端子 S SPC双方向信号線"]
        TERM_V0["端子 V0 SPC基準GND"]
    end

    subgraph CABLE["接続ケーブル 5心ハーネス"]
        W_U["U線 AC100V Hot"]
        W_V["V線 AC100V Neutral"]
        W_U0["U0線 SPC同期電源"]
        W_S["S線 指令およびAB信号"]
        W_V0["V0線 SPC信号GND"]
    end

    subgraph ROLLSIGN_UNIT["方向幕実機 小糸SPC3搭載機"]
        LOAD_MOTOR["幕駆動ACモーター・蛍光灯"]
        SPC_POWER["SPC3制御基板 電源部"]
        SPC_CPU["SPC3マイクロコンピュータ"]
        BARCODE_SEN["バーコード光学センサー"]
    end

    TERM_U --> W_U --> LOAD_MOTOR
    TERM_V --> W_V --> LOAD_MOTOR
    TERM_U0 --> W_U0 --> SPC_POWER
    TERM_S <--> W_S <--> SPC_CPU
    TERM_V0 --> W_V0 --> SPC_POWER
    BARCODE_SEN --> SPC_CPU
    SPC_CPU --> LOAD_MOTOR
```
* ※V と V0 は指令器内部で共通接続 (V0 = Neutral 0V)

---

## 7. 基板レイアウト＆絶縁安全設計指針

1. **高圧・低圧の物理分離（沿面距離）**:
   * AC100V・±100Vの高圧ライン（`U`, `V`, `U0`, `S`, `V0`、トランス、トライアック）と、マイコンの低圧系（5V, 3.3V, GND）の間は、**最低でも 6.0mm 以上の沿面距離（スリット加工推奨）** を設ける。
   * フォトカプラおよびフォトトライアックの直下には配線パターンを通さない。
2. **太いパターン幅と許容電流**:
   * S線およびU0線に流れる信号電流は数mA〜数十mAと微小ですが、モーター電源となる `U`, `V` ラインには巻き取り時に最大 1A 程度の突入電流が流れるため、**パターン幅は 2.0mm 以上（または 0.75sq 以上の高圧耐熱電線）** を使用すること。
3. **金属異物混入・結露対策**:
   * はんだ付け完了後、フラックスをIPA（イソプロピルアルコール）で完全に洗浄し、高圧部には防湿絶縁コーティング剤（ハヤコート等）を塗布して沿面放電を予防する。
4. **ヒューズとバリスタの配置**:
   * ACインレットの直後に速断型ヒューズ（1A）とバリスタを配置し、万一の内部短絡時にも家庭用ブレーカーを落とさずに本機ヒューズのみで遮断できるように設計。

---

## 8. 発展型システム統合ブロック図 v2（System Architecture Version 2）

スマート機能（スマホWi-Fi連携・運行ダイヤ自動連動）を統合した全体システム構成ブロック図です。

```mermaid
flowchart TD
    subgraph CLOUD_CLIENT["ユーザー操作端末・時刻連携"]
        SMARTPHONE["スマートフォン Webブラウザ UI"]
        LOCAL_TIME["実時間時計・名鉄運行ダイヤ情報"]
    end

    subgraph MAIN_UNIT["自作SPC指令器本体 v2"]
        subgraph ESP32_SUB["ESP32制御コア"]
            WIFI_AP["Wi-Fi Webサーバー / WebSocket"]
            ROM_DB["名鉄方向幕コマ対照表 ROM"]
            TIMER_ENG["60Hz 30サイクル同期制御エンジン"]
            AB_LOGIC["アンサーバック自動停止判定"]
        end

        subgraph FRONT_PANEL["物理操作部 実車風パネル"]
            BCD_SW["2桁デジスイッチ 74HC165経由"]
            KIND_SW["種別ロータリースイッチ A0経由"]
            STATUS_LCD["1602 LCD表示器 I2C"]
        end

        subgraph SPC_POWER_STAGE["高圧信号生成・検出回路"]
            XFR_UNIT["単巻変圧器 NSR-05LN"]
            FULL_RECT["中点両波整流 ±100Vレール"]
            TRIAC_SSR["ゼロクロスSSR送信回路 Spout Smout"]
            OPTO_DET["フォトカプラ絶縁検出 U0p U0m Sp Sm"]
        end
    end

    subgraph REAL_ROLLSIGN["実物方向幕 名鉄6500系等"]
        ROLL_BODY["小糸SPC3方向幕本体"]
    end

    SMARTPHONE <-->|Wi-Fi| WIFI_AP
    LOCAL_TIME --> WIFI_AP
    BCD_SW --> ESP32_SUB
    KIND_SW --> ESP32_SUB
    ESP32_SUB --> STATUS_LCD
    ROM_DB --> ESP32_SUB

    TIMER_ENG --> TRIAC_SSR
    XFR_UNIT --> FULL_RECT
    FULL_RECT --> TRIAC_SSR
    OPTO_DET --> AB_LOGIC

    TRIAC_SSR -->|S線 指令パルス| REAL_ROLLSIGN
    REAL_ROLLSIGN -->|AB信号| OPTO_DET
```

---
*設計責任: Google Deepmind Antigravity Pair-Programming Agent*  
*準拠文献: 三河技工 yasai 著『SPC 指令で方向幕を動かしたい本』([`md/info.md`](file:///Users/hiro/SPCDirectionCurtain/md/info.md))*
