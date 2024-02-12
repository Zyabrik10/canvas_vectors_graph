let canvas, ctx;

let animetionValue,
  timer = 0;

let deltaTime = 0,
  currentTime = 0;

let fps = 60,
  lineWidth = 0.5,
  cellSize = 10,
  k = 1,
  kRange = 100,
  kIn = 0.001,
  c = 0.1,
  cRange = 1;

let gradient;

let mouse = {
  isClicked: false,
  x: undefined,
  y: undefined,
};

const xSize = 30;
const ySize = 30;

const settings = {
  fps,
  lineWidth,
  k,
  speed: kIn,
  kRange,
  cRange,
  cellSize,
  play: true,
  xSize,
  ySize,
};

const gui = new dat.GUI();

gui.add(settings, "fps", 1, 60).step(1);
gui.add(settings, "lineWidth", 0.1, 1).step(0.01);
gui.add(settings, "k", -kRange, kRange).step(kIn);
gui.add(settings, "speed", -kIn * 100, kIn * 100).step(kIn / 100);
gui.add(settings, "cellSize", 10, 35);
gui.add(settings, "xSize", 1, 100);
gui.add(settings, "ySize", 1, 100);
gui.add(settings, "play").onChange((value) => {
  return !value;
});

function drawLine(angle, x, y) {
  ctx.lineWidth = settings.lineWidth;
  ctx.strokeStyle = gradient;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + cos(angle) * settings.xSize, y + sin(angle) * settings.ySize);
  ctx.stroke();
}

const cos = Math.cos;
const sin = Math.sin;
const sqrt = Math.sqrt;
const pow = Math.pow;
const exp = Math.exp;
const pi = Math.PI;
const tan = Math.tan;

function calcAngle(x, y) {
  return (x * x + y * y) * settings.k * 0.00001;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += settings.cellSize) {
    for (let x = 0; x < canvas.width; x += settings.cellSize) {
      const angle = calcAngle(x, y);

      drawLine(angle, x, y);
    }
  }

  if (settings.play) {
    if (settings.k >= settings.kRange || settings.k <= -settings.kRange)
      settings.speed *= -1;

    settings.k += settings.speed;
  }
}

function FPSToMs(fps) {
  return fps > 0 ? 1000 / fps : 0;
}

function initGradient() {
  gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop("0.2", "red");
  gradient.addColorStop("0.3", "yellow");
  gradient.addColorStop("0.4", "orange");
  gradient.addColorStop("0.5", "green");
  gradient.addColorStop("0.6", "cyan");
  gradient.addColorStop("0.7", "blue");
  gradient.addColorStop("0.8", "purple");
  gradient.addColorStop("1", "red");
}

function update(timeStamp) {
  deltaTime = timeStamp - currentTime;
  currentTime = timeStamp;

  if (timer >= FPSToMs(settings.fps)) {
    animate();
    timer = 0;
  } else timer += deltaTime;

  animetionValue = requestAnimationFrame(update);
}

window.addEventListener("resize", () => {
  cancelAnimationFrame(animetionValue);
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  update(currentTime);
});

window.addEventListener("load", () => {
  canvas = document.querySelector("canvas");

  if (!canvas) throw new Error("ErrorCanvasDefining: canvas");
  ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  initGradient();
  update(currentTime);
});
