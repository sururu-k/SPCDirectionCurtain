// ==============================================================================
// 名鉄LED発車標 ＆ SPC方向幕 Web指令シミュレーター (GitHub Pages対応)
// ==============================================================================

// 名鉄全線（本線・犬山・空港・河和・西尾・津島・尾西・瀬戸線等）完全対照データベース
const ROLLSIGN_DATABASE = [
    { code: 0,  type: "回送", dest: "回送", en: "Not in Service", bg: "#333333", fg: "#FFFFFF", route: "業務" },
    { code: 1,  type: "試運転", dest: "試運転", en: "Test Run", bg: "#333333", fg: "#FFFFFF", route: "業務" },
    { code: 2,  type: "団体", dest: "団体", en: "Party", bg: "#C8102E", fg: "#FFFFFF", route: "業務" },
    { code: 3,  type: "普通", dest: "新羽島", en: "Shin-Hashima", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 4,  type: "普通", dest: "羽島市役所前", en: "Hashima-Shiyakusho-mae", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 5,  type: "急行", dest: "中部国際空港", en: "Central Japan Int'l Airport", bg: "#005BAC", fg: "#FFFFFF", route: "空港線" },
    { code: 6,  type: "準急", dest: "中部国際空港", en: "Central Japan Int'l Airport", bg: "#008542", fg: "#FFFFFF", route: "空港線" },
    { code: 7,  type: "普通", dest: "中部国際空港", en: "Central Japan Int'l Airport", bg: "#333333", fg: "#FFFFFF", route: "空港線" },
    { code: 8,  type: "急行", dest: "名鉄岐阜", en: "Meitetsu Gifu", bg: "#005BAC", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 9,  type: "普通", dest: "名鉄岐阜", en: "Meitetsu Gifu", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 10, type: "特急", dest: "豊橋", en: "Toyohashi", bg: "#C8102E", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 11, type: "快急", dest: "豊橋", en: "Toyohashi", bg: "#005BAC", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 12, type: "急行", dest: "豊橋", en: "Toyohashi", bg: "#005BAC", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 13, type: "準急", dest: "豊橋", en: "Toyohashi", bg: "#008542", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 14, type: "普通", dest: "豊橋", en: "Toyohashi", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 15, type: "急行", dest: "名鉄一宮", en: "Meitetsu Ichinomiya", bg: "#005BAC", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 16, type: "普通", dest: "名鉄一宮", en: "Meitetsu Ichinomiya", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 17, type: "急行", dest: "須ケ口", en: "Sukaguchi", bg: "#005BAC", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 18, type: "普通", dest: "須ケ口", en: "Sukaguchi", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 19, type: "普通", dest: "栄生", en: "Sako", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 20, type: "急行", dest: "名鉄名古屋", en: "Meitetsu Nagoya", bg: "#005BAC", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 21, type: "普通", dest: "名鉄名古屋", en: "Meitetsu Nagoya", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 22, type: "特急", dest: "名鉄名古屋", en: "Meitetsu Nagoya", bg: "#C8102E", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 23, type: "普通", dest: "神宮前", en: "Jingu-mae", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 24, type: "急行", dest: "鳴海", en: "Narumi", bg: "#005BAC", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 25, type: "普通", dest: "鳴海", en: "Narumi", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 26, type: "急行", dest: "豊明", en: "Toyoake", bg: "#005BAC", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 27, type: "普通", dest: "豊明", en: "Toyoake", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 28, type: "急行", dest: "知立", en: "Chiryu", bg: "#005BAC", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 29, type: "普通", dest: "知立", en: "Chiryu", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 30, type: "急行", dest: "新安城", en: "Shin-Anjo", bg: "#005BAC", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 31, type: "普通", dest: "新安城", en: "Shin-Anjo", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 32, type: "急行", dest: "東岡崎", en: "Higashi-Okazaki", bg: "#005BAC", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 33, type: "普通", dest: "東岡崎", en: "Higashi-Okazaki", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 34, type: "普通", dest: "美合", en: "Miai", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 35, type: "普通", dest: "本宿", en: "Motojuku", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 36, type: "急行", dest: "国府", en: "Ko", bg: "#005BAC", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 37, type: "普通", dest: "国府", en: "Ko", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 38, type: "急行", dest: "伊奈", en: "Ina", bg: "#005BAC", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 39, type: "普通", dest: "伊奈", en: "Ina", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 40, type: "急行", dest: "豊川稲荷", en: "Toyokawa-Inari", bg: "#005BAC", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 41, type: "普通", dest: "豊川稲荷", en: "Toyokawa-Inari", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 42, type: "急行", dest: "犬山経由岐阜", en: "Gifu via Inuyama", bg: "#005BAC", fg: "#FFFFFF", route: "犬山線" },
    { code: 43, type: "普通", dest: "三柿野", en: "Mikakino", bg: "#333333", fg: "#FFFFFF", route: "犬山線" },
    { code: 44, type: "急行", dest: "新鵜沼", en: "Shin-Unuma", bg: "#005BAC", fg: "#FFFFFF", route: "犬山線" },
    { code: 45, type: "普通", dest: "新鵜沼", en: "Shin-Unuma", bg: "#333333", fg: "#FFFFFF", route: "犬山線" },
    { code: 46, type: "急行", dest: "犬山", en: "Inuyama", bg: "#005BAC", fg: "#FFFFFF", route: "犬山線" },
    { code: 47, type: "普通", dest: "犬山", en: "Inuyama", bg: "#333333", fg: "#FFFFFF", route: "犬山線" },
    { code: 48, type: "普通", dest: "柏森", en: "Kashiwamori", bg: "#333333", fg: "#FFFFFF", route: "犬山線" },
    { code: 49, type: "急行", dest: "岩倉", en: "Iwakura", bg: "#005BAC", fg: "#FFFFFF", route: "犬山線" },
    { code: 50, type: "普通", dest: "岩倉", en: "Iwakura", bg: "#333333", fg: "#FFFFFF", route: "犬山線" },
    { code: 51, type: "普通", dest: "新可児", en: "Shin-Kani", bg: "#333333", fg: "#FFFFFF", route: "犬山線" },
    { code: 52, type: "普通", dest: "御嵩", en: "Mitake", bg: "#333333", fg: "#FFFFFF", route: "犬山線" },
    { code: 53, type: "急行", dest: "太田川", en: "Otagawa", bg: "#005BAC", fg: "#FFFFFF", route: "空港線" },
    { code: 54, type: "普通", dest: "太田川", en: "Otagawa", bg: "#333333", fg: "#FFFFFF", route: "空港線" },
    { code: 55, type: "普通", dest: "常滑", en: "Tokoname", bg: "#333333", fg: "#FFFFFF", route: "空港線" },
    { code: 56, type: "急行", dest: "知多半田", en: "Chita-Handa", bg: "#005BAC", fg: "#FFFFFF", route: "河和線" },
    { code: 57, type: "普通", dest: "知多半田", en: "Chita-Handa", bg: "#333333", fg: "#FFFFFF", route: "河和線" },
    { code: 58, type: "急行", dest: "河和", en: "Kowa", bg: "#005BAC", fg: "#FFFFFF", route: "河和線" },
    { code: 59, type: "普通", dest: "河和", en: "Kowa", bg: "#333333", fg: "#FFFFFF", route: "河和線" },
    { code: 60, type: "特急", dest: "河和", en: "Kowa", bg: "#C8102E", fg: "#FFFFFF", route: "河和線" },
    { code: 61, type: "急行", dest: "内海", en: "Utsumi", bg: "#005BAC", fg: "#FFFFFF", route: "河和線" },
    { code: 62, type: "普通", dest: "内海", en: "Utsumi", bg: "#333333", fg: "#FFFFFF", route: "河和線" },
    { code: 63, type: "特急", dest: "内海", en: "Utsumi", bg: "#C8102E", fg: "#FFFFFF", route: "河和線" },
    { code: 64, type: "普通", dest: "金山", en: "Kanayama", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 65, type: "急行", dest: "佐屋", en: "Saya", bg: "#005BAC", fg: "#FFFFFF", route: "西尾線" },
    { code: 66, type: "普通", dest: "佐屋", en: "Saya", bg: "#333333", fg: "#FFFFFF", route: "西尾線" },
    { code: 67, type: "普通", dest: "弥富", en: "Yatomi", bg: "#333333", fg: "#FFFFFF", route: "西尾線" },
    { code: 68, type: "普通", dest: "津島", en: "Tsushima", bg: "#333333", fg: "#FFFFFF", route: "西尾線" },
    { code: 69, type: "普通", dest: "森上", en: "Morikami", bg: "#333333", fg: "#FFFFFF", route: "西尾線" },
    { code: 70, type: "普通", dest: "碧南", en: "Hekinan", bg: "#333333", fg: "#FFFFFF", route: "西尾線" },
    { code: 71, type: "普通", dest: "豊田市", en: "Toyotashi", bg: "#333333", fg: "#FFFFFF", route: "西尾線" },
    { code: 72, type: "普通", dest: "猿投", en: "Sanage", bg: "#333333", fg: "#FFFFFF", route: "西尾線" },
    { code: 73, type: "普通", dest: "蒲郡", en: "Gamagori", bg: "#333333", fg: "#FFFFFF", route: "西尾線" },
    { code: 74, type: "急行", dest: "吉良吉田", en: "Kira-Yoshida", bg: "#005BAC", fg: "#FFFFFF", route: "西尾線" },
    { code: 75, type: "普通", dest: "吉良吉田", en: "Kira-Yoshida", bg: "#333333", fg: "#FFFFFF", route: "西尾線" },
    { code: 76, type: "急行", dest: "西尾", en: "Nishio", bg: "#005BAC", fg: "#FFFFFF", route: "西尾線" },
    { code: 77, type: "普通", dest: "西尾", en: "Nishio", bg: "#333333", fg: "#FFFFFF", route: "西尾線" },
    { code: 78, type: "普通", dest: "小牧", en: "Komaki", bg: "#333333", fg: "#FFFFFF", route: "犬山線" },
    { code: 79, type: "普通", dest: "上飯田", en: "Kamiiida", bg: "#333333", fg: "#FFFFFF", route: "犬山線" },
    { code: 80, type: "普通", dest: "玉ノ井", en: "Tamanoi", bg: "#333333", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 81, type: "急行", dest: "栄町", en: "Sakaemachi", bg: "#005BAC", fg: "#FFFFFF", route: "瀬戸線" },
    { code: 82, type: "普通", dest: "栄町", en: "Sakaemachi", bg: "#333333", fg: "#FFFFFF", route: "瀬戸線" },
    { code: 83, type: "急行", dest: "尾張瀬戸", en: "Owari-Seto", bg: "#005BAC", fg: "#FFFFFF", route: "瀬戸線" },
    { code: 84, type: "普通", dest: "尾張瀬戸", en: "Owari-Seto", bg: "#333333", fg: "#FFFFFF", route: "瀬戸線" },
    { code: 85, type: "普通", dest: "尾張旭", en: "Owariasahi", bg: "#333333", fg: "#FFFFFF", route: "瀬戸線" },
    { code: 86, type: "普通", dest: "喜多山", en: "Kitayama", bg: "#333333", fg: "#FFFFFF", route: "瀬戸線" },
    { code: 87, type: "快特", dest: "豊橋", en: "Toyohashi", bg: "#C8102E", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 88, type: "快特", dest: "新鵜沼", en: "Shin-Unuma", bg: "#C8102E", fg: "#FFFFFF", route: "犬山線" },
    { code: 89, type: "ミュースカイ", dest: "中部国際空港", en: "Central Japan Int'l Airport", bg: "#00205B", fg: "#FFFFFF", route: "空港線" },
    { code: 90, type: "ミュースカイ", dest: "名鉄名古屋", en: "Meitetsu Nagoya", bg: "#00205B", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 91, type: "ミュースカイ", dest: "名鉄岐阜", en: "Meitetsu Gifu", bg: "#00205B", fg: "#FFFFFF", route: "名古屋本線" },
    { code: 92, type: "臨時", dest: "臨時", en: "Extra", bg: "#C8102E", fg: "#FFFFFF", route: "業務" },
    { code: 99, type: "締切", dest: "締切", en: "Closed", bg: "#555555", fg: "#FFFFFF", route: "業務" }
];

