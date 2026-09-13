// ============================================================
// namespace LuminariesApplication 起動管理
// ============================================================
const LuminariesApplication = (() => {

	// ============================================================
	// class 起動管理
	// ============================================================
	class 起動管理 {

		static 現在章 = "1";
		static 人物一覧 = [];

		// <summary>TSVを読み込み描画する</summary>
		static 初期化する() {
			try {
				fetch("data.tsv")
					.then(response => response.text())
					.then(tsv内容 => {

						// データ読込管理（別ファイル）
						const 読込結果 = LuminariesApplication_DataLoader.データ読込管理.読み込む(tsv内容);
						起動管理.人物一覧 = 読込結果;

						// 円描画管理（別ファイル）
						LuminariesApplication_ViewCircle.円描画管理.描画する(
							起動管理.人物一覧,
							起動管理.現在章
						);
					})
					.catch(例外 => console.error("fetch例外: ", 例外));

			} catch (例外) {
				console.error("初期化例外: ", 例外);
			}
		}

		// <summary>章変更時に再描画する</summary>
		static 章変更する(章) {
			try {
				起動管理.現在章 = 章;

				LuminariesApplication_ViewCircle.円描画管理.描画する(
					起動管理.人物一覧,
					章
				);

			} catch (例外) {
				console.error("章変更例外: ", 例外);
			}
		}
	}

	return {
		起動管理
	};

})();
