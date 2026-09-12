// namespace LuminariesApplication
const LuminariesApplication = (() => {

	// class データ読込管理
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
						章位置: 章位置
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

	// class 円描画管理
	class 円描画管理 {

		// <summary>SVGに円と人物を描画する</summary>
		static 描画する(人物一覧) {
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

				const 中心X = 300;
				const 中心Y = 300;
				const 半径 = 200;

				// 恒星を円周に配置
				const 恒星一覧 = 人物一覧.filter(x => x.種類 == "恒星");
				恒星一覧.forEach((項目, index) => {
					const 角度 = (index / 恒星一覧.length) * Math.PI * 2;

					const 外側X = 中心X + Math.cos(角度) * (半径 + 40);
					const 外側Y = 中心Y + Math.sin(角度) * (半径 + 40);

					const 内側X = 中心X + Math.cos(角度) * (半径 - 20);
					const 内側Y = 中心Y + Math.sin(角度) * (半径 - 20);

					// 記号（外側）
					const 記号要素 = document.createElementNS("http://www.w3.org/2000/svg", "text");
					記号要素.setAttribute("x", 外側X);
					記号要素.setAttribute("y", 外側Y);
					記号要素.textContent = 項目.記号;
					記号要素.setAttribute("title",
						"星座: " + 項目.星座または惑星名 + "\n" +
						"ハウス: 未入力\n" +
						"詳細: 未入力"
					);
					svg要素.appendChild(記号要素);

					// 名前（内側）
					const 名前要素 = document.createElementNS("http://www.w3.org/2000/svg", "text");
					名前要素.setAttribute("x", 内側X);
					名前要素.setAttribute("y", 内側Y);
					const 名字 = 項目.名前.split("・").slice(-1)[0];
					名前要素.textContent = 名字;
					名前要素.setAttribute("title",
						"名前: " + 項目.名前 + "\n" +
						"職業: " + 項目.職業または影響
					);
					svg要素.appendChild(名前要素);
				});

				// 惑星（仮位置）
				const 惑星一覧 = 人物一覧.filter(x => x.種類 == "惑星");
				惑星一覧.forEach((項目, index) => {
					const 角度 = (index / 惑星一覧.length) * Math.PI * 2;
					const 惑星X = 中心X + Math.cos(角度) * (半径 * 0.5);
					const 惑星Y = 中心Y + Math.sin(角度) * (半径 * 0.5);

					const 惑星要素 = document.createElementNS("http://www.w3.org/2000/svg", "text");
					惑星要素.setAttribute("x", 惑星X);
					惑星要素.setAttribute("y", 惑星Y);
					惑星要素.textContent = 項目.記号;
					惑星要素.setAttribute("title",
						"名前: " + 項目.名前 + "\n" +
						"影響: " + 項目.職業または影響 + "\n" +
						"章位置: " + 項目.章位置 + "\n" +
						"詳細: 未入力"
					);
					svg要素.appendChild(惑星要素);
				});

				// 地球（中央）
				const 地球一覧 = 人物一覧.filter(x => x.種類 == "地球");
				if (地球一覧.length > 0) {
					const 項目 = 地球一覧[0];
					const 地球要素 = document.createElementNS("http://www.w3.org/2000/svg", "text");
					地球要素.setAttribute("x", 中心X);
					地球要素.setAttribute("y", 中心Y);
					地球要素.textContent = 項目.記号;
					地球要素.setAttribute("title",
						"名前: " + 項目.名前 + "\n" +
						"影響: " + 項目.職業または影響 + "\n" +
						"詳細: 未入力"
					);
					svg要素.appendChild(地球要素);
				}

			} catch (例外) {
				console.error("描画例外: ", 例外);
			}
		}
	}

	// class 起動管理
	class 起動管理 {

		// <summary>TSVを読み込み描画する</summary>
		static 初期化する() {
			try {
				fetch("data.tsv")
					.then(response => response.text())
					.then(tsv内容 => {
						const 人物一覧 = データ読込管理.読み込む(tsv内容);
						円描画管理.描画する(人物一覧);
					})
					.catch(例外 => {
						console.error("fetch例外: ", 例外);
					});

			} catch (例外) {
				console.error("初期化例外: ", 例外);
			}
		}
	}

	return {
		起動管理: 起動管理
	};

})();

// 呼び出し元
document.addEventListener("DOMContentLoaded", () => {
	LuminariesApplication.起動管理.初期化する();
});