const MAX_CODE = ROLLSIGN_DATABASE.length - 1;

// システム状態
let currentTens = 0;
let currentOnes = 5;
let currentAddress = 2;
let currentPhysicalPos = 5;
let targetCommandCode = 5;
let isRolling = false;
let rollTimer = null;
let isTimetableAuto = false;
let timetableData = [];
let soundEnabled = true;
let selectedRouteFilter = "all";

// 発車標状態
let nextTrain1 = null;
let nextTrain2 = null;

// ESP32 WebSocket
let wsSocket = null;
let isConnected = false;

// Web Audio API サウンド
let audioCtx = null;
let motorOsc = null;
let motorGain = null;

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

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

function startMotorSound() {
    if (!soundEnabled) return;
    initAudio();
    try {
        if (motorOsc) return;
        motorOsc = audioCtx.createOscillator();
        motorGain = audioCtx.createGain();
        motorOsc.type = "sawtooth";
        motorOsc.frequency.setValueAtTime(120, audioCtx.currentTime);
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

// DOM
const digitTensElem = document.getElementById("digitTens");
const digitOnesElem = document.getElementById("digitOnes");
const signTypeElem = document.getElementById("signType");
const signDestElem = document.getElementById("signDest");
const signDestEnElem = document.getElementById("signDestEn");
const currentStatusText = document.getElementById("currentStatusText");
const currentCodeText = document.getElementById("currentCodeText");
const realtimeClockElem = document.getElementById("realtimeClock");
const timetableSwitch = document.getElementById("timetableAutoSwitch");
const destGridElem = document.getElementById("destGrid");
const connectionStatusElem = document.getElementById("connectionStatus");
const soundToggleBtn = document.getElementById("soundToggleBtn");
const rollsignFrame = document.getElementById("rollsignFrame");
const skinSelect = document.getElementById("skinSelect");

// 発車標DOM
const ledTime1 = document.getElementById("ledTime1");
const ledType1 = document.getElementById("ledType1");
const ledDest1 = document.getElementById("ledDest1");
const ledCars1 = document.getElementById("ledCars1");
const ledDoor1 = document.getElementById("ledDoor1");
const ledTime2 = document.getElementById("ledTime2");
const ledType2 = document.getElementById("ledType2");
const ledDest2 = document.getElementById("ledDest2");
const ledCars2 = document.getElementById("ledCars2");
const ledDoor2 = document.getElementById("ledDoor2");

// 初期化
document.addEventListener("DOMContentLoaded", () => {
    initQuickGrid();
    loadTimetable();
    startRealtimeClock();
    renderCurtain(currentPhysicalPos);
    updateSwitchDisplay();

    // デジスイッチ
    document.getElementById("btnTensUp").addEventListener("click", () => { stepDigit("tens", 1); playClickSound(); });
    document.getElementById("btnTensDown").addEventListener("click", () => { stepDigit("tens", -1); playClickSound(); });
    document.getElementById("btnOnesUp").addEventListener("click", () => { stepDigit("ones", 1); playClickSound(); });
    document.getElementById("btnOnesDown").addEventListener("click", () => { stepDigit("ones", -1); playClickSound(); });

    // 手動進段/戻し
    document.getElementById("btnStepForward").addEventListener("click", () => {
        playClickSound();
        const nextIdx = (getCurrentIndex() + 1) % ROLLSIGN_DATABASE.length;
        targetCommandCode = ROLLSIGN_DATABASE[nextIdx].code;
        syncSwitchFromCode(targetCommandCode);
        sendCommand(currentAddress, targetCommandCode);
    });
    document.getElementById("btnStepBackward").addEventListener("click", () => {
        playClickSound();
        const prevIdx = (getCurrentIndex() - 1 + ROLLSIGN_DATABASE.length) % ROLLSIGN_DATABASE.length;
        targetCommandCode = ROLLSIGN_DATABASE[prevIdx].code;
        syncSwitchFromCode(targetCommandCode);
        sendCommand(currentAddress, targetCommandCode);
    });

    // 指令送出・停止
    document.getElementById("btnSend").addEventListener("click", () => {
        playRelaySound();
        targetCommandCode = getSwitchCode();
        sendCommand(currentAddress, targetCommandCode);
    });
    document.getElementById("btnStop").addEventListener("click", () => {
        playRelaySound();
        stopCommand();
    });

    // 発車標同期ボタン
    document.getElementById("btnSyncTrain").addEventListener("click", () => {
        if (nextTrain1) {
            playRelaySound();
            syncSwitchFromCode(nextTrain1.code);
            sendCommand(currentAddress, nextTrain1.code);
        }
    });

    // 発車標の行クリックで即反映
    document.getElementById("ledRow1").addEventListener("click", () => {
        if (nextTrain1) {
            playClickSound();
            syncSwitchFromCode(nextTrain1.code);
            sendCommand(currentAddress, nextTrain1.code);
        }
    });
    document.getElementById("ledRow2").addEventListener("click", () => {
        if (nextTrain2) {
            playClickSound();
            syncSwitchFromCode(nextTrain2.code);
            sendCommand(currentAddress, nextTrain2.code);
        }
    });

    // ダイヤ自動連動スイッチ
    timetableSwitch.addEventListener("change", (e) => {
        isTimetableAuto = e.target.checked;
        if (isTimetableAuto) updateHasshahyoFromClock();
    });

    // 車体スキン切替
    skinSelect.addEventListener("change", (e) => {
        rollsignFrame.className = `rollsign-frame ${e.target.value}`;
    });

    // 系統タブ切替
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            selectedRouteFilter = e.target.dataset.route;
            initQuickGrid();
        });
    });

    // サウンド切替
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener("click", () => {
            soundEnabled = !soundEnabled;
            soundToggleBtn.textContent = soundEnabled ? "🔊 サウンド ON" : "🔇 サウンド OFF";
            if (!soundEnabled) stopMotorSound();
        });
    }

    // ESP32接続
    document.getElementById("btnConnect").addEventListener("click", connectESP32);
});

