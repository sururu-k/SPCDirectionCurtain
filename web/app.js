// ==============================================================================
// 名鉄 LED発車標 ＆ 方向幕シミュレーター JavaScript
// ==============================================================================

// 名鉄全線 コマ対照データベース (新広見運輸区様データ準拠)
const ROLLSIGN_DATABASE = [
    { code: 0,  type: "回送", dest: "回送", en: "Not in Service", bg: "#333333", fg: "#FFFFFF" },
    { code: 1,  type: "試運転", dest: "試運転", en: "Test Run", bg: "#333333", fg: "#FFFFFF" },
    { code: 2,  type: "団体", dest: "団体", en: "Party", bg: "#C8102E", fg: "#FFFFFF" },
    { code: 3,  type: "普通", dest: "新羽島", en: "Shin-Hashima", bg: "#333333", fg: "#FFFFFF" },
    { code: 4,  type: "普通", dest: "羽島市役所前", en: "Hashima-Shiyakusho-mae", bg: "#333333", fg: "#FFFFFF" },
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
    { code: 15, type: "急行", dest: "名鉄一宮", en: "Meitetsu Ichinomiya", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 16, type: "普通", dest: "名鉄一宮", en: "Meitetsu Ichinomiya", bg: "#333333", fg: "#FFFFFF" },
    { code: 17, type: "急行", dest: "須ケ口", en: "Sukaguchi", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 18, type: "普通", dest: "須ケ口", en: "Sukaguchi", bg: "#333333", fg: "#FFFFFF" },
    { code: 19, type: "普通", dest: "栄生", en: "Sako", bg: "#333333", fg: "#FFFFFF" },
    { code: 20, type: "急行", dest: "名鉄名古屋", en: "Meitetsu Nagoya", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 21, type: "普通", dest: "名鉄名古屋", en: "Meitetsu Nagoya", bg: "#333333", fg: "#FFFFFF" },
    { code: 22, type: "特急", dest: "名鉄名古屋", en: "Meitetsu Nagoya", bg: "#C8102E", fg: "#FFFFFF" },
    { code: 23, type: "普通", dest: "神宮前", en: "Jingu-mae", bg: "#333333", fg: "#FFFFFF" },
    { code: 24, type: "急行", dest: "鳴海", en: "Narumi", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 25, type: "普通", dest: "鳴海", en: "Narumi", bg: "#333333", fg: "#FFFFFF" },
    { code: 26, type: "急行", dest: "豊明", en: "Toyoake", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 27, type: "普通", dest: "豊明", en: "Toyoake", bg: "#333333", fg: "#FFFFFF" },
    { code: 28, type: "急行", dest: "知立", en: "Chiryu", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 29, type: "普通", dest: "知立", en: "Chiryu", bg: "#333333", fg: "#FFFFFF" },
    { code: 30, type: "急行", dest: "新安城", en: "Shin-Anjo", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 31, type: "普通", dest: "新安城", en: "Shin-Anjo", bg: "#333333", fg: "#FFFFFF" },
    { code: 32, type: "急行", dest: "東岡崎", en: "Higashi-Okazaki", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 33, type: "普通", dest: "東岡崎", en: "Higashi-Okazaki", bg: "#333333", fg: "#FFFFFF" },
    { code: 34, type: "普通", dest: "美合", en: "Miai", bg: "#333333", fg: "#FFFFFF" },
    { code: 35, type: "普通", dest: "本宿", en: "Motojuku", bg: "#333333", fg: "#FFFFFF" },
    { code: 36, type: "急行", dest: "国府", en: "Ko", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 37, type: "普通", dest: "国府", en: "Ko", bg: "#333333", fg: "#FFFFFF" },
    { code: 38, type: "急行", dest: "伊奈", en: "Ina", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 39, type: "普通", dest: "伊奈", en: "Ina", bg: "#333333", fg: "#FFFFFF" },
    { code: 40, type: "急行", dest: "豊川稲荷", en: "Toyokawa-Inari", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 41, type: "普通", dest: "豊川稲荷", en: "Toyokawa-Inari", bg: "#333333", fg: "#FFFFFF" },
    { code: 42, type: "急行", dest: "犬山経由岐阜", en: "Gifu via Inuyama", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 43, type: "普通", dest: "三柿野", en: "Mikakino", bg: "#333333", fg: "#FFFFFF" },
    { code: 44, type: "急行", dest: "新鵜沼", en: "Shin-Unuma", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 45, type: "普通", dest: "新鵜沼", en: "Shin-Unuma", bg: "#333333", fg: "#FFFFFF" },
    { code: 46, type: "急行", dest: "犬山", en: "Inuyama", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 47, type: "普通", dest: "犬山", en: "Inuyama", bg: "#333333", fg: "#FFFFFF" },
    { code: 48, type: "普通", dest: "柏森", en: "Kashiwamori", bg: "#333333", fg: "#FFFFFF" },
    { code: 49, type: "急行", dest: "岩倉", en: "Iwakura", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 50, type: "普通", dest: "岩倉", en: "Iwakura", bg: "#333333", fg: "#FFFFFF" },
    { code: 51, type: "普通", dest: "新可児", en: "Shin-Kani", bg: "#333333", fg: "#FFFFFF" },
    { code: 52, type: "普通", dest: "御嵩", en: "Mitake", bg: "#333333", fg: "#FFFFFF" },
    { code: 53, type: "急行", dest: "太田川", en: "Otagawa", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 54, type: "普通", dest: "太田川", en: "Otagawa", bg: "#333333", fg: "#FFFFFF" },
    { code: 55, type: "普通", dest: "常滑", en: "Tokoname", bg: "#333333", fg: "#FFFFFF" },
    { code: 56, type: "急行", dest: "知多半田", en: "Chita-Handa", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 57, type: "普通", dest: "知多半田", en: "Chita-Handa", bg: "#333333", fg: "#FFFFFF" },
    { code: 58, type: "急行", dest: "河和", en: "Kowa", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 59, type: "普通", dest: "河和", en: "Kowa", bg: "#333333", fg: "#FFFFFF" },
    { code: 60, type: "特急", dest: "河和", en: "Kowa", bg: "#C8102E", fg: "#FFFFFF" },
    { code: 61, type: "急行", dest: "内海", en: "Utsumi", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 62, type: "普通", dest: "内海", en: "Utsumi", bg: "#333333", fg: "#FFFFFF" },
    { code: 63, type: "特急", dest: "内海", en: "Utsumi", bg: "#C8102E", fg: "#FFFFFF" },
    { code: 64, type: "普通", dest: "金山", en: "Kanayama", bg: "#333333", fg: "#FFFFFF" },
    { code: 65, type: "急行", dest: "佐屋", en: "Saya", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 66, type: "普通", dest: "佐屋", en: "Saya", bg: "#333333", fg: "#FFFFFF" },
    { code: 67, type: "普通", dest: "弥富", en: "Yatomi", bg: "#333333", fg: "#FFFFFF" },
    { code: 68, type: "普通", dest: "津島", en: "Tsushima", bg: "#333333", fg: "#FFFFFF" },
    { code: 69, type: "普通", dest: "森上", en: "Morikami", bg: "#333333", fg: "#FFFFFF" },
    { code: 70, type: "普通", dest: "碧南", en: "Hekinan", bg: "#333333", fg: "#FFFFFF" },
    { code: 71, type: "普通", dest: "豊田市", en: "Toyotashi", bg: "#333333", fg: "#FFFFFF" },
    { code: 72, type: "普通", dest: "猿投", en: "Sanage", bg: "#333333", fg: "#FFFFFF" },
    { code: 73, type: "普通", dest: "蒲郡", en: "Gamagori", bg: "#333333", fg: "#FFFFFF" },
    { code: 74, type: "急行", dest: "吉良吉田", en: "Kira-Yoshida", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 75, type: "普通", dest: "吉良吉田", en: "Kira-Yoshida", bg: "#333333", fg: "#FFFFFF" },
    { code: 76, type: "急行", dest: "西尾", en: "Nishio", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 77, type: "普通", dest: "西尾", en: "Nishio", bg: "#333333", fg: "#FFFFFF" },
    { code: 78, type: "普通", dest: "小牧", en: "Komaki", bg: "#333333", fg: "#FFFFFF" },
    { code: 79, type: "普通", dest: "上飯田", en: "Kamiiida", bg: "#333333", fg: "#FFFFFF" },
    { code: 80, type: "普通", dest: "玉ノ井", en: "Tamanoi", bg: "#333333", fg: "#FFFFFF" },
    { code: 81, type: "急行", dest: "栄町", en: "Sakaemachi", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 82, type: "普通", dest: "栄町", en: "Sakaemachi", bg: "#333333", fg: "#FFFFFF" },
    { code: 83, type: "急行", dest: "尾張瀬戸", en: "Owari-Seto", bg: "#005BAC", fg: "#FFFFFF" },
    { code: 84, type: "普通", dest: "尾張瀬戸", en: "Owari-Seto", bg: "#333333", fg: "#FFFFFF" },
    { code: 85, type: "普通", dest: "尾張旭", en: "Owariasahi", bg: "#333333", fg: "#FFFFFF" },
    { code: 86, type: "普通", dest: "喜多山", en: "Kitayama", bg: "#333333", fg: "#FFFFFF" },
    { code: 87, type: "快特", dest: "豊橋", en: "Toyohashi", bg: "#C8102E", fg: "#FFFFFF" },
    { code: 88, type: "快特", dest: "新鵜沼", en: "Shin-Unuma", bg: "#C8102E", fg: "#FFFFFF" },
    { code: 89, type: "ミュースカイ", dest: "中部国際空港", en: "Central Japan Int'l Airport", bg: "#00205B", fg: "#FFFFFF" },
    { code: 90, type: "ミュースカイ", dest: "名鉄名古屋", en: "Meitetsu Nagoya", bg: "#00205B", fg: "#FFFFFF" },
    { code: 91, type: "ミュースカイ", dest: "名鉄岐阜", en: "Meitetsu Gifu", bg: "#00205B", fg: "#FFFFFF" },
    { code: 92, type: "臨時", dest: "臨時", en: "Extra", bg: "#C8102E", fg: "#FFFFFF" },
    { code: 99, type: "締切", dest: "締切", en: "Closed", bg: "#555555", fg: "#FFFFFF" }
];

