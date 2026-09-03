// ==============================================================================
// 名鉄方向幕 スマート指令器 ＆ 完全ブラウザシミュレーター (GitHub Pages対応)
// ==============================================================================

// 名鉄方向幕 完全コマ対照データベース
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

const MAX_CODE = ROLLSIGN_DATABASE.length - 1;

// システム状態
let currentTens = 0;
let currentOnes = 5;
let currentAddress = 2;
let currentPhysicalPos = 5; // 方向幕の現在物理位置コマ
let targetCommandCode = 5;  // 指令器が出している目標コマ
let isRolling = false;
let rollTimer = null;
let isTimetableAuto = false;
let timetableData = [];
let soundEnabled = true;

// ESP32 WebSocket
let wsSocket = null;
let isConnected = false;

// Web Audio API サウンド合成エンジン
let audioCtx = null;
let motorOsc = null;
let motorGain = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// デジスイッチ操作音 (カチッ)
function playClickSound() {
    if (!soundEnabled) return;
    initAudio();
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.03);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.03);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.03);
    } catch (e) {}
}

// リレー動作音 (カチッ)
function playRelaySound() {
    if (!soundEnabled) return;
    initAudio();
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
}

// モーター回転音 (ウィーーン)
function startMotorSound() {
    if (!soundEnabled) return;
    initAudio();
    try {
        if (motorOsc) return;
        motorOsc = audioCtx.createOscillator();
        motorGain = audioCtx.createGain();
        motorOsc.type = "sawtooth";
        motorOsc.frequency.setValueAtTime(120, audioCtx.currentTime); // 60Hz全波整流 120Hz ハム音
        motorGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        motorOsc.connect(motorGain);
        motorGain.connect(audioCtx.destination);
        motorOsc.start();
    } catch (e) {}
}

function stopMotorSound() {
    if (motorOsc) {
        try {
            motorGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            motorOsc.stop(audioCtx.currentTime + 0.05);
        } catch (e) {}
        motorOsc = null;
        motorGain = null;
    }
}

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
const soundToggleBtn = document.getElementById("soundToggleBtn");

// ページ初期化
document.addEventListener("DOMContentLoaded", () => {
    initQuickGrid();
    loadTimetable();
    startRealtimeClock();
    renderCurtain(currentPhysicalPos);
    updateSwitchDisplay();

    // デジスイッチ操作
    document.getElementById("btnTensUp").addEventListener("click", () => { stepDigit("tens", 1); playClickSound(); });
    document.getElementById("btnTensDown").addEventListener("click", () => { stepDigit("tens", -1); playClickSound(); });
    document.getElementById("btnOnesUp").addEventListener("click", () => { stepDigit("ones", 1); playClickSound(); });
    document.getElementById("btnOnesDown").addEventListener("click", () => { stepDigit("ones", -1); playClickSound(); });

    // 手動1コマ進段/戻しボタン
    document.getElementById("btnStepForward").addEventListener("click", () => {
        playClickSound();
        targetCommandCode = (currentPhysicalPos + 1) % (MAX_CODE + 1);
        syncSwitchFromCode(targetCommandCode);
        sendCommand(currentAddress, targetCommandCode);
    });
    document.getElementById("btnStepBackward").addEventListener("click", () => {
        playClickSound();
        targetCommandCode = (currentPhysicalPos - 1 + (MAX_CODE + 1)) % (MAX_CODE + 1);
        syncSwitchFromCode(targetCommandCode);
        sendCommand(currentAddress, targetCommandCode);
    });

    // 指令送出ボタン
    document.getElementById("btnSend").addEventListener("click", () => {
        playRelaySound();
        targetCommandCode = getSwitchCode();
        sendCommand(currentAddress, targetCommandCode);
    });
    document.getElementById("btnStop").addEventListener("click", () => {
        playRelaySound();
        stopCommand();
    });

    // ダイヤ自動連動スイッチ
    timetableSwitch.addEventListener("change", (e) => {
        isTimetableAuto = e.target.checked;
        if (isTimetableAuto) checkTimetableAndSync();
    });

    // サウンド切替
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener("click", () => {
            soundEnabled = !soundEnabled;
            soundToggleBtn.textContent = soundEnabled ? "🔊 サウンド ON" : "🔇 サウンド OFF";
            if (!soundEnabled) stopMotorSound();
        });
    }

    // ESP32接続ボタン
    document.getElementById("btnConnect").addEventListener("click", connectESP32);
});

function getSwitchCode() {
    return currentTens * 10 + currentOnes;
}

function syncSwitchFromCode(code) {
    currentTens = Math.floor(code / 10);
    currentOnes = code % 10;
    updateSwitchDisplay();
}

function updateSwitchDisplay() {
    digitTensElem.textContent = currentTens;
    digitOnesElem.textContent = currentOnes;
    const code = getSwitchCode();
    currentCodeText.textContent = `SET: ${String(code).padStart(2, '0')} [0x${code.toString(16).toUpperCase().padStart(2, '0')}] | POS: ${String(currentPhysicalPos).padStart(2, '0')}`;
}

function stepDigit(place, delta) {
    if (place === "tens") {
        currentTens = (currentTens + delta + 10) % 10;
    } else {
        currentOnes = (currentOnes + delta + 10) % 10;
    }
    updateSwitchDisplay();
}

// 方向幕ビジュアル描画
function renderCurtain(code) {
    const entry = ROLLSIGN_DATABASE.find(item => item.code === code);
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

    updateSwitchDisplay();

    // グリッドのアクティブ表示更新
    document.querySelectorAll(".dest-btn").forEach(btn => {
        btn.classList.toggle("active", parseInt(btn.dataset.code) === code);
    });
}

// 指令送出
function sendCommand(addr, targetCode) {
    targetCommandCode = targetCode;
    playRelaySound();

    // ESP32接続時: WebSocketで送信
    if (wsSocket && wsSocket.readyState === WebSocket.OPEN) {
        const payload = JSON.stringify({ action: "send", addr: addr, code: targetCode });
        wsSocket.send(payload);
        currentStatusText.textContent = `送信中 (ADDR:${addr} CODE:${targetCode}) ... 実機通信`;
        currentStatusText.style.color = "#FFD54F";
        return;
    }

    // つながっていない時: 完全ブラウザモック（連続スクロール幕回しシミュレータ）動作！
    runMockRollSimulation(targetCode);
}

// リアルな連続幕回し＆アンサーバックシミュレータ
function runMockRollSimulation(target) {
    if (isRolling) clearInterval(rollTimer);
    if (currentPhysicalPos === target) {
        currentStatusText.textContent = `一致停止 (MATCH STOP) [AB停止 完了]`;
        currentStatusText.style.color = "#00E676";
        stopMotorSound();
        return;
    }

    isRolling = true;
    startMotorSound();
    currentStatusText.textContent = `回転中 (送出: ${target}) [アンサーバック受信中...]`;
    currentStatusText.style.color = "#FFD54F";

    // 最短回転方向の決定 (進段 or 戻し)
    const diff = (target - currentPhysicalPos + (MAX_CODE + 1)) % (MAX_CODE + 1);
    const step = (diff <= (MAX_CODE + 1) / 2) ? 1 : -1;

    const curtain = document.getElementById("rollsignCurtain");

    rollTimer = setInterval(() => {
        // 幕スクロール効果
        curtain.style.transform = step > 0 ? "translateY(-8px)" : "translateY(8px)";
        curtain.style.opacity = "0.6";

        setTimeout(() => {
            currentPhysicalPos = (currentPhysicalPos + step + (MAX_CODE + 1)) % (MAX_CODE + 1);
            renderCurtain(currentPhysicalPos);
            curtain.style.transform = "translateY(0)";
            curtain.style.opacity = "1.0";

            // 目標コマに到達したか判定
            if (currentPhysicalPos === target) {
                clearInterval(rollTimer);
                isRolling = false;
                stopMotorSound();
                playRelaySound();
                currentStatusText.textContent = `一致停止 (MATCH STOP) [AB確認完了]`;
                currentStatusText.style.color = "#00E676";
            }
        }, 120);
    }, 280); // 1コマ約0.28秒で次々進段
}

// 指令停止
function stopCommand() {
    if (isRolling) {
        clearInterval(rollTimer);
        isRolling = false;
        stopMotorSound();
    }
    currentStatusText.textContent = `指令停止 (STOPPED) [手動停止]`;
    currentStatusText.style.color = "#FF5252";

    if (wsSocket && wsSocket.readyState === WebSocket.OPEN) {
        wsSocket.send(JSON.stringify({ action: "stop" }));
    }
}

// 行先クイック選択グリッド初期化
function initQuickGrid() {
    destGridElem.innerHTML = "";
    ROLLSIGN_DATABASE.forEach(item => {
        const btn = document.createElement("button");
        btn.className = `dest-btn ${item.code === currentPhysicalPos ? 'active' : ''}`;
        btn.dataset.code = item.code;
        btn.innerHTML = `
            <span class="dest-btn-type" style="background:${item.bg}">${item.type}</span>
            <span class="dest-btn-name">${item.dest}</span>
            <span class="dest-btn-code">${String(item.code).padStart(2, '0')}</span>
        `;
        btn.addEventListener("click", () => {
            playClickSound();
            syncSwitchFromCode(item.code);
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
        console.warn("timetable.json 読込 (フォールバック使用)", e);
    }
}

// ダイヤ連動判定
function checkTimetableAndSync() {
    if (!timetableData || timetableData.length === 0) return;
    const now = new Date();
    const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let nextTrain = timetableData.find(t => t.time >= currentHM);
    if (!nextTrain) nextTrain = timetableData[0]; // 終電後は始発へ

    nextTrainInfoElem.innerHTML = `
        <span class="next-label">次の発車:</span>
        <span class="next-time">${nextTrain.time}</span>
        <span class="next-type" style="background:${nextTrain.type==='特急'?'#C8102E':nextTrain.type==='準急'?'#008542':'#005BAC'}">${nextTrain.type}</span>
        <span class="next-dest">${nextTrain.dest}</span>
    `;

    if (currentPhysicalPos !== nextTrain.code) {
        syncSwitchFromCode(nextTrain.code);
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
                currentPhysicalPos = data.code;
                renderCurtain(currentPhysicalPos);
                currentStatusText.textContent = `一致停止 (MATCH STOP) [実機完了]`;
                currentStatusText.style.color = "#00E676";
            }
        };
        wsSocket.onclose = () => {
            isConnected = false;
            connectionStatusElem.innerHTML = `
                <span class="status-dot disconnected"></span>
                <span class="status-text">ESP32: 未接続 (完全シミュレータモード)</span>
            `;
        };
    } catch (e) {
        console.error("ESP32接続失敗", e);
    }
}