function getCurrentIndex() {
    const idx = ROLLSIGN_DATABASE.findIndex(item => item.code === currentPhysicalPos);
    return idx >= 0 ? idx : 0;
}

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

    // グリッドのアクティブ更新
    document.querySelectorAll(".dest-btn").forEach(btn => {
        btn.classList.toggle("active", parseInt(btn.dataset.code) === code);
    });
}

// 指令送出
function sendCommand(addr, targetCode) {
    targetCommandCode = targetCode;
    playRelaySound();

    if (wsSocket && wsSocket.readyState === WebSocket.OPEN) {
        const payload = JSON.stringify({ action: "send", addr: addr, code: targetCode });
        wsSocket.send(payload);
        currentStatusText.textContent = `送信中 (ADDR:${addr} CODE:${targetCode}) ... 実機通信`;
        currentStatusText.style.color = "#FFD54F";
        return;
    }

    // つながってない時: 完全ブラウザモック（連続スクロール幕回し）
    runMockRollSimulation(targetCode);
}

// 連続幕回し＆アンサーバックシミュレータ
function runMockRollSimulation(target) {
    if (isRolling) clearInterval(rollTimer);
    if (currentPhysicalPos === target) {
        currentStatusText.textContent = `一致停止 (MATCH STOP) [AB完了]`;
        currentStatusText.style.color = "#00E676";
        stopMotorSound();
        return;
    }

    isRolling = true;
    startMotorSound();
    currentStatusText.textContent = `回転中 (送出: ${target}) [アンサーバック監視中...]`;
    currentStatusText.style.color = "#FFD54F";

    const targetIdx = ROLLSIGN_DATABASE.findIndex(i => i.code === target);
    let curIdx = getCurrentIndex();
    const len = ROLLSIGN_DATABASE.length;

    // 最短回転方向
    const diff = (targetIdx - curIdx + len) % len;
    const step = (diff <= len / 2) ? 1 : -1;

    const curtain = document.getElementById("rollsignCurtain");

    rollTimer = setInterval(() => {
        curtain.style.transform = step > 0 ? "translateY(-8px)" : "translateY(8px)";
        curtain.style.opacity = "0.6";

        setTimeout(() => {
            curIdx = (curIdx + step + len) % len;
            currentPhysicalPos = ROLLSIGN_DATABASE[curIdx].code;
            renderCurtain(currentPhysicalPos);
            curtain.style.transform = "translateY(0)";
            curtain.style.opacity = "1.0";

            if (currentPhysicalPos === target) {
                clearInterval(rollTimer);
                isRolling = false;
                stopMotorSound();
                playRelaySound();
                currentStatusText.textContent = `一致停止 (MATCH STOP) [AB完了]`;
                currentStatusText.style.color = "#00E676";
            }
        }, 100);
    }, 240);
}

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