// アプリケーション状態
let currentTens = 0;
let currentOnes = 5;
let currentPhysicalPos = 5;
let targetCommandCode = 5;
let isRolling = false;
let rollTimer = null;
let isTimetableAuto = false;
let timetableData = [];
let soundEnabled = true;

// 発車標表示データ
let currentTrain1 = null;
let currentTrain2 = null;
let displayLang = "ja";
let langCycle = 0;

// ESP32 WebSocket
let wsSocket = null;
let isConnected = false;

// Web Audio API
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
        osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.025);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.025);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.025);
    } catch (e) {}
}

function playRelaySound() {
    if (!soundEnabled) return;
    initAudio();
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(350, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
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
        motorGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        motorOsc.connect(motorGain);
        motorGain.connect(audioCtx.destination);
        motorOsc.start();
    } catch (e) {}
}

function stopMotorSound() {
    if (motorOsc) {
        try {
            motorGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
            motorOsc.stop(audioCtx.currentTime + 0.04);
        } catch (e) {}
        motorOsc = null;
        motorGain = null;
    }
}

// DOM
const carWindow = document.getElementById("carWindow");
const curtainType = document.getElementById("curtainType");
const curtainDest = document.getElementById("curtainDest");
const curtainEn = document.getElementById("curtainEn");
const currentPosText = document.getElementById("currentPosText");
const currentNameText = document.getElementById("currentNameText");
const currentSetText = document.getElementById("currentSetText");
const motionStatus = document.getElementById("motionStatus");
const realtimeClock = document.getElementById("realtimeClock");
const destSelect = document.getElementById("destSelect");
const typeSelect = document.getElementById("typeSelect");
const digitTens = document.getElementById("digitTens");
const digitOnes = document.getElementById("digitOnes");

