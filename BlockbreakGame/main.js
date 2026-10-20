"use strict";
const gamePanel = document.querySelector(".game");
const ctx = gamePanel.getContext("2d");
const home = document.querySelector(".home");
const startButton = document.querySelector(".start");
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
    speedX: 2,
    speedY: -2,
};
const paddle = {
    x: (gamePanel.width - 75) / 2,
    width: 75,
    height: 10,
    speed: 4,
};
window.addEventListener("mousemove", e => {
    if (!game)
        return;
    const rect = gamePanel.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (gamePanel.width / rect.width);
    paddle.x = mouseX - paddle.width / 2;
});
const radius = 8;
const draw = () => {
    ctx.clearRect(0, 0, gamePanel.width, gamePanel.height);
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(ball.x, ball.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#00dd30";
    ctx.fillRect(paddle.x, gamePanel.height - paddle.height - 30, paddle.width, paddle.height);
};
const update = () => {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    if (ball.x > gamePanel.width - radius) {
        ball.speedX *= -1;
        ball.x = gamePanel.width - radius;
    }
    if (ball.x < radius) {
        ball.speedX *= -1;
        ball.x = radius;
    }
    if (ball.y > gamePanel.height - radius) {
        ball.speedY *= -1;
        ball.y = gamePanel.height - radius;
    }
    if (ball.y < radius) {
        ball.speedY *= -1;
        ball.y = radius;
    }
    if (keys.ArrowLeft || keys.KeyA)
        paddle.x -= paddle.speed;
    if (keys.ArrowRight || keys.KeyD)
        paddle.x += paddle.speed;
    paddle.x = Math.max(0, Math.min(paddle.x, gamePanel.width - paddle.width));
};
const loop = () => {
    update();
    draw();
    requestAnimationFrame(loop);
};
startButton.addEventListener("click", _ => {
    gamePanel.classList.remove("hidden");
    home.classList.add("hidden");
    game = true;
    loop();
});
