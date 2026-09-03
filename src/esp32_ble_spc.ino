/**
 * @file esp32_ble_spc.ino
 * @brief ESP32 SPC方向幕指令器 Web Bluetooth (BLE) 制御ファームウェア
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// BLE UUID定義 (Webアプリ web/app.js と一致)
#define SERVICE_UUID           "19b10000-e8f2-537e-4f6c-d104768a1214"
#define CHARACTERISTIC_UUID_TX "19b10001-e8f2-537e-4f6c-d104768a1214" // ブラウザからの指令受信用
#define CHARACTERISTIC_UUID_RX "19b10002-e8f2-537e-4f6c-d104768a1214" // ブラウザへのAB完了通知用

// ピンアサイン定義 (plan/circuit_design.md 準拠)
const int PIN_U0P   = 18; // 正半波ゼロクロス検出 (外部割り込み0)
const int PIN_U0M   = 19; // 負半波ゼロクロス検出 (外部割り込み1)
const int PIN_SPOUT = 4;  // 正側トライアックSSRトリガ (MOC3041)
const int PIN_SMOUT = 5;  // 負側トライアックSSRトリガ (MOC3041)
const int PIN_SM    = 23; // アンサーバック受信入力 (PC817C)
const int PIN_RELAY = 26; // 送信保護リレー駆動

BLEServer* pServer = NULL;
BLECharacteristic* pTxCharacteristic = NULL;
BLECharacteristic* pRxCharacteristic = NULL;
bool deviceConnected = false;

volatile uint8_t g_targetAddr = 2; // デフォルト側面幕 (ADDR 2)
volatile uint8_t g_targetCode = 5; // デフォルト急行 中部国際空港
volatile bool g_isTransmitting = false;

// BLEサーバー コールバック
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
        deviceConnected = true;
    };
    void onDisconnect(BLEServer* pServer) {
        deviceConnected = false;
        BLEDevice::startAdvertising(); // 切断時は再アドバタイズ
    }
};

// 指令受信用 コールバック
class CommandCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
        std::string rxValue = pCharacteristic->getValue();
        if (rxValue.length() >= 2) {
            uint8_t addr = rxValue[0];
            uint8_t code = rxValue[1];
            g_targetAddr = addr;
            g_targetCode = code;
            g_isTransmitting = true;
            digitalWrite(PIN_RELAY, HIGH); // リレーON
        }
    }
};

void setup() {
    Serial.begin(115200);

    pinMode(PIN_U0P, INPUT_PULLUP);
    pinMode(PIN_U0M, INPUT_PULLUP);
    pinMode(PIN_SM, INPUT_PULLUP);
    pinMode(PIN_SPOUT, OUTPUT);
    pinMode(PIN_SMOUT, OUTPUT);
    pinMode(PIN_RELAY, OUTPUT);

    digitalWrite(PIN_SPOUT, LOW);
    digitalWrite(PIN_SMOUT, LOW);
    digitalWrite(PIN_RELAY, LOW);

    // BLE初期化
    BLEDevice::init("MEITETSU_SPC_CONTROLLER");
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());

    BLEService *pService = pServer->createService(SERVICE_UUID);

    // 指令受信用
    pTxCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID_TX,
        BLECharacteristic::PROPERTY_WRITE
    );
    pTxCharacteristic->setCallbacks(new CommandCallbacks());

    // 状態送信用 (Notify)
    pRxCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID_RX,
        BLECharacteristic::PROPERTY_NOTIFY
    );
    pRxCharacteristic->addDescriptor(new BLE2902());

    pService->start();
    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(true);
    BLEDevice::startAdvertising();
}

void loop() {
    // SPC 60Hz送出およびアンサーバック監視ループ
    // 目的のコマに到達してアンサーバックが消えたら、ブラウザへ通知
    /*
    if (g_isTransmitting && answerBackStopped) {
        uint8_t notifyData[1] = { g_targetCode };
        pRxCharacteristic->setValue(notifyData, 1);
        pRxCharacteristic->notify();
        g_isTransmitting = false;
        digitalWrite(PIN_RELAY, LOW);
    }
    */
    delay(10);
}
