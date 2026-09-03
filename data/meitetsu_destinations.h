#pragma once
#include <stdint.h>

// 名鉄方向幕 コマデータ構造体
struct RollsignDestination {
    uint8_t code;            // 指令コマ番号 (0〜255)
    const char* trainType;   // 種別
    const char* destJp;      // 行先 (日本語)
    const char* destEn;      // 行先 (英語)
    const char* typeColorBg; // 種別表示の背景色 (HEX)
    const char* typeColorFg; // 種別表示の文字色 (HEX)
};

// 名鉄6500系・3500系等 標準側面方向幕 コマ対照テーブル
static const RollsignDestination MEITETSU_ROLLSIGN_TABLE[] = {
    {  0, "回送",     "回送",             "Not in Service",                 "#333333", "#FFFFFF" },
    {  1, "試運転",   "試運転",           "Test Run",                       "#333333", "#FFFFFF" },
    {  2, "団体",     "団体",             "Party",                          "#C8102E", "#FFFFFF" },
    {  3, "普通",     "新鵜沼",           "Shin-Unuma",                     "#333333", "#FFFFFF" },
    {  4, "急行",     "新鵜沼",           "Shin-Unuma",                     "#005BAC", "#FFFFFF" },
    {  5, "急行",     "中部国際空港",     "Central Japan Int'l Airport",    "#005BAC", "#FFFFFF" }, // md/info.md 実例
    {  6, "準急",     "中部国際空港",     "Central Japan Int'l Airport",    "#008542", "#FFFFFF" },
    {  7, "普通",     "中部国際空港",     "Central Japan Int'l Airport",    "#333333", "#FFFFFF" },
    {  8, "急行",     "名鉄岐阜",         "Meitetsu Gifu",                  "#005BAC", "#FFFFFF" },
    {  9, "普通",     "名鉄岐阜",         "Meitetsu Gifu",                  "#333333", "#FFFFFF" },
    { 10, "特急",     "豊橋",             "Toyohashi",                      "#C8102E", "#FFFFFF" },
    { 11, "快急",     "豊橋",             "Toyohashi",                      "#005BAC", "#FFFFFF" },
    { 12, "急行",     "豊橋",             "Toyohashi",                      "#005BAC", "#FFFFFF" },
    { 13, "準急",     "豊橋",             "Toyohashi",                      "#008542", "#FFFFFF" },
    { 14, "普通",     "豊橋",             "Toyohashi",                      "#333333", "#FFFFFF" },
    { 15, "急行",     "犬山",             "Inuyama",                        "#005BAC", "#FFFFFF" },
    { 16, "普通",     "犬山",             "Inuyama",                        "#333333", "#FFFFFF" },
    { 17, "急行",     "名鉄名古屋",       "Meitetsu Nagoya",                "#005BAC", "#FFFFFF" },
    { 18, "普通",     "名鉄名古屋",       "Meitetsu Nagoya",                "#333333", "#FFFFFF" },
    { 19, "特急",     "名鉄名古屋",       "Meitetsu Nagoya",                "#C8102E", "#FFFFFF" },
    { 20, "急行",     "内海",             "Utsumi",                         "#005BAC", "#FFFFFF" },
    { 21, "普通",     "内海",             "Utsumi",                         "#333333", "#FFFFFF" },
    { 22, "急行",     "河和",             "Kowa",                           "#005BAC", "#FFFFFF" },
    { 23, "普通",     "河和",             "Kowa",                           "#333333", "#FFFFFF" },
    { 24, "特急",     "河和",             "Kowa",                           "#C8102E", "#FFFFFF" },
    { 25, "急行",     "吉良吉田",         "Kira-Yoshida",                   "#005BAC", "#FFFFFF" },
    { 26, "普通",     "吉良吉田",         "Kira-Yoshida",                   "#333333", "#FFFFFF" },
    { 27, "急行",     "西尾",             "Nishio",                         "#005BAC", "#FFFFFF" },
    { 28, "普通",     "西尾",             "Nishio",                         "#333333", "#FFFFFF" },
    { 29, "急行",     "東岡崎",           "Higashi-Okazaki",                "#005BAC", "#FFFFFF" },
    { 30, "普通",     "東岡崎",           "Higashi-Okazaki",                "#333333", "#FFFFFF" },
    { 31, "急行",     "伊奈",             "Ina",                            "#005BAC", "#FFFFFF" },
    { 32, "普通",     "伊奈",             "Ina",                            "#333333", "#FFFFFF" },
    { 33, "急行",     "豊川稲荷",         "Toyokawa-Inari",                 "#005BAC", "#FFFFFF" },
    { 34, "普通",     "豊川稲荷",         "Toyokawa-Inari",                 "#333333", "#FFFFFF" },
    { 35, "臨時",     "臨時",             "Extra",                          "#C8102E", "#FFFFFF" }
};

static const size_t MEITETSU_ROLLSIGN_COUNT = sizeof(MEITETSU_ROLLSIGN_TABLE) / sizeof(MEITETSU_ROLLSIGN_TABLE[0]);

// コマ番号から対照データを検索するヘルパー関数
inline const RollsignDestination* getRollsignEntryByCode(uint8_t code) {
    for (size_t i = 0; i < MEITETSU_ROLLSIGN_COUNT; i++) {
        if (MEITETSU_ROLLSIGN_TABLE[i].code == code) {
            return &MEITETSU_ROLLSIGN_TABLE[i];
        }
    }
    return nullptr; // 未定義コマ
}
