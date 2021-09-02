if (document.documentElement.classList.contains("light")) {
	document.querySelector("#favicon").href = "./img/favicon light.png"
}

const canvas = document.querySelector("#diagram");
const main = document.querySelector("main");

const functionIn = document.querySelector("#map-function");

document.querySelector("#plot-btn").addEventListener("click", (e) => {
	drawFunction(functionIn.value, "blue");
});

let size = Math.ceil(main.getBoundingClientRect().height / 1.25);
// Make size even if it isn't
size = size + size % 2;
const half = size/2;

canvas.width = size;
canvas.height = size;

const ctx = canvas.getContext("2d");

// Draw Axes
function drawAxes(extraWidth, offset) {
	extraWidth = extraWidth || 0;
	offset = offset || 0;

	if (extraWidth) {
		ctx.fillRect(offset, half - extraWidth, size - offset * 2, extraWidth*2);
		ctx.fillRect(half - extraWidth, offset, extraWidth*2, size - offset*2);
	} else {
		ctx.beginPath();
		ctx.moveTo(offset, half);
		ctx.lineTo(size - offset, half);
		ctx.closePath()
		
		ctx.moveTo(half, offset);
		ctx.lineTo(half, size - offset);
		ctx.closePath()
		ctx.stroke();
	}
}

// Draw arrows on the ends of axes
function drawArrows(width, height) {
	width = width || 3;
	height = height || 5;
	// top
	ctx.beginPath();
	ctx.moveTo(half, 0);
	ctx.lineTo(half + width, height);
	ctx.lineTo(half - width, height);
	ctx.closePath();
	ctx.fill();
	// bottom
	ctx.beginPath();
	ctx.moveTo(half, size);
	ctx.lineTo(half + width, size - height);
	ctx.lineTo(half - width, size - height);
	ctx.closePath();
	ctx.fill();
	// left
	ctx.beginPath();
	ctx.moveTo(0, half);
	ctx.lineTo(height, half + width);
	ctx.lineTo(height, half - width);
	ctx.closePath();
	ctx.fill();
	// right
	ctx.beginPath();
	ctx.moveTo(size, half);
	ctx.lineTo(size - height, half + width);
	ctx.lineTo(size - height, half - width);
	ctx.closePath();
	ctx.fill();
}

// Add marks to axes
async function markAxes(marks, markSize) {
	marks = marks || 10;
	markSize = markSize || 2;

	for (let i = 1; i < marks + 1; ++i) {
		ctx.fillRect(half - markSize, i*(half/(marks + 1)), markSize*2, 1);
		ctx.fillRect(half + i*(half/(marks + 1)), half - markSize, 1, markSize*2);
		ctx.fillRect(half - markSize, half + i*(half/(marks + 1)), markSize*2, 1);
		ctx.fillRect(half - i*(half/(marks + 1)), half - markSize, 1, markSize*2);
	}
}

function drawFunction(func, color) {
	ctx.strokeStyle = color || "black";
	const scale = 5;

	let x = -half;
	ctx.beginPath();
	ctx.moveTo(xOnGraph(x), yOnGraph(eval(func)));
	x = half;
	ctx.lineTo(xOnGraph(x), yOnGraph(eval(func)));
	ctx.closePath();
	ctx.stroke();
}

function xOnGraph(value) {
	return value + half;
}

function yOnGraph(value) {
	return value*-1 + half;
}

// document.querySelector("#parse").addEventListener("click", (e) => {
// 	functionIn.value;
// });





drawAxes();
drawArrows(3, 5);
markAxes(10, 2);
drawFunction("x", "green");