// namespace LuminariesApplication
const LuminariesApplication = (() => {

	// ============================================================
	// class データ読込管理
	// ============================================================
	class データ読込管理 {

		// <summary>TSVを読み込み配列に変換する</summary>
		static 読み込む(tsv内容) {
			try {
				if (tsv内容 == null) {
					console.error("TSV内容がnullです");
					return [];
				}

				const 行一覧 = tsv内容.split("\n");
				const 結果一覧 = [];

				for (const 行 of 行一覧) {
					if (行.trim() == "") {
						continue;
					}

					const 列 = 行.split("\t");
					if (列.length < 4) {
						console.warn("列数不足: " + 行);
						continue;
					}

					const 記号 = 列[0].trim();
					const 名前 = 列[1].trim();
					const 職業または影響 = 列[2].trim();
					const 星座または惑星名 = 列[3].trim();
					const 章位置 = 列.length >= 5 ? 列[4].trim() : "";

					const 種類 = データ読込管理.種類判定(記号);

					結果一覧.push({
						種類: 種類,
						記号: 記号,
						名前: 名前,
						職業または影響: 職業または影響,
						星座または惑星名: 星座または惑星名,
						章位置: 章位置,
						詳細データ: ""
					});
				}

				return 結果一覧;

			} catch (例外) {
				console.error("TSV読込例外: ", 例外);
				return [];
			}
		}

		// <summary>記号から種類を判定する</summary>
		static 種類判定(記号) {
			const 恒星記号一覧 = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
			const 惑星記号一覧 = ["☿", "♀", "♂", "♃", "♄", "☽", "☉"];
			const 地球記号一覧 = ["⊕"];

			if (恒星記号一覧.includes(記号)) return "恒星";
			if (惑星記号一覧.includes(記号)) return "惑星";
			if (地球記号一覧.includes(記号)) return "地球";

			return "不明";
		}
	}

	// ============================================================
	// class 円描画管理
	// ============================================================
	class 円描画管理 {

		// <summary>SVGにtitle要素を追加する</summary>
		static タイトル追加(svg要素, 親要素, 内容) {
			try {
				const タイトル要素 = document.createElementNS("http://www.w3.org/2000/svg", "title");
				タイトル要素.textContent = 内容;
				親要素.appendChild(タイトル要素);
			} catch (例外) {
				console.error("タイトル追加例外: ", 例外);
			}
		}

		// <summary>SVGに円と人物を描画する</summary>
		static 描画する(人物一覧, 選択章) {
			try {
				if (人物一覧 == null || 人物一覧.length == 0) {
					console.error("人物一覧が空です");
					return;
				}

				const svg要素 = document.getElementById("円図");
				if (svg要素 == null) {
					console.error("SVG要素が存在しません");
					return;
				}

				svg要素.innerHTML = "";

				const 中心X = 350;
				const 中心Y = 350;
				const 半径 = 250;

				// ============================================================
				// 円周線
				// ============================================================
				const 円周線 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
				円周線.setAttribute("cx", 中心X);
				円周線.setAttribute("cy", 中心Y);
				円周線.setAttribute("r", 半径);
				円周線.setAttribute("class", "円周線");
				svg要素.appendChild(円周線);

				// ============================================================
				// パイ線（12分割）→ 15度ずらす（π/12）
				// ============================================================
				const ずらし角度 = Math.PI / 12; // 15度

				for (let i = 0; i < 12; i++) {
					const 角度 = (i / 12) * Math.PI * 2 + ずらし角度;
					const 終点X = 中心X + Math.cos(角度) * 半径;
					const 終点Y = 中心Y + Math.sin(角度) * 半径;

					const パイ線 = document.createElementNS("http://www.w3.org/2000/svg", "line");
					パイ線.setAttribute("x1", 中心X);
					パイ線.setAttribute("y1", 中心Y);
					パイ線.setAttribute("x2", 終点X);
					パイ線.setAttribute("y2", 終点Y);
					パイ線.setAttribute("class", "パイ線");
					svg要素.appendChild(パイ線);
				}

				// ============================================================
				// 恒星（円周）
				// ============================================================
				const 恒星一覧 = 人物一覧.filter(x => x.種類 == "恒星");

				恒星一覧.forEach((項目, index) => {
					const 角度 = (index / 恒星一覧.length) * Math.PI * 2;

					const 外側X = 中心X + Math.cos(角度) * (半径 + 40);
					const 外側Y = 中心Y + Math.sin(角度) * (半径 + 40);

					const 内側X = 中心X + Math.cos(角度) * (半径 - 30);
					const 内側Y = 中心Y + Math.sin(角度) * (半径 - 30);

					// 記号（外側）
					const 記号要素 = document.createElementNS("http://www.w3.org/2000/svg", "text");
					記号要素.setAttribute("x", 外側X);
					記号要素.setAttribute("y", 外側Y);
					記号要素.textContent = 項目.記号;

					円描画管理.タイトル追加(svg要素, 記号要素,
						"星座: " + 項目.星座または惑星名 + "\n" +
						"ハウス: 未入力\n" +
						"詳細: " + (項目.詳細データ || "未入力")
					);

					svg要素.appendChild(記号要素);

					// 名前（内側）
					const 名前要素 = document.createElementNS("http://www.w3.org/2000/svg", "text");
					名前要素.setAttribute("x", 内側X);
					名前要素.setAttribute("y", 内側Y);

					const 名前分割 = 項目.名前.split("・");
					const 名字 = 名前分割[名前分割.length - 1];

					名前要素.textContent = 名字;

					円描画管理.タイトル追加(svg要素, 名前要素,
						"名前: " + 項目.名前 + "\n" +
						"職業: " + 項目.職業または影響
					);

					svg要素.appendChild(名前要素);
				});

				// ============================================================
				// 惑星（章ごとの位置）
				// ============================================================
				const 惑星一覧 = 人物一覧.filter(x => x.種類 == "惑星");

				惑星一覧.forEach((項目) => {

					if (項目.章位置 == null || 項目.章位置.trim() == "") {
						return;
					}

					const 章位置一覧 = 項目.章位置.split(",");

					const 対象章位置 = 章位置一覧.find(x => x.startsWith(選択章));

					if (対象章位置 == null) {
						return;
					}

					const 星座記号 = 対象章位置.replace(/[0-9]/g, "");

					const 星座一覧 = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
					const 星座インデックス = 星座一覧.indexOf(星座記号);

					if (星座インデックス == -1) {
						return;
					}

					const 角度 = (星座インデックス / 12) * Math.PI * 2;
					const 惑星X = 中心X + Math.cos(角度) * (半径 * 0.5);
					const 惑星Y = 中心Y + Math.sin(角度) * (半径 * 0.5);

					const 惑星要素 = document.createElementNS("http://www.w3.org/2000/svg", "text");
					惑星要素.setAttribute("x", 惑星X);
					惑星要素.setAttribute("y", 惑星Y);
					惑星要素.textContent = 項目.記号;

					円描画管理.タイトル追加(svg要素, 惑星要素,
						"名前: " + 項目.名前 + "\n" +
						"影響: " + 項目.職業または影響 + "\n" +
						"章位置: " + 項目.章位置 + "\n" +
						"詳細: " + (項目.詳細データ || "未入力")
					);

					svg要素.appendChild(惑星要素);
				});

				// ============================================================
				// 地球（中央）
				// ============================================================
				const 地球一覧 = 人物一覧.filter(x => x.種類 == "地球");
				if (地球一覧.length > 0) {
					const 項目 = 地球一覧[0];
					const 地球要素 = document.createElementNS("http://www.w3.org/2000/svg", "text");
					地球要素.setAttribute("x", 中心X);
					地球要素.setAttribute("y", 中心Y);
					地球要素.textContent = 項目.記号;

					円描画管理.タイトル追加(svg要素, 地球要素,
						"名前: " + 項目.名前 + "\n" +
						"影響: " + 項目.職業または影響 + "\n" +
						"詳細: " + (項目.詳細データ || "未入力")
					);

					svg要素.appendChild(地球要素);
				}

			} catch (例外) {
				console.error("描画例外: ", 例外);
			}
		}
	}

	// ============================================================
	// class 起動管理
	// ============================================================
	class 起動管理 {

		static 現在章 = "1";

		// <summary>TSVを読み込み描画する</summary>
		static 初期化する() {
			try {
				fetch("data.tsv")
					.then(response => response.text())
					.then(tsv内容 => {
						const 人物一覧 = データ読込管理.読み込む(tsv内容);
						起動管理.人物一覧 = 人物一覧;
						円描画管理.描画する(人物一覧, 起動管理.現在章);
					})
					.catch(例外 => {
						console.error("fetch例外: ", 例外);
					});

			} catch (例外) {
				console.error("初期化例外: ", 例外);
			}
		}

		// <summary>章変更時に再描画する</summary>
		static 章変更する(章) {
			try {
				起動管理.現在章 = 章;
				円描画管理.描画する(起動管理.人物一覧, 章);

			} catch (例外) {
				console.error("章変更例外: ", 例外);
			}
		}
	}

	return {
		起動管理: 起動管理
	};

})();
