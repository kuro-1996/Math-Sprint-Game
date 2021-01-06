$(document).ready(function () {
	var levelSelect = $(".game-level input");
	var startBtn = $(".game-start");
	var level = $(".game-level");
	var countDown = $(".countdown");
	var gameStage = $(".game-stage");
	var btnGroup = $(".btn_group");
	var btnWrong = $(".btn-danger");
	var btnRight = $(".btn-success");
	var highlight = $(".highlight");
	var gameResult = $(".game-result");

	levelSelect.each(function () {
		$(this).change(function () {
			startBtn.removeClass("disabled");
			$(".game-level label").removeClass("active");
			if ($(this).is(":checked")) {
				$(this).parent("label").addClass("active");
			}
		});
	});

	if (!$(".game-level input:checked").val()) {
		startBtn.addClass("disabled");
	}

	startBtn.click(function () {
		if (!startBtn.hasClass("disabled")) {
			level.css("display", "none");
			gameStage.css("display", "block");
			countDown.css("display", "flex");
			var second = 3;
			var interval = setInterval(function () {
				second--;
				if (second >= 0) {
					countDown.text(second);
				} else if (second === -1) {
					countDown.text("Go!");
				} else {
					countDown.css("display", "none");
					startBtn.css("display", "none");
					highlight.css("display", "block");
					btnGroup.css("display", "flex");
					createQuestion($(".game-level input:checked").val());
					renderQuestion(equationArray);
					clearInterval(interval);
				}
			}, 1000);
		}
	});

	btnWrong.click(function () {
		select(false);
	});

	btnRight.click(function () {
		select(true);
	});

	var firstNumber = 0;
	var secondNumber = 0;
	var equationObj = {};
	var equationArray = [];
	var wrongEquationFormat = [];
	var playerEquationArray = [];
	var scrollCount = 0;
	var wrongAnswers = 0;

	function select(result) {
		scrollCount += 80;
		if (playerEquationArray.length < $(".game-level input:checked").val()) {
			$(".card-body").animate(
				{
					scrollTop: scrollCount,
				},
				200
			);
			playerEquationArray.push(result);

			if (
				playerEquationArray.length === +$(".game-level input:checked").val()
			) {
				gameStage.css("display", "none");
				gameResult.css("display", "block");
				compare();
			}
		}
	}

	function compare() {
		const evaluatedArray = equationArray.map(function (item) {
			return item.evaluated;
		});

		console.log(evaluatedArray);
		

		var difference = evaluatedArray.filter(
			(x) => !playerEquationArray.includes(x)
		);
		console.log(difference);
	}

	// create random number
	function randomInt(limit) {
		return Math.floor(Math.random() * Math.floor(limit + 1));
	}

	function createQuestion(questNumber) {
		rightEquation = randomInt(9);
		wrongEquation = questNumber - rightEquation;

		//right equations
		for (var i = 1; i <= rightEquation; i++) {
			firstNumber = randomInt(9);
			secondNumber = randomInt(9);
			const result = firstNumber * secondNumber;
			const equation = `${firstNumber} x ${secondNumber} = ${result}`;
			equationObj = {
				value: equation,
				evaluated: "true",
			};
			equationArray.push(equationObj);
		}

		//wrong equations
		for (var j = 1; j <= wrongEquation; j++) {
			firstNumber = randomInt(9);
			secondNumber = randomInt(9);
			const result = firstNumber * secondNumber;
			wrongEquationFormat[0] = `${firstNumber} x ${secondNumber} = ${
				result - 1
			}`;
			wrongEquationFormat[1] = `${
				firstNumber + 1
			} x ${secondNumber} = ${result}`;
			wrongEquationFormat[2] = `${firstNumber} x ${
				secondNumber + 1
			} = ${result}`;
			index = randomInt(2);
			const equation = wrongEquationFormat[index];
			equationObj = {
				value: equation,
				evaluated: "false",
			};
			equationArray.push(equationObj);
		}

		shuffle(equationArray);
	}

	function shuffle(array) {
		let counter = array.length;

		// While there are elements in the array
		while (counter > 0) {
			// Pick a random index
			let index = Math.floor(Math.random() * counter);

			// Decrease counter by 1
			counter--;

			// And swap the last element with it
			let temp = array[counter];
			array[counter] = array[index];
			array[index] = temp;
		}

		return array;
	}

	function renderQuestion(array) {
		array.forEach(function (item) {
			gameStage.append(`<p>${item.value}</p>`);
		});
		gameStage.append('<div class="height-385"></div>');
	}
});
