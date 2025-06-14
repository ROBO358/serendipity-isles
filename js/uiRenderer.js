/**
 * UI Renderer module
 */
class UIRenderer {
  constructor(elements, collectionManager) {
    this.elements = elements;
    this.collectionManager = collectionManager;
  }

  /**
   * 初期状態を設定
   * @param {boolean} isLoading - 読み込み中かどうか
   * @param {boolean} hasError - エラーがあるかどうか
   */
  setInitialState(isLoading, hasError) {
    if (isLoading) {
      this.showLoading();
    } else if (hasError) {
      this.showLoadingError();
    } else {
      this.hideLoading();
    }
  }

  /**
   * ローディング表示
   */
  showLoading() {
    if (this.elements.loadingIndicator) {
      this.elements.loadingIndicator.style.display = "";
      this.elements.loadingIndicator.textContent = "島データをロード中...";
      this.elements.loadingIndicator.classList.remove("text-red-500");
      this.elements.loadingIndicator.classList.add("text-blue-500");
    }
  }

  /**
   * ローディングエラー表示
   */
  showLoadingError() {
    if (this.elements.loadingIndicator) {
      this.elements.loadingIndicator.style.display = "";
      this.elements.loadingIndicator.textContent = "データの読み込みに失敗しました。再読み込みしてください。";
      this.elements.loadingIndicator.classList.remove("text-blue-500");
      this.elements.loadingIndicator.classList.add("text-red-500");
    }
  }

  /**
   * ローディング非表示
   */
  hideLoading() {
    if (this.elements.loadingIndicator) {
      this.elements.loadingIndicator.style.display = "none";
    }
  }

  /**
   * ガチャボタンの有効/無効を設定
   * @param {boolean} enabled - 有効にするかどうか
   */
  setGachaButtonState(enabled) {
    if (this.elements.gachaButton) {
      this.elements.gachaButton.disabled = !enabled;
      if (enabled) {
        this.elements.gachaButton.classList.remove("opacity-50", "cursor-not-allowed");
      } else {
        this.elements.gachaButton.classList.add("opacity-50", "cursor-not-allowed");
      }
    }
  }

  /**
   * エラーメッセージの表示
   * @param {string} message - 表示するエラーメッセージ
   */
  showError(message) {
    const errorMessage = document.getElementById("error-message");
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.classList.remove("hidden");
    }
  }

  /**
   * エラーメッセージを非表示
   */
  hideError() {
    const errorMessage = document.getElementById("error-message");
    if (errorMessage) {
      errorMessage.classList.add("hidden");
    }
  }

  /**
   * 島情報の表示をアップデート
   * @param {Object} island - 表示する島のデータ
   * @param {boolean} isNew - 新しくコレクションに追加されたかどうか
   */
  updateResultCard(island, isNew) {
    this.elements.initialState.classList.add("hidden");
    this.elements.resultState.classList.remove("hidden", "card-reveal");

    // レアリティスタイル更新
    this.elements.resultCard.className = `backdrop-blur-sm rounded-2xl shadow-2xl p-6 min-h-[300px] flex flex-col justify-center items-center transition-all duration-300 relative rarity-${island.rarity.toLowerCase()}-bg`;
    this.elements.rarityDisplay.textContent = island.rarity;
    this.elements.rarityDisplay.className = `font-bold text-2xl mb-2 rarity-${island.rarity.toLowerCase()}-text`;

    this.elements.islandName.textContent = island.name || "名称不明";
    this.elements.islandPrefecture.textContent = island.prefecture || "";
    this.elements.islandDescription.textContent = island.description || "詳細情報はありません。";

    // 読み方があれば表示
    if (island.yomikata) {
      this.elements.islandName.title = island.yomikata;
    }

    // 緯度と経度の両方があれば地図リンクを有効に、なければ無効に
    if (island.lat && island.lon) {
      this.elements.mapLink.href = `https://www.google.com/maps?q=${island.lat},${island.lon}&z=11`;
      this.elements.mapLink.classList.remove("opacity-50", "cursor-not-allowed");
      this.elements.mapLink.classList.add("hover:bg-blue-600");
      this.elements.mapLink.removeAttribute("disabled");
    } else {
      this.elements.mapLink.href = "#";
      this.elements.mapLink.classList.add("opacity-50", "cursor-not-allowed");
      this.elements.mapLink.classList.remove("hover:bg-blue-600");
      this.elements.mapLink.setAttribute("disabled", "true");
    }

    // NEWバッジの表示/非表示
    if (isNew) {
      this.elements.newBadge.classList.remove("hidden");
    } else {
      this.elements.newBadge.classList.add("hidden");
    }

    // アニメーション効果を適用
    requestAnimationFrame(() => {
      this.elements.resultState.classList.add("card-reveal");
    });
  }

  /**
   * コレクション表示を更新
   * @param {number} totalIslands - 島の総数
   */
  renderCollection(totalIslands) {
    // コレクションデータを取得
    const sortedCollection = this.collectionManager.getSortedCollection();
    const collectionCount = this.collectionManager.getCollectionCount();

    // コレクション表示をクリア
    this.elements.collectionGrid.innerHTML = "";

    // コレクションを表示
    sortedCollection.forEach((island) => {
      const islandEl = document.createElement("div");
      islandEl.textContent = island.name;
      const rarityClass = `rarity-${island.rarity.toLowerCase()}-bg`;
      islandEl.className = `p-2 rounded-lg text-sm font-semibold truncate text-gray-700 ${rarityClass}`;
      islandEl.title = island.yomikata ? `${island.rarity} - ${island.name} (${island.yomikata})` : `${island.rarity} - ${island.name}`;
      this.elements.collectionGrid.appendChild(islandEl);
    });

    // カウンター更新
    this.elements.collectionCount.textContent = collectionCount;
    this.elements.totalCount.textContent = totalIslands || 0;
  }

  /**
   * 確認モーダルの表示
   */
  showConfirmModal() {
    this.elements.confirmModal.classList.remove("hidden");
  }

  /**
   * 確認モーダルを非表示
   */
  hideConfirmModal() {
    this.elements.confirmModal.classList.add("hidden");
  }
}
