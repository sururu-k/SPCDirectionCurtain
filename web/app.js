// 名鉄方向幕 スマート指令器 JavaScript コントローラー

// 方向幕対照データ
const ROLLSIGN_DATABASE = [
    { code: 0,  type: "回送", dest: "回送", en: "Not in Service", bg: "#333333", fg: "#FFFFFF" },
    { code: 1,  type: "試運転", dest: "試運転", en: "Test Run", bg: "#333333", fg: "#FFFFFF" },
    { code: 2,  type: "団体", dest: "団体", en: "Party", bg: "#C8102E", fg: "#FFFFFF" },
    { code: 3,  type: "普通", dest: "新鵜沼", en: "Shin-Unuma", bg: "#333333", fg: "#FFFFFF" },
    { code: 4,  type: "急行", dest: "新鵜沼", en: "Shin-Unuma", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 5,  type: "急行", dest: "中部国際空港", en: "Central Japan Int'l Airport", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 6,  type: "準急", dest: "中部国際空港", en: "Central Japan Int'l Airport", bg: "#008542", fg: "#FFFFFF" },
    { code: 7,  type: "普通", dest: "中部国際空港", en: "Central Japan Int'l Airport", bg: "#333333", fg: "#FFFFFF" },
    { code: 8,  type: "急行", dest: "名鉄岐阜", en: "Meitetsu Gifu", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 9,  type: "普通", dest: "名鉄岐阜", en: "Meitetsu Gifu", bg: "#333333", fg: "#FFFFFF" },
    { code: 10, type: "特急", dest: "豊橋", en: "Toyohashi", bg: "#C8102E", fg: "#FFFFFF" },
    { code: 11, type: "快急", dest: "豊橋", en: "Toyohashi", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 12, type: "急行", dest: "豊橋", en: "Toyohashi", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 13, type: "準急", dest: "豊橋", en: "Toyohashi", bg: "#008542", fg: "#FFFFFF" },
    { code: 14, type: "普通", dest: "豊橋", en: "Toyohashi", bg: "#333333", fg: "#FFFFFF" },
    { code: 15, type: "急行", dest: "犬山", en: "Inuyama", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 16, type: "普通", dest: "犬山", en: "Inuyama", bg: "#333333", fg: "#FFFFFF" },
    { code: 17, type: "急行", dest: "名鉄名古屋", en: "Meitetsu Nagoya", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 18, type: "普通", dest: "名鉄名古屋", en: "Meitetsu Nagoya", bg: "#333333", fg: "#FFFFFF" },
    { code: 19, type: "特急", dest: "名鉄名古屋", en: "Meitetsu Nagoya", bg: "#C8102E", fg: "#FFFFFF" },
    { code: 20, type: "急行", dest: "内海", en: "Utsumi", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 21, type: "普通", dest: "内海", en: "Utsumi", bg: "#333333", fg: "#FFFFFF" },
    { code: 22, type: "急行", dest: "河和", en: "Kowa", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 23, type: "普通", dest: "河和", en: "Kowa", bg: "#333333", fg: "#FFFFFF" },
    { code: 24, type: "特急", dest: "河和", en: "Kowa", bg: "#C8102E", fg: "#FFFFFF" },
    { code: 25, type: "急行", dest: "吉良吉田", en: "Kira-Yoshida", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 26, type: "普通", dest: "吉良吉田", en: "Kira-Yoshida", bg: "#333333", fg: "#FFFFFF" },
    { code: 27, type: "急行", dest: "西尾", en: "Nishio", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 28, type: "普通", dest: "西尾", en: "Nishio", bg: "#333333", fg: "#FFFFFF" },
    { code: 29, type: "急行", dest: "東岡崎", en: "Higashi-Okazaki", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 30, type: "普通", dest: "東岡崎", en: "Higashi-Okazaki", bg: "#333333", fg: "#FFFFFF" },
    { code: 31, type: "急行", dest: "伊奈", en: "Ina", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 32, type: "普通", dest: "伊奈", en: "Ina", bg: "#333333", fg: "#FFFFFF" },
    { code: 33, type: "急行", dest: "豊川稲荷", en: "Toyokawa-Inari", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 34, type: "普通", dest: "豊川稲荷", en: "Toyokawa-Inari", bg: "#333333", fg: "#FFFFFF" },
    { code: 35, type: "臨時", dest: "臨時", en: "Extra", bg: "#C8102E", fg: "#FFFFFF" }
];

// アプリケーション状態
let currentTens = 0;
let currentOnes = 5;
let currentAddress = 2;
let isTimetableAuto = false;
let timetableData = [];
let wsSocket = null;
let isConnected = false;
let isRolling = false;

// DOM要素
const digitTensElem = document.getElementById("digitTens");
const digitOnesElem = document.getElementById("digitOnes");
const signTypeElem = document.getElementById("signType");
const signDestElem = document.getElementById("signDest");
const signDestEnElem = document.getElementById("signDestEn");
const currentStatusText = document.getElementById("currentStatusText");
const currentCodeText = document.getElementById("currentCodeText");
const realtimeClockElem = document.getElementById("realtimeClock");
const nextTrainInfoElem = document.getElementById("nextTrainInfo");
const timetableSwitch = document.getElementById("timetableAutoSwitch");
const destGridElem = document.getElementById("destGrid");
const connectionStatusElem = document.getElementById("connectionStatus");

// 初期化
document.addEventListener("DOMContentLoaded", () => {
    initQuickGrid();
    loadTimetable();
    startRealtimeClock();
    updateDisplayFromCode(getCode());

    // デジスイッチイベント
    document.getElementById("btnTensUp").addEventListener("click", () => stepDigit("tens", 1));
    document.getElementById("btnTensDown").addEventListener("click", () => stepDigit("tens", -1));
    document.getElementById("btnOnesUp").addEventListener("click", () => stepDigit("ones", 1));
    document.getElementById("btnOnesDown").addEventListener("click", () => stepDigit("ones", -1));

    // 指令送出ボタン
    document.getElementById("btnSend").addEventListener("click", () => sendCommand(currentAddress, getCode()));
    document.getElementById("btnStop").addEventListener("click", stopCommand);

    // ダイヤ自動連動スイッチ
    timetableSwitch.addEventListener("change", (e) => {
        isTimetableAuto = e.target.checked;
        if (isTimetableAuto) checkTimetableAndSync();
    });

    // ESP32接続ボタン
    document.getElementById("btnConnect").addEventListener("click", connectESP32);
});

// コマ番号計算
function getCode() {
    return currentTens * 10 + currentOnes;
}

// デジスイッチ増減
function stepDigit(place, delta) {
    if (place === "tens") {
        currentTens = (currentTens + delta + 10) % 10;
        digitTensElem.textContent = currentTens;
    } else {
        currentOnes = (currentOnes + delta + 10) % 10;
        digitOnesElem.textContent = currentOnes;
    }
    updateDisplayFromCode(getCode());
}

// コードから方向幕プレビューを更新
function updateDisplayFromCode(code) {
    const entry = ROLLSIGN_DATABASE.find(item => item.code === code);
    const curtain = document.getElementById("rollsignCurtain");

    // 回転アニメーション効果
    curtain.style.opacity = "0.3";
    curtain.style.transform = "translateY(-10px)";

    setTimeout(() => {
        if (entry) {
            signTypeElem.textContent = entry.type;
            signTypeElem.style.backgroundColor = entry.bg;
            signTypeElem.style.color = entry.fg;
            signDestElem.textContent = entry.dest;
            signDestEnElem.textContent = entry.en;
        } else {
            signTypeElem.textContent = "未登録";
            signTypeElem.style.backgroundColor = "#555";
            signDestElem.textContent = `コマ番号 ${code}`;
            signDestEnElem.textContent = `Code ${code} Undefined`;
        }

        currentCodeText.textContent = `CMD CODE: ${String(code).padStart(2, '0')} [0x${code.toString(16).toUpperCase().padStart(2, '0')}]`;
        curtain.style.opacity = "1.0";
        curtain.style.transform = "translateY(0)";
    }, 150);

    // クイックグリッドのアクティブ更新
    document.querySelectorAll(".dest-btn").forEach(btn => {
        btn.classList.toggle("active", parseInt(btn.dataset.code) === code);
    });
}

// 指令送出
function sendCommand(addr, code) {
    currentStatusText.textContent = `送信中 (ADDR:${addr} CODE:${code}) ... 幕回転`;
    currentStatusText.style.color = "#FFD54F";
    isRolling = true;

    // ESP32へ送信
    if (wsSocket && wsSocket.readyState === WebSocket.OPEN) {
        const payload = JSON.stringify({ action: "send", addr: addr, code: code });
        wsSocket.send(payload);
    } else {
        // シミュレーション動作 (3秒後に一致停止)
        setTimeout(() => {
            currentStatusText.textContent = `一致停止 (MATCH STOP) [AB確認完了]`;
            currentStatusText.style.color = "#00E676";
            isRolling = false;
        }, 3000);
    }
}

