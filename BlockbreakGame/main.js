const gamepanel = document.querySelector(".game");
const ctx = gamepanel.getContext("2d");
const home = document.querySelector(".home");
const startbutton = document.querySelector(".start");
let game = false;
const keys = {};
window.addEventListener("keydown", e => {
  keys[e.code] = true;
});
window.addEventListener("keyup", e => {
  keys[e.code] = false;
});
const ball = {
  x: 240,
  y: 250,
  speedx: 2,
  speedy: -2,
};
const paddle = {
  x: (gamepanel.width - 75) / 2,
  width: 75,
  height: 10,
  speed: 4,
};
window.addEventListener("mousemove", e => {
  if (!game) return;
  const rect = gamepanel.getBoundingClientRect();
  const mouseX = (e.clientX - rect.left) * (gamepanel.width / rect.width);
  paddle.x = mouseX - paddle.width / 2;
});
const radius = 8;
const draw = () => {
  ctx.clearRect(0, 0, gamepanel.width, gamepanel.height);
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(ball.x, ball.y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "#00dd30";
  ctx.fillRect(
    paddle.x,
    gamepanel.height - paddle.height - 30,
    paddle.width,
    paddle.height,
  );
};
const update = () => {
  ball.x += ball.speedx;
  ball.y += ball.speedy;
  if (ball.x > gamepanel.width - radius) {
    ball.speedx *= -1;
    ball.x = gamepanel.width - radius;
  }
  if (ball.x < radius) {
    ball.speedx *= -1;
    ball.x = radius;
  }
  if (ball.y > gamepanel.height - radius) {
    ball.speedy *= -1;
    ball.y = gamepanel.height - radius;
  }
  if (ball.y < radius) {
    ball.speedy *= -1;
    ball.y = radius;
  }
  if (keys.ArrowLeft || keys.KeyA) paddle.x -= paddle.speed;

  if (keys.ArrowRight || keys.KeyD) paddle.x += paddle.speed;
  paddle.x = Math.max(0, Math.min(paddle.x, gamepanel.width - paddle.width));
};
const loop = () => {
  update();
  draw();
  requestAnimationFrame(loop);
};
startbutton.addEventListener("click", _ => {
  gamepanel.classList.remove("hidden");
  home.classList.add("hidden");
  game = true;
  loop();
});