// 発車標DOM
const ledTime1 = document.getElementById("ledTime1");
const ledType1 = document.getElementById("ledType1");
const ledDest1 = document.getElementById("ledDest1");
const ledCars1 = document.getElementById("ledCars1");
const ledTime2 = document.getElementById("ledTime2");
const ledType2 = document.getElementById("ledType2");
const ledDest2 = document.getElementById("ledDest2");
const ledCars2 = document.getElementById("ledCars2");
const ledApproach = document.getElementById("ledApproach");

// 初期化
document.addEventListener("DOMContentLoaded", () => {
    initDestDropdown();
    loadTimetable();
    startClock();
    renderCurtain(currentPhysicalPos);
    updateSwitchDisplay();

    // デジスイッチ
    document.getElementById("btnTensUp").addEventListener("click", () => { stepDigit("tens", 1); playClickSound(); });
    document.getElementById("btnTensDown").addEventListener("click", () => { stepDigit("tens", -1); playClickSound(); });
    document.getElementById("btnOnesUp").addEventListener("click", () => { stepDigit("ones", 1); playClickSound(); });
    document.getElementById("btnOnesDown").addEventListener("click", () => { stepDigit("ones", -1); playClickSound(); });

    // 指令送出・停止
    document.getElementById("btnSend").addEventListener("click", () => {
        targetCommandCode = getSwitchCode();
        sendCommand(2, targetCommandCode);
    });
    document.getElementById("btnStop").addEventListener("click", () => {
        playRelaySound();
        stopCommand();
    });

    // 1コマ進段/戻し
    document.getElementById("btnStepFwd").addEventListener("click", () => {
        playClickSound();
        const nextIdx = (getCurrentIndex() + 1) % ROLLSIGN_DATABASE.length;
        targetCommandCode = ROLLSIGN_DATABASE[nextIdx].code;
        syncSwitchFromCode(targetCommandCode);
        sendCommand(2, targetCommandCode);
    });
    document.getElementById("btnStepBack").addEventListener("click", () => {
        playClickSound();
        const prevIdx = (getCurrentIndex() - 1 + ROLLSIGN_DATABASE.length) % ROLLSIGN_DATABASE.length;
        targetCommandCode = ROLLSIGN_DATABASE[prevIdx].code;
        syncSwitchFromCode(targetCommandCode);
        sendCommand(2, targetCommandCode);
    });

    // 行先選択プルダウンから適用
    document.getElementById("btnApplySelect").addEventListener("click", () => {
        const code = parseInt(destSelect.value, 10);
        syncSwitchFromCode(code);
        sendCommand(2, code);
    });

    // 発車標を方向幕に設定
    document.getElementById("btnSyncHasshahyo").addEventListener("click", () => {
        if (currentTrain1) {
            syncSwitchFromCode(currentTrain1.code);
            sendCommand(2, currentTrain1.code);
        }
    });

    // 発車標の行クリック
    document.getElementById("trainRow1").addEventListener("click", () => {
        if (currentTrain1) {
            playClickSound();
            syncSwitchFromCode(currentTrain1.code);
            sendCommand(2, currentTrain1.code);
        }
    });
    document.getElementById("trainRow2").addEventListener("click", () => {
        if (currentTrain2) {
            playClickSound();
            syncSwitchFromCode(currentTrain2.code);
            sendCommand(2, currentTrain2.code);
        }
    });

    // 車両形式切替
    document.getElementById("carTypeSelect").addEventListener("change", (e) => {
        carWindow.className = `train-car-window ${e.target.value}`;
    });

    // 表示モード（到着接近表示）
    document.getElementById("arrivalSelect").addEventListener("change", (e) => {
        ledApproach.style.display = (e.target.value === "1") ? "inline" : "none";
    });

    // ダイヤ自動連動スイッチ
    document.getElementById("timetableAutoSwitch").addEventListener("change", (e) => {
        isTimetableAuto = e.target.checked;
        if (isTimetableAuto) updateHasshahyo();
    });

    // サウンド設定
    document.querySelectorAll("input[name='soundOpt']").forEach(radio => {
        radio.addEventListener("change", (e) => {
            soundEnabled = (e.target.value === "on");
            if (!soundEnabled) stopMotorSound();
        });
    });

    // ESP32接続
    document.getElementById("btnConnect").addEventListener("click", connectESP32);
});

