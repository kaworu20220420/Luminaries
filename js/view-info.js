// ============================================================
// namespace LuminariesApplication 情報表示管理
// ============================================================
const LuminariesApplication_ViewInfo = (() => {

	class 情報表示管理 {

		// <summary>クリックされた人物の情報をテーブル表示する</summary>
		static 表示する(項目) {
			try {
				const コンテナ = document.getElementById("情報テーブルコンテナ");
				if (コンテナ == null) return;

				// クリア
				コンテナ.innerHTML = "";

				// ============================================================
				// 背景記号（データの後ろに敷く）
				// ============================================================
				const 背景記号 = document.createElement("div");
				背景記号.style.fontSize = "240px";   // 15倍相当
				背景記号.style.opacity = "0.2";
				背景記号.style.textAlign = "center";
				背景記号.style.fontFamily = "Noto Serif JP";
				背景記号.style.position = "absolute";
				背景記号.style.left = "0";
				背景記号.style.right = "0";
				背景記号.style.top = "20px";
				背景記号.style.pointerEvents = "none"; // クリックを邪魔しない
				背景記号.textContent = 項目.記号;

				// コンテナを相対配置にして背景を重ねられるようにする
				コンテナ.style.position = "relative";
				コンテナ.appendChild(背景記号);

				// ============================================================
				// テーブル生成（背景の上に重ねる）
				// ============================================================
				const テーブル = document.createElement("table");
				テーブル.id = "情報テーブル";
				テーブル.style.position = "relative"; // 背景より前面
				テーブル.style.zIndex = "10";

				// ============================================================
				// データ行生成関数
				// ============================================================
				const 行 = (左, 右) => {
					const tr = document.createElement("tr");

					const td1 = document.createElement("td");
					td1.textContent = 左;

					const td2 = document.createElement("td");
					td2.textContent = 右;

					tr.appendChild(td1);
					tr.appendChild(td2);
					return tr;
				};

				// ============================================================
				// 種類別レイアウト
				// ============================================================
				if (項目.種類 == "恒星") {

					テーブル.appendChild(行("名前", 項目.名前));
					テーブル.appendChild(行("職業", 項目.職業または影響));

					テーブル.appendChild(行("星座名", 項目.星座または惑星名));
					テーブル.appendChild(行("ハウス", 項目.章位置 || "未入力"));

					テーブル.appendChild(行("詳細データ", 項目.詳細データ || "未入力"));
				}

				else if (項目.種類 == "惑星") {

					テーブル.appendChild(行("名前", 項目.名前));
					テーブル.appendChild(行("影響", 項目.職業または影響));

					テーブル.appendChild(行("惑星名", 項目.星座または惑星名));

					// 章位置は表示しない

					テーブル.appendChild(行("詳細データ", 項目.詳細データ || "未入力"));
				}

				else if (項目.種類 == "地球") {

					テーブル.appendChild(行("名前", 項目.名前));
					テーブル.appendChild(行("影響", 項目.職業または影響));

					テーブル.appendChild(行("地球", 項目.星座または惑星名));

					テーブル.appendChild(行("詳細データ", 項目.詳細データ || "未入力"));
				}

				else {
					// 不明データは従来通り
					テーブル.appendChild(行("記号", 項目.記号));
					テーブル.appendChild(行("名前", 項目.名前));
					テーブル.appendChild(行("職業または影響", 項目.職業または影響));
					テーブル.appendChild(行("星座または惑星名", 項目.星座または惑星名));
					テーブル.appendChild(行("章位置", 項目.章位置 || "未入力"));
					テーブル.appendChild(行("詳細データ", 項目.詳細データ || "未入力"));
				}

				// テーブル追加
				コンテナ.appendChild(テーブル);

			} catch (例外) {
				console.error("情報表示例外: ", 例外);
			}
		}
	}

	return {
		情報表示管理
	};

})();
