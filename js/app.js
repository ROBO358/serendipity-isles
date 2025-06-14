/**
 * Main application class
 */
class IslandGachaApp {
  constructor() {
    // DOM 要素の参照を保持
    this.elements = {
      gachaButton: document.getElementById("gacha-button"),
      resultCard: document.getElementById("result-card"),
      initialState: document.getElementById("initial-state"),
      resultState: document.getElementById("result-state"),
      rarityDisplay: document.getElementById("rarity-display"),
      islandName: document.getElementById("island-name"),
      islandPrefecture: document.getElementById("island-prefecture"),
      islandDescription: document.getElementById("island-description"),
      mapLink: document.getElementById("map-link"),
      newBadge: document.getElementById("new-badge"),
      collectionGrid: document.getElementById("collection-grid"),
      collectionCount: document.getElementById("collection-count"),
      totalCount: document.getElementById("total-count"),
      resetCollectionButton: document.getElementById("reset-collection-button"),
      confirmModal: document.getElementById("confirm-modal"),
      confirmResetButton: document.getElementById("confirm-reset-button"),
      cancelResetButton: document.getElementById("cancel-reset-button"),
      loadingIndicator: document.getElementById("loading-indicator"),
      errorMessage: document.getElementById("error-message"),
    };

    // サブモジュールのインスタンス化
    this.dataManager = new IslandDataManager();
    this.collectionManager = new CollectionManager();
    this.uiRenderer = new UIRenderer(this.elements, this.collectionManager);

    // 初期化フラグ
    this.initialized = false;
  }

  /**
   * アプリケーションの初期化
   */
  async init() {
    try {
      // UI初期状態を設定
      this.uiRenderer.setInitialState(true, false);
      this.uiRenderer.setGachaButtonState(false);

      // 島データの読み込み
      const dataLoaded = await this.dataManager.loadIslandsData();
      if (!dataLoaded) {
        throw new Error("有効な島データが見つかりませんでした");
      }

      // コレクションデータの読み込み
      this.collectionManager.loadCollection();

      // UI表示の更新
      this.uiRenderer.setInitialState(false, false);
      this.uiRenderer.setGachaButtonState(true);
      this.uiRenderer.renderCollection(this.dataManager.getTotalIslandsCount());

      // イベントリスナーの設定
      this.setupEventListeners();

      this.initialized = true;
    } catch (error) {
      console.error("初期化エラー:", error);
      this.uiRenderer.setInitialState(false, true);
      this.uiRenderer.setGachaButtonState(false);
      this.initialized = false;
    }
  }

  /**
   * イベントリスナーのセットアップ
   */
  setupEventListeners() {
    // ガチャボタンクリック
    this.elements.gachaButton.addEventListener("click", () => this.onGachaButtonClick());

    // コレクションリセットボタン
    this.elements.resetCollectionButton.addEventListener("click", () => this.uiRenderer.showConfirmModal());

    // モーダルの「いいえ」ボタン
    this.elements.cancelResetButton.addEventListener("click", () => this.uiRenderer.hideConfirmModal());

    // モーダルの「はい」ボタン
    this.elements.confirmResetButton.addEventListener("click", () => this.onConfirmReset());

    // モーダルの外側クリック
    this.elements.confirmModal.addEventListener("click", (e) => {
      if (e.target === this.elements.confirmModal) {
        this.uiRenderer.hideConfirmModal();
      }
    });
  }

  /**
   * ガチャボタンクリック時の処理
   */
  onGachaButtonClick() {
    // 島データチェック
    if (!this.initialized) {
      this.uiRenderer.showError("システムが正しく初期化されていません。ページを再読み込みしてください。");
      return;
    }

    try {
      // ガチャを引く
      const selectedIsland = this.dataManager.drawGacha();
      if (!selectedIsland) {
        throw new Error("有効な島データが取得できませんでした");
      }

      // コレクションに追加
      const isNew = this.collectionManager.addToCollection(selectedIsland);

      // UI更新
      this.uiRenderer.updateResultCard(selectedIsland, isNew);
      this.uiRenderer.renderCollection(this.dataManager.getTotalIslandsCount());
      this.uiRenderer.hideError();
    } catch (error) {
      console.error("ガチャ実行エラー:", error);
      this.uiRenderer.showError("ガチャの実行中にエラーが発生しました。もう一度試してください。");
    }
  }

  /**
   * コレクションリセット確認時の処理
   */
  onConfirmReset() {
    this.collectionManager.resetCollection();
    this.uiRenderer.renderCollection(this.dataManager.getTotalIslandsCount());
    this.uiRenderer.hideConfirmModal();
  }
}

// DOMContentLoadedイベントでアプリ初期化
document.addEventListener("DOMContentLoaded", () => {
  const app = new IslandGachaApp();
  app.init();
});