// 指令停止
function stopCommand() {
    currentStatusText.textContent = `指令停止 (STOPPED)`;
    currentStatusText.style.color = "#FF5252";
    isRolling = false;
    if (wsSocket && wsSocket.readyState === WebSocket.OPEN) {
        wsSocket.send(JSON.stringify({ action: "stop" }));
    }
}

// 行先クイック選択グリッド初期化
function initQuickGrid() {
    destGridElem.innerHTML = "";
    ROLLSIGN_DATABASE.forEach(item => {
        const btn = document.createElement("button");
        btn.className = `dest-btn ${item.code === 5 ? 'active' : ''}`;
        btn.dataset.code = item.code;
        btn.innerHTML = `
            <span class="dest-btn-type" style="background:${item.bg}">${item.type}</span>
            <span class="dest-btn-name">${item.dest}</span>
            <span class="dest-btn-code">${String(item.code).padStart(2, '0')}</span>
        `;
        btn.addEventListener("click", () => {
            currentTens = Math.floor(item.code / 10);
            currentOnes = item.code % 10;
            digitTensElem.textContent = currentTens;
            digitOnesElem.textContent = currentOnes;
            updateDisplayFromCode(item.code);
            sendCommand(currentAddress, item.code);
        });
        destGridElem.appendChild(btn);
    });
}

// リアルタイム時計
function startRealtimeClock() {
    setInterval(() => {
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        realtimeClockElem.textContent = timeStr;

        if (isTimetableAuto && now.getSeconds() === 0) {
            checkTimetableAndSync();
        }
    }, 1000);
}

// 時刻表データのロード
async function loadTimetable() {
    try {
        const res = await fetch("timetable.json");
        const data = await res.json();
        timetableData = data.departures;
    } catch (e) {
        console.warn("timetable.json 読込失敗 (ローカルフォールバック)", e);
    }
}

// ダイヤ連動判定
function checkTimetableAndSync() {
    if (!timetableData || timetableData.length === 0) return;
    const now = new Date();
    const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 次に発車する列車を検索
    let nextTrain = timetableData.find(t => t.time >= currentHM);
    if (!nextTrain) nextTrain = timetableData[0]; // 終電後は始発へ

    nextTrainInfoElem.innerHTML = `
        <span class="next-label">次の発車:</span>
        <span class="next-time">${nextTrain.time}</span>
        <span class="next-type" style="background:${nextTrain.type==='特急'?'#C8102E':nextTrain.type==='準急'?'#008542':'#005BAC'}">${nextTrain.type}</span>
        <span class="next-dest">${nextTrain.dest}</span>
    `;

    // コマ番号を自動反映して送出
    if (getCode() !== nextTrain.code) {
        currentTens = Math.floor(nextTrain.code / 10);
        currentOnes = nextTrain.code % 10;
        digitTensElem.textContent = currentTens;
        digitOnesElem.textContent = currentOnes;
        updateDisplayFromCode(nextTrain.code);
        sendCommand(currentAddress, nextTrain.code);
    }
}

// ESP32 WebSocket接続
function connectESP32() {
    const ip = document.getElementById("espIpInput").value.trim();
    if (!ip) return;

    try {
        wsSocket = new WebSocket(`ws://${ip}:81/`);
        wsSocket.onopen = () => {
            isConnected = true;
            connectionStatusElem.innerHTML = `
                <span class="status-dot connected"></span>
                <span class="status-text">ESP32: 接続完了 (${ip})</span>
            `;
        };
        wsSocket.onmessage = (evt) => {
            const data = JSON.parse(evt.data);
            if (data.status === "stopped") {
                currentStatusText.textContent = `一致停止 (MATCH STOP) [AB完了]`;
                currentStatusText.style.color = "#00E676";
            }
        };
        wsSocket.onclose = () => {
            isConnected = false;
            connectionStatusElem.innerHTML = `
                <span class="status-dot disconnected"></span>
                <span class="status-text">ESP32: 切断 (シミュレーションモード)</span>
            `;
        };
    } catch (e) {
        console.error("ESP32接続失敗", e);
    }
}
