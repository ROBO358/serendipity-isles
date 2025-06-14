/**
 * Island data management module
 */
class IslandDataManager {
  constructor() {
    this.islandsData = [];
    this.loadingFailed = false;

    // レアリティの数値からラベルへのマッピング
    this.rarityMapping = {
      1: "SSR", // 最高レアリティ
      2: "SR", // 高レアリティ
      3: "R", // レア
      4: "N", // ノーマル
      5: "N", // 5もノーマルとして扱う (データの整合性のため)
    };
  }

  /**
   * 島データを読み込む
   * @returns {Promise<boolean>} 成功したらtrue、失敗したらfalse
   */
  async loadIslandsData() {
    try {
      const response = await fetch("data/islands.json");
      if (!response.ok) {
        throw new Error(`島データの読み込みに失敗しました (ステータス: ${response.status})`);
      }

      const data = await response.json();

      // JSONデータを表示用に変換し、必要なプロパティがnullやundefinedでない項目だけを使用
      this.islandsData = data
        .filter((island) => island.name && island.prefecture)
        .map((island) => ({
          name: island.name,
          yomikata: island.yomikata,
          prefecture: island.prefecture,
          description: island.description,
          lat: island.latitude,
          lon: island.longitude,
          rarity: this.rarityMapping[island.rarity] || "N", // rarity値が見つからない場合は"N"をデフォルトとする
        }));

      return this.islandsData.length > 0;
    } catch (error) {
      console.error("島データの読み込みエラー:", error);
      this.loadingFailed = true;
      return false;
    }
  }

  /**
   * ガチャを引く
   * @returns {Object|null} 選択された島、失敗した場合はnull
   */
  drawGacha() {
    if (this.islandsData.length === 0) {
      return null;
    }

    const rarityTable = { SSR: 0.05, SR: 0.1, R: 0.2, N: 0.65 };
    const rand = Math.random();
    let cumulativeProb = 0;
    let selectedRarity = "N"; // デフォルトはN

    // レアリティを確率で選ぶ
    for (const rarity in rarityTable) {
      cumulativeProb += rarityTable[rarity];
      if (rand < cumulativeProb) {
        selectedRarity = rarity;
        break;
      }
    }

    // 選ばれたレアリティの島をフィルタ
    const islandsOfRarity = this.islandsData.filter((island) => island.rarity === selectedRarity);

    // レアリティに該当する島がない場合は、全体からランダム選択
    if (islandsOfRarity.length === 0) {
      const randomIndex = Math.floor(Math.random() * this.islandsData.length);
      return this.islandsData[randomIndex];
    }

    // 選択したレアリティから1つをランダム選択
    const randomIndex = Math.floor(Math.random() * islandsOfRarity.length);
    return islandsOfRarity[randomIndex];
  }

  /**
   * 全島の数を取得
   * @returns {number} 島の総数
   */
  getTotalIslandsCount() {
    return this.islandsData.length;
  }

  /**
   * データ読み込みの失敗状態を取得
   * @returns {boolean} 読み込みが失敗したかどうか
   */
  hasLoadingFailed() {
    return this.loadingFailed;
  }
}