function initDestDropdown() {
    destSelect.innerHTML = "";
    ROLLSIGN_DATABASE.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.code;
        opt.textContent = `${String(item.code).padStart(2, '0')} [${item.type}] ${item.dest}`;
        if (item.code === currentPhysicalPos) opt.selected = true;
        destSelect.appendChild(opt);
    });
}

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
    destSelect.value = code;
}

function updateSwitchDisplay() {
    digitTens.textContent = currentTens;
    digitOnes.textContent = currentOnes;
    const code = getSwitchCode();
    currentSetText.textContent = `${String(code).padStart(2, '0')}`;
}

function stepDigit(place, delta) {
    if (place === "tens") {
        currentTens = (currentTens + delta + 10) % 10;
    } else {
        currentOnes = (currentOnes + delta + 10) % 10;
    }
    updateSwitchDisplay();
}

function renderCurtain(code) {
    const entry = ROLLSIGN_DATABASE.find(item => item.code === code);
    if (entry) {
        curtainType.textContent = entry.type;
        curtainType.style.backgroundColor = entry.bg;
        curtainType.style.color = entry.fg;
        curtainDest.textContent = entry.dest;
        curtainEn.textContent = entry.en;
        currentNameText.textContent = `${entry.type} ${entry.dest}`;
    } else {
        curtainType.textContent = "未登録";
        curtainType.style.backgroundColor = "#555";
        curtainDest.textContent = `コマ ${code}`;
        curtainEn.textContent = `Code ${code}`;
        currentNameText.textContent = `未登録 (${code})`;
    }

    currentPosText.textContent = String(code).padStart(2, '0');
    updateSwitchDisplay();
}

