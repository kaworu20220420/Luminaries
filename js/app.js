// ============================================================
// namespace LuminariesApplication 起動管理＋円描画管理
// ============================================================
const LuminariesApplication = (() => {

	// ============================================================
	// class 円描画管理
	// ============================================================
	class 円描画管理 {

		// <summary>SVGにtitle要素を追加する</summary>
		static タイトル追加(親要素, 内容) {
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
				if (!人物一覧 || 人物一覧.length == 0) return;

				const svg要素 = document.getElementById("円図");
				if (!svg要素) return;

				svg要素.innerHTML = "";

				const 中心X = 350;
				const 中心Y = 350;
				const 半径 = 250;

				const 回転角度 = (345 * Math.PI) / 180;

				// 円周線
				const 円周線 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
				円周線.setAttribute("cx", 中心X);
				円周線.setAttribute("cy", 中心Y);
				円周線.setAttribute("r", 半径);
				円周線.setAttribute("class", "円周線");
				svg要素.appendChild(円周線);

				// パイ線（12分割）
				const ずらし角度 = Math.PI / 12;

				for (let i = 0; i < 12; i++) {
					const 角度 = (i / 12) * Math.PI * 2 + ずらし角度 + 回転角度;
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

				// 恒星（円周）
				const 恒星一覧 = 人物一覧.filter(x => x.種類 == "恒星");

				恒星一覧.forEach((項目, index) => {

					const 角度 = (index / 12) * Math.PI * 2 + 回転角度;

					const 外側X = 中心X + Math.cos(角度) * (半径 + 40);
					const 外側Y = 中心Y + Math.sin(角度) * (半径 + 40);

					const 内側X = 中心X + Math.cos(角度) * (半径 - 30);
					const 内側Y = 中心Y + Math.sin(角度) * (半径 - 30);

					// 記号（外側）
					const 記号要素 = document.createElementNS("http://www.w3.org/2000/svg", "text");
					記号要素.setAttribute("x", 外側X);
					記号要素.setAttribute("y", 外側Y);
					記号要素.textContent = 項目.記号;
					記号要素.setAttribute("class", "恒星記号");

					円描画管理.タイトル追加(記号要素,
						"星座: " + 項目.星座または惑星名 + "\n" +
						"ハウス: " + (項目.章位置 || "未入力") + "\n" +
						"詳細: " + (項目.詳細データ || "未入力")
					);

					記号要素.addEventListener("click", () => {
						LuminariesApplication_ViewInfo.情報表示管理.表示する(項目);
					});

					svg要素.appendChild(記号要素);

					// 名前（円周に沿わせて回転）
					const 名前要素 = document.createElementNS("http://www.w3.org/2000/svg", "text");
					名前要素.setAttribute("x", 内側X);
					名前要素.setAttribute("y", 内側Y);

					const 名前分割 = 項目.名前.split("・");
					const 名字 = 名前分割[名前分割.length - 1];
					名前要素.textContent = 名字;

					const 回転度数 = (角度 * 180 / Math.PI) + 90;
					名前要素.setAttribute("transform", `rotate(${回転度数} ${内側X} ${内側Y})`);

					円描画管理.タイトル追加(名前要素,
						"名前: " + 項目.名前 + "\n" +
						"職業: " + 項目.職業または影響
					);

					名前要素.addEventListener("click", () => {
						LuminariesApplication_ViewInfo.情報表示管理.表示する(項目);
					});

					svg要素.appendChild(名前要素);
				});

				// 惑星（章ごとの位置）
				const 惑星一覧 = 人物一覧.filter(x => x.種類 == "惑星");

				// レイヤー半径（外側→内側）
				const 惑星レイヤー半径一覧 = [
					半径 * 0.70,
					半径 * 0.55,
					半径 * 0.35
				];

				惑星一覧.forEach((項目, index) => {
					try {
						if (!項目.章位置) return;

						const 章位置一覧 = 項目.章位置.split(",");
						const 対象章位置 = 章位置一覧.find(x => x.startsWith(選択章));
						if (!対象章位置) return;

						const 星座記号 = 対象章位置.replace(/[0-9]/g, "");

						const 星座一覧 = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
						const 星座インデックス = 星座一覧.indexOf(星座記号);
						if (星座インデックス == -1) return;

						const 角度 = (星座インデックス / 12) * Math.PI * 2 + 回転角度;

						// ★ 惑星レイヤー割り当て（順番ローテーション）
						const レイヤーインデックス = index % 3;
						const 使用半径 = 惑星レイヤー半径一覧[レイヤーインデックス];

						const 惑星X = 中心X + Math.cos(角度) * 使用半径;
						const 惑星Y = 中心Y + Math.sin(角度) * 使用半径;

						const 惑星要素 = document.createElementNS("http://www.w3.org/2000/svg", "text");
						惑星要素.setAttribute("x", 惑星X);
						惑星要素.setAttribute("y", 惑星Y);
						惑星要素.textContent = 項目.記号;
						惑星要素.setAttribute("class", "惑星記号");

						円描画管理.タイトル追加(惑星要素,
							"名前: " + 項目.名前 + "\n" +
							"影響: " + 項目.職業または影響 + "\n" +
							"章位置: " + 項目.章位置 + "\n" +
							"詳細: " + (項目.詳細データ || "未入力")
						);

						惑星要素.addEventListener("click", () => {
							LuminariesApplication_ViewInfo.情報表示管理.表示する(項目);
						});

						svg要素.appendChild(惑星要素);

					} catch (例外) {
						console.error("惑星描画例外: ", 例外);
					}
				});


				// 地球（中央）
				const 地球一覧 = 人物一覧.filter(x => x.種類 == "地球");
				if (地球一覧.length > 0) {
					const 項目 = 地球一覧[0];

					const 地球要素 = document.createElementNS("http://www.w3.org/2000/svg", "text");
					地球要素.setAttribute("x", 中心X);
					地球要素.setAttribute("y", 中心Y);
					地球要素.textContent = 項目.記号;
					地球要素.setAttribute("class", "地球記号");

					円描画管理.タイトル追加(地球要素,
						"名前: " + 項目.名前 + "\n" +
						"影響: " + 項目.職業または影響 + "\n" +
						"詳細: " + (項目.詳細データ || "未入力")
					);

					地球要素.addEventListener("click", () => {
						LuminariesApplication_ViewInfo.情報表示管理.表示する(項目);
					});

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
		static 人物一覧 = [];

		// <summary>TSVを読み込み描画する</summary>
		static 初期化する() {
			try {
				fetch("data.tsv")
					.then(response => response.text())
					.then(tsv内容 => {

						const 読込結果 = LuminariesApplication_DataLoader.データ読込管理.読み込む(tsv内容);
						起動管理.人物一覧 = 読込結果;

						円描画管理.描画する(
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

				円描画管理.描画する(
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