// 系統別クイックグリッド
function initQuickGrid() {
    destGridElem.innerHTML = "";
    const filtered = (selectedRouteFilter === "all")
        ? ROLLSIGN_DATABASE
        : ROLLSIGN_DATABASE.filter(item => item.route === selectedRouteFilter);

    document.getElementById("destCountBadge").textContent = `${filtered.length}コマ表示中`;

    filtered.forEach(item => {
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

// リアルタイム時計＆発車標更新
function startRealtimeClock() {
    setInterval(() => {
        const now = new Date();
        realtimeClockElem.textContent = now.toTimeString().split(' ')[0];

        // 毎分更新
        if (now.getSeconds() === 0 || !nextTrain1) {
            updateHasshahyoFromClock();
        }
    }, 1000);
}

// 時刻表データ読込
async function loadTimetable() {
    try {
        const res = await fetch("timetable.json");
        const data = await res.json();
        timetableData = data.departures;
        updateHasshahyoFromClock();
    } catch (e) {
        console.warn("timetable.json 読込失敗 (フォールバック使用)", e);
    }
}

// 発車標表示更新
function updateHasshahyoFromClock() {
    if (!timetableData || timetableData.length === 0) return;
    const now = new Date();
    const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 先発・次発を抽出
    let idx = timetableData.findIndex(t => t.time >= currentHM);
    if (idx === -1) idx = 0;

    nextTrain1 = timetableData[idx];
    nextTrain2 = timetableData[(idx + 1) % timetableData.length];

    if (nextTrain1) {
        ledTime1.textContent = nextTrain1.time;
        ledType1.textContent = formatTrainType(nextTrain1.type);
        ledType1.className = `led-type ${getTypeClass(nextTrain1.type)}`;
        ledDest1.textContent = nextTrain1.dest;
        ledCars1.textContent = nextTrain1.type === "特急" ? "8両" : "6両";
    }

    if (nextTrain2) {
        ledTime2.textContent = nextTrain2.time;
        ledType2.textContent = formatTrainType(nextTrain2.type);
        ledType2.className = `led-type ${getTypeClass(nextTrain2.type)}`;
        ledDest2.textContent = nextTrain2.dest;
        ledCars2.textContent = nextTrain2.type === "普通" ? "4両" : "6両";
    }

    // ダイヤ自動連動ONなら、方向幕も先発列車に自動連動
    if (isTimetableAuto && nextTrain1 && currentPhysicalPos !== nextTrain1.code) {
        syncSwitchFromCode(nextTrain1.code);
        sendCommand(currentAddress, nextTrain1.code);
    }
}

function formatTrainType(t) {
    if (t.length === 2) return t[0] + "　" + t[1];
    return t;
}

function getTypeClass(t) {
    if (t.includes("特急") || t.includes("快特")) return "type-limited";
    if (t.includes("急行") || t.includes("快急")) return "type-express";
    if (t.includes("準急")) return "type-semi";
    return "type-local";
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