function sendCommand(addr, targetCode) {
    targetCommandCode = targetCode;
    playRelaySound();

    if (wsSocket && wsSocket.readyState === WebSocket.OPEN) {
        wsSocket.send(JSON.stringify({ action: "send", addr: addr, code: targetCode }));
        motionStatus.textContent = `実機送信中（CODE:${targetCode}）`;
        return;
    }

    runMockRoll(targetCode);
}

function runMockRoll(target) {
    if (isRolling) clearInterval(rollTimer);
    if (currentPhysicalPos === target) {
        motionStatus.textContent = "一致停止（完了）";
        stopMotorSound();
        return;
    }

    isRolling = true;
    startMotorSound();
    motionStatus.textContent = `回転中 ➔ 目標コマ: ${target}`;

    const targetIdx = ROLLSIGN_DATABASE.findIndex(i => i.code === target);
    let curIdx = getCurrentIndex();
    const len = ROLLSIGN_DATABASE.length;

    const diff = (targetIdx - curIdx + len) % len;
    const step = (diff <= len / 2) ? 1 : -1;

    const curtain = document.getElementById("curtainDisplay");

    rollTimer = setInterval(() => {
        curtain.style.transform = step > 0 ? "translateY(-6px)" : "translateY(6px)";

        setTimeout(() => {
            curIdx = (curIdx + step + len) % len;
            currentPhysicalPos = ROLLSIGN_DATABASE[curIdx].code;
            renderCurtain(currentPhysicalPos);
            curtain.style.transform = "translateY(0)";

            if (currentPhysicalPos === target) {
                clearInterval(rollTimer);
                isRolling = false;
                stopMotorSound();
                playRelaySound();
                motionStatus.textContent = "一致停止（位置決め完了）";
            }
        }, 90);
    }, 220);
}

function stopCommand() {
    if (isRolling) {
        clearInterval(rollTimer);
        isRolling = false;
        stopMotorSound();
    }
    motionStatus.textContent = "手動停止";
    if (wsSocket && wsSocket.readyState === WebSocket.OPEN) {
        wsSocket.send(JSON.stringify({ action: "stop" }));
    }
}

