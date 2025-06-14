/**
 * Collection management module
 */
class CollectionManager {
  constructor() {
    this.collectedIslands = [];
    this.STORAGE_KEY = "islandGachaCollection";
  }

  /**
   * ローカルストレージからコレクションを読み込む
   */
  loadCollection() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      this.collectedIslands = data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("コレクション読み込みエラー:", error);
      this.collectedIslands = [];
    }
    return this.collectedIslands;
  }

  /**
   * ローカルストレージにコレクションを保存する
   */
  saveCollection() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.collectedIslands));
      return true;
    } catch (error) {
      console.error("コレクション保存エラー:", error);
      return false;
    }
  }

  /**
   * 島をコレクションに追加する
   * @param {Object} island - 追加する島のオブジェクト
   * @returns {boolean} 新しく追加された場合はtrue、すでにあった場合はfalse
   */
  addToCollection(island) {
    if (!island || !island.name) {
      return false;
    }

    // すでにコレクションに存在するかチェック
    const isNew = !this.collectedIslands.some((item) => item.name === island.name);

    if (isNew) {
      this.collectedIslands.push(island);
      this.saveCollection();
    }

    return isNew;
  }

  /**
   * コレクションをリセットする
   */
  resetCollection() {
    this.collectedIslands = [];
    this.saveCollection();
  }

  /**
   * コレクション内の島の数を取得
   * @returns {number} コレクション内の島の数
   */
  getCollectionCount() {
    return this.collectedIslands.length;
  }

  /**
   * コレクション内の島のリストを取得（ソート済み）
   * @returns {Array} 島のリスト
   */
  getSortedCollection() {
    const rarityOrder = { SSR: 0, SR: 1, R: 2, N: 3 };

    return [...this.collectedIslands].sort((a, b) => {
      // まずレアリティでソート
      const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
      if (rarityDiff !== 0) return rarityDiff;

      // レアリティが同じなら名前でソート
      return a.name.localeCompare(b.name, "ja");
    });
  }
}
