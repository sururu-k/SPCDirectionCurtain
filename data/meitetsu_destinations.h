#pragma once
#include <stdint.h>

// 名鉄方向幕 コマデータ構造体
struct RollsignDestination {
    uint8_t code;            // 指令コマ番号 (0〜255)
    const char* trainType;   // 種別 (普通, 準急, 急行, 快急, 特急, 快特, 回送, 試運転, 団体 等)
    const char* destJp;      // 行先 (日本語)
    const char* destEn;      // 行先 (英語)
    const char* typeColorBg; // 種別背景色 (HEX)
    const char* typeColorFg; // 種別文字色 (HEX)
    const char* route;       // 路線・系統系統区分
};

// 名鉄全線（本線・犬山線・空港線・河和線・西尾線・津島線・各務原線・広見線・瀬戸線等）完全対照テーブル
static const RollsignDestination MEITETSU_ROLLSIGN_TABLE[] = {
    {  0, "回送",     "回送",             "Not in Service",                 "#333333", "#FFFFFF", "業務" },
    {  1, "試運転",   "試運転",           "Test Run",                       "#333333", "#FFFFFF", "業務" },
    {  2, "団体",     "団体",             "Party",                          "#C8102E", "#FFFFFF", "業務" },
    {  3, "普通",     "新羽島",           "Shin-Hashima",                   "#333333", "#FFFFFF", "羽島線" },
    {  4, "普通",     "羽島市役所前",     "Hashima-Shiyakusho-mae",         "#333333", "#FFFFFF", "羽島線" },
    {  5, "急行",     "中部国際空港",     "Central Japan Int'l Airport",    "#005BAC", "#FFFFFF", "空港線" }, // info.md 実例
    {  6, "準急",     "中部国際空港",     "Central Japan Int'l Airport",    "#008542", "#FFFFFF", "空港線" },
    {  7, "普通",     "中部国際空港",     "Central Japan Int'l Airport",    "#333333", "#FFFFFF", "空港線" },
    {  8, "急行",     "名鉄岐阜",         "Meitetsu Gifu",                  "#005BAC", "#FFFFFF", "名古屋本線" },
    {  9, "普通",     "名鉄岐阜",         "Meitetsu Gifu",                  "#333333", "#FFFFFF", "名古屋本線" },
    { 10, "特急",     "豊橋",             "Toyohashi",                      "#C8102E", "#FFFFFF", "名古屋本線" },
    { 11, "快急",     "豊橋",             "Toyohashi",                      "#005BAC", "#FFFFFF", "名古屋本線" },
    { 12, "急行",     "豊橋",             "Toyohashi",                      "#005BAC", "#FFFFFF", "名古屋本線" },
    { 13, "準急",     "豊橋",             "Toyohashi",                      "#008542", "#FFFFFF", "名古屋本線" },
    { 14, "普通",     "豊橋",             "Toyohashi",                      "#333333", "#FFFFFF", "名古屋本線" },
    { 15, "急行",     "名鉄一宮",         "Meitetsu Ichinomiya",            "#005BAC", "#FFFFFF", "名古屋本線" },
    { 16, "普通",     "名鉄一宮",         "Meitetsu Ichinomiya",            "#333333", "#FFFFFF", "名古屋本線" },
    { 17, "急行",     "須ケ口",           "Sukaguchi",                      "#005BAC", "#FFFFFF", "名古屋本線" },
    { 18, "普通",     "須ケ口",           "Sukaguchi",                      "#333333", "#FFFFFF", "名古屋本線" },
    { 19, "普通",     "栄生",             "Sako",                           "#333333", "#FFFFFF", "名古屋本線" },
    { 20, "急行",     "名鉄名古屋",       "Meitetsu Nagoya",                "#005BAC", "#FFFFFF", "名古屋本線" },
    { 21, "普通",     "名鉄名古屋",       "Meitetsu Nagoya",                "#333333", "#FFFFFF", "名古屋本線" },
    { 22, "特急",     "名鉄名古屋",       "Meitetsu Nagoya",                "#C8102E", "#FFFFFF", "名古屋本線" },
    { 23, "普通",     "神宮前",           "Jingu-mae",                      "#333333", "#FFFFFF", "名古屋本線" },
    { 24, "急行",     "鳴海",             "Narumi",                         "#005BAC", "#FFFFFF", "名古屋本線" },
    { 25, "普通",     "鳴海",             "Narumi",                         "#333333", "#FFFFFF", "名古屋本線" },
    { 26, "急行",     "豊明",             "Toyoake",                        "#005BAC", "#FFFFFF", "名古屋本線" },
    { 27, "普通",     "豊明",             "Toyoake",                        "#333333", "#FFFFFF", "名古屋本線" },
    { 28, "急行",     "知立",             "Chiryu",                         "#005BAC", "#FFFFFF", "名古屋本線" },
    { 29, "普通",     "知立",             "Chiryu",                         "#333333", "#FFFFFF", "名古屋本線" },
    { 30, "急行",     "新安城",           "Shin-Anjo",                      "#005BAC", "#FFFFFF", "名古屋本線" },
    { 31, "普通",     "新安城",           "Shin-Anjo",                      "#333333", "#FFFFFF", "名古屋本線" },
    { 32, "急行",     "東岡崎",           "Higashi-Okazaki",                "#005BAC", "#FFFFFF", "名古屋本線" },
    { 33, "普通",     "東岡崎",           "Higashi-Okazaki",                "#333333", "#FFFFFF", "名古屋本線" },
    { 34, "普通",     "美合",             "Miai",                           "#333333", "#FFFFFF", "名古屋本線" },
    { 35, "普通",     "本宿",             "Motojuku",                       "#333333", "#FFFFFF", "名古屋本線" },
    { 36, "急行",     "国府",             "Ko",                             "#005BAC", "#FFFFFF", "名古屋本線" },
    { 37, "普通",     "国府",             "Ko",                             "#333333", "#FFFFFF", "名古屋本線" },
    { 38, "急行",     "伊奈",             "Ina",                            "#005BAC", "#FFFFFF", "名古屋本線" },
    { 39, "普通",     "伊奈",             "Ina",                            "#333333", "#FFFFFF", "名古屋本線" },
    { 40, "急行",     "豊川稲荷",         "Toyokawa-Inari",                 "#005BAC", "#FFFFFF", "豊川線" },
    { 41, "普通",     "豊川稲荷",         "Toyokawa-Inari",                 "#333333", "#FFFFFF", "豊川線" },
    { 42, "急行",     "犬山経由岐阜",     "Gifu via Inuyama",               "#005BAC", "#FFFFFF", "各務原線" },
    { 43, "普通",     "三柿野",           "Mikakino",                       "#333333", "#FFFFFF", "各務原線" },
    { 44, "急行",     "新鵜沼",           "Shin-Unuma",                     "#005BAC", "#FFFFFF", "犬山線" },
    { 45, "普通",     "新鵜沼",           "Shin-Unuma",                     "#333333", "#FFFFFF", "犬山線" },
    { 46, "急行",     "犬山",             "Inuyama",                        "#005BAC", "#FFFFFF", "犬山線" },
    { 47, "普通",     "犬山",             "Inuyama",                        "#333333", "#FFFFFF", "犬山線" },
    { 48, "普通",     "柏森",             "Kashiwamori",                    "#333333", "#FFFFFF", "犬山線" },
    { 49, "急行",     "岩倉",             "Iwakura",                        "#005BAC", "#FFFFFF", "犬山線" },
    { 50, "普通",     "岩倉",             "Iwakura",                        "#333333", "#FFFFFF", "犬山線" },
    { 51, "普通",     "新可児",           "Shin-Kani",                      "#333333", "#FFFFFF", "広見線" },
    { 52, "普通",     "御嵩",             "Mitake",                         "#333333", "#FFFFFF", "広見線" },
    { 53, "急行",     "太田川",           "Otagawa",                        "#005BAC", "#FFFFFF", "常滑線" },
    { 54, "普通",     "太田川",           "Otagawa",                        "#333333", "#FFFFFF", "常滑線" },
    { 55, "普通",     "常滑",             "Tokoname",                       "#333333", "#FFFFFF", "常滑線" },
    { 56, "急行",     "知多半田",         "Chita-Handa",                    "#005BAC", "#FFFFFF", "河和線" },
    { 57, "普通",     "知多半田",         "Chita-Handa",                    "#333333", "#FFFFFF", "河和線" },
    { 58, "急行",     "河和",             "Kowa",                           "#005BAC", "#FFFFFF", "河和線" },
    { 59, "普通",     "河和",             "Kowa",                           "#333333", "#FFFFFF", "河和線" },
    { 60, "特急",     "河和",             "Kowa",                           "#C8102E", "#FFFFFF", "河和線" },
    { 61, "急行",     "内海",             "Utsumi",                         "#005BAC", "#FFFFFF", "知多新線" },
    { 62, "普通",     "内海",             "Utsumi",                         "#333333", "#FFFFFF", "知多新線" },
    { 63, "特急",     "内海",             "Utsumi",                         "#C8102E", "#FFFFFF", "知多新線" },
    { 64, "普通",     "金山",             "Kanayama",                       "#333333", "#FFFFFF", "名古屋本線" },
    { 65, "急行",     "佐屋",             "Saya",                           "#005BAC", "#FFFFFF", "尾西線" },
    { 66, "普通",     "佐屋",             "Saya",                           "#333333", "#FFFFFF", "尾西線" },
    { 67, "普通",     "弥富",             "Yatomi",                         "#333333", "#FFFFFF", "尾西線" },
    { 68, "普通",     "津島",             "Tsushima",                       "#333333", "#FFFFFF", "津島線" },
    { 69, "普通",     "森上",             "Morikami",                       "#333333", "#FFFFFF", "尾西線" },
    { 70, "普通",     "碧南",             "Hekinan",                        "#333333", "#FFFFFF", "三河線" },
    { 71, "普通",     "豊田市",           "Toyotashi",                      "#333333", "#FFFFFF", "三河線" },
    { 72, "普通",     "猿投",             "Sanage",                         "#333333", "#FFFFFF", "三河線" },
    { 73, "普通",     "蒲郡",             "Gamagori",                       "#333333", "#FFFFFF", "蒲郡線" },
    { 74, "急行",     "吉良吉田",         "Kira-Yoshida",                   "#005BAC", "#FFFFFF", "西尾線" },
    { 75, "普通",     "吉良吉田",         "Kira-Yoshida",                   "#333333", "#FFFFFF", "西尾線" },
    { 76, "急行",     "西尾",             "Nishio",                         "#005BAC", "#FFFFFF", "西尾線" },
    { 77, "普通",     "西尾",             "Nishio",                         "#333333", "#FFFFFF", "西尾線" },
    { 78, "普通",     "小牧",             "Komaki",                         "#333333", "#FFFFFF", "小牧線" },
    { 79, "普通",     "上飯田",           "Kamiiida",                       "#333333", "#FFFFFF", "小牧線" },
    { 80, "普通",     "玉ノ井",           "Tamanoi",                        "#333333", "#FFFFFF", "尾西線" },
    { 81, "急行",     "栄町",             "Sakaemachi",                     "#005BAC", "#FFFFFF", "瀬戸線" },
    { 82, "普通",     "栄町",             "Sakaemachi",                     "#333333", "#FFFFFF", "瀬戸線" },
    { 83, "急行",     "尾張瀬戸",         "Owari-Seto",                     "#005BAC", "#FFFFFF", "瀬戸線" },
    { 84, "普通",     "尾張瀬戸",         "Owari-Seto",                     "#333333", "#FFFFFF", "瀬戸線" },
    { 85, "普通",     "尾張旭",           "Owariasahi",                     "#333333", "#FFFFFF", "瀬戸線" },
    { 86, "普通",     "喜多山",           "Kitayama",                       "#333333", "#FFFFFF", "瀬戸線" },
    { 87, "快特",     "豊橋",             "Toyohashi",                      "#C8102E", "#FFFFFF", "快速特急" },
    { 88, "快特",     "新鵜沼",           "Shin-Unuma",                     "#C8102E", "#FFFFFF", "快速特急" },
    { 89, "ミュースカイ", "中部国際空港", "Central Japan Int'l Airport",    "#00205B", "#FFFFFF", "全車特別車" },
    { 90, "ミュースカイ", "名鉄名古屋",   "Meitetsu Nagoya",                "#00205B", "#FFFFFF", "全車特別車" },
    { 91, "ミュースカイ", "名鉄岐阜",     "Meitetsu Gifu",                  "#00205B", "#FFFFFF", "全車特別車" },
    { 92, "臨時",     "臨時",             "Extra",                          "#C8102E", "#FFFFFF", "イベント" },
    { 99, "締切",     "締切",             "Closed",                         "#555555", "#FFFFFF", "非営業" }
};

static const size_t MEITETSU_ROLLSIGN_COUNT = sizeof(MEITETSU_ROLLSIGN_TABLE) / sizeof(MEITETSU_ROLLSIGN_TABLE[0]);

// コマ番号から対照データを検索するヘルパー関数
inline const RollsignDestination* getRollsignEntryByCode(uint8_t code) {
    for (size_t i = 0; i < MEITETSU_ROLLSIGN_COUNT; i++) {
        if (MEITETSU_ROLLSIGN_TABLE[i].code == code) {
            return &MEITETSU_ROLLSIGN_TABLE[i];
        }
    }
    return nullptr;
}