function startClock() {
    setInterval(() => {
        const now = new Date();
        realtimeClock.textContent = now.toTimeString().split(' ')[0];

        // 言語交互切り替え (autoモード時)
        const langMode = document.getElementById("langSelect").value;
        if (langMode === "auto") {
            langCycle = (langCycle + 1) % 11;
            displayLang = (langCycle < 8) ? "ja" : "en";
        } else {
            displayLang = langMode;
        }

        if (now.getSeconds() === 0 || !currentTrain1) {
            updateHasshahyo();
        } else {
            refreshTrainDisplayTexts();
        }
    }, 1000);
}

async function loadTimetable() {
    try {
        const res = await fetch("timetable.json");
        const data = await res.json();
        timetableData = data.departures;
        updateHasshahyo();
    } catch (e) {
        console.warn("timetable.json 読込失敗", e);
    }
}

function updateHasshahyo() {
    if (!timetableData || timetableData.length === 0) return;
    const now = new Date();
    const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let idx = timetableData.findIndex(t => t.time >= currentHM);
    if (idx === -1) idx = 0;

    currentTrain1 = timetableData[idx];
    currentTrain2 = timetableData[(idx + 1) % timetableData.length];

    refreshTrainDisplayTexts();

    if (isTimetableAuto && currentTrain1 && currentPhysicalPos !== currentTrain1.code) {
        syncSwitchFromCode(currentTrain1.code);
        sendCommand(2, currentTrain1.code);
    }
}

function refreshTrainDisplayTexts() {
    if (currentTrain1) {
        ledTime1.textContent = currentTrain1.time;
        ledType1.textContent = (displayLang === "en") ? getEnglishType(currentTrain1.type) : formatType(currentTrain1.type);
        ledType1.className = `led-col-type ${getTypeClass(currentTrain1.type)}`;
        ledDest1.textContent = (displayLang === "en") ? getEnglishDest(currentTrain1.dest) : currentTrain1.dest;
        ledCars1.textContent = currentTrain1.type === "特急" ? "8両" : "6両";
    }
    if (currentTrain2) {
        ledTime2.textContent = currentTrain2.time;
        ledType2.textContent = (displayLang === "en") ? getEnglishType(currentTrain2.type) : formatType(currentTrain2.type);
        ledType2.className = `led-col-type ${getTypeClass(currentTrain2.type)}`;
        ledDest2.textContent = (displayLang === "en") ? getEnglishDest(currentTrain2.dest) : currentTrain2.dest;
        ledCars2.textContent = currentTrain2.type === "普通" ? "4両" : "6両";
    }
}

function formatType(t) {
    if (t.length === 2) return t[0] + "　" + t[1];
    return t;
}

function getEnglishType(t) {
    if (t.includes("特急")) return "Ltd.Exp";
    if (t.includes("急行")) return "Express";
    if (t.includes("準急")) return "Semi.Exp";
    return "Local";
}

function getEnglishDest(d) {
    const entry = ROLLSIGN_DATABASE.find(item => item.dest === d);
    return entry ? entry.en : d;
}

function getTypeClass(t) {
    if (t.includes("特急") || t.includes("快特")) return "type-ltd";
    if (t.includes("急行") || t.includes("快急")) return "type-exp";
    if (t.includes("準急")) return "type-semi";
    return "type-loc";
}

function connectESP32() {
    const ip = document.getElementById("espIpInput").value.trim();
    if (!ip) return;
    const statusText = document.getElementById("espStatusText");

    try {
        wsSocket = new WebSocket(`ws://${ip}:81/`);
        wsSocket.onopen = () => {
            statusText.textContent = `接続中: ${ip}`;
            statusText.style.color = "#008542";
            document.getElementById("connStatus").textContent = `ESP32接続完了 (${ip})`;
        };
        wsSocket.onmessage = (evt) => {
            const data = JSON.parse(evt.data);
            if (data.status === "stopped") {
                currentPhysicalPos = data.code;
                renderCurtain(currentPhysicalPos);
                motionStatus.textContent = "実機位置決め完了";
            }
        };
        wsSocket.onclose = () => {
            statusText.textContent = "未接続（シミュレーターで動作中）";
            statusText.style.color = "#888888";
            document.getElementById("connStatus").textContent = "シミュレーター稼働中（ESP32未接続）";
        };
    } catch (e) {
        console.error("ESP32接続失敗", e);
    }
}
