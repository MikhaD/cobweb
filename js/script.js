if (document.documentElement.classList.contains("light")) {
	document.querySelector("#favicon").href = "./img/favicon light.png"
}

const canvas = document.querySelector("#diagram");
const main = document.querySelector("main");
const scaleIn = document.querySelector("#scale");
const widthIn = document.querySelector("#line-width");
const downloadBtn = document.querySelector("#download-btn");
const download = document.querySelector("#download");

const plot = (function() {
	const functionIn = document.querySelector("#map-function");
	const cIn = document.querySelector("#c");
	return function() {
		if (functionIn.value && cIn.value) {
			initializeGraph(scaleIn.value * 10, widthIn.value, "green");
			
			drawLine(functionIn.value, scaleIn.value * 10, widthIn.value * 2, "blue");
			drawCobweb(functionIn.value, cIn.value, scaleIn.value * 10, widthIn.value, "red");
			download.href = canvas.toDataURL("img/png");
		}
	}
})();

document.querySelector("#plot-btn").addEventListener("click", plot);

let size = Math.ceil(main.getBoundingClientRect().height / 1.25);
// Make size even if it isn't
size = size + size % 2;
const half = size/2;

canvas.width = size;
canvas.height = size;

const ctx = canvas.getContext("2d");

// Draw Axes
function drawAxes(width, offset, color) {
	ctx.strokeStyle = color || "black";
	ctx.lineWidth = width || 1;
	offset = offset || 0;

	ctx.beginPath();
	ctx.moveTo(offset, half);
	ctx.lineTo(size - offset, half);
	
	ctx.moveTo(half, offset);
	ctx.lineTo(half, size - offset);
	ctx.stroke();
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
function markAxes(increment, markSize) {
	markSize = markSize || 2;

	for (let i = increment; i < half; i+=increment) {
		ctx.fillRect(half - markSize, half - i, markSize*2, 1);
		ctx.fillRect(half + i, half - markSize, 1, markSize*2);
		ctx.fillRect(half - markSize, half + i, markSize*2, 1);
		ctx.fillRect(half - i, half - markSize, 1, markSize*2);
	}
}

function drawLine(func, scale, width, color) {
	ctx.strokeStyle = color || "black";
	ctx.lineWidth = width || 1;
	scale = scale || 1;

	let x = -half;
	ctx.beginPath();
	ctx.moveTo(X(x*scale), Y(eval(func)*scale));
	x = half;
	ctx.lineTo(X(x*scale), Y(eval(func)*scale));
	ctx.stroke();
}

function drawFunction(func, scale, width, color) {
	ctx.strokeStyle = color || "black";
	ctx.lineWidth = width || 1;
	scale = scale || 10;
	const increment = Math.floor(scale/10) || 1;
	let x, xx;
	ctx.beginPath();
	for (let i = -half-increment; i < half+increment; i+= increment) {
		xx = i;
		x = i/scale;
		if (x === -half) ctx.moveTo(X(xx), Y(eval(func)*scale));
		else ctx.lineTo(X(xx), Y(eval(func)*scale));
	}
	ctx.stroke();
}

function X(value) {
	return value + half;
}

function Y(value) {
	return value*-1 + half;
}

function drawCobweb(func, c, scale, width, color) {
	let x = c;
	c *= scale || 1;
	ctx.lineWidth = width || 1;
	ctx.strokeStyle = color || "black";

	ctx.beginPath();
	ctx.moveTo(X(c), Y(c));
	let i = 0;

	while (true) {
		if (++i % 2 == 0) {
			ctx.lineTo(X(c), Y(eval(func)*scale));
			ctx.moveTo(X(c), Y(eval(func)*scale));
			c = eval(func);
			x = c;
			c *= scale || 1;
			if (X(c) > size || Y(c) > size || X(c) < 0 || Y(c) < 0 || round(x, 2) === round(eval(func), 2)) {
				break;
			}
		} else {
			ctx.lineTo(X(c), Y(c));
			ctx.moveTo(X(c), Y(c));
		}
	}
	ctx.stroke();
}

/**
 * Round a number to n decimal places
 * @param {Number} x - The number to round
 * @param {Number} n - The number of decimal places to round to
 */
function round(x, n) {
	n = n || 0;
	if (n < 0) {
		n = 10 ** Math.abs(n);
		return n * Math.ceil(x / n);
	}
	return Math.round(x * (10**n)) / 10**n;
}

function initializeGraph(scale, lineWidth, color) {
	lineWidth = parseInt(lineWidth);
	ctx.clearRect(0, 0, size, size);

	drawAxes(lineWidth, lineWidth*5);
	drawArrows(lineWidth*3, lineWidth*5);
	markAxes(scale, lineWidth + 1);
	drawLine("x", 1, lineWidth*2, color);
}

initializeGraph(scaleIn.value * 10, widthIn.value, "green");
download.href = canvas.toDataURL("img/png");