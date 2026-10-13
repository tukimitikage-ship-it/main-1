const paper = document.querySelector('.paper')
const ctx = paper.getContext('2d')
const box = document.querySelector('.box')
const clean = document.querySelector('.clean')
const color = document.querySelector('.color')
const thickness = document.querySelector('.thickness')
const thicknessNumber = document.querySelector('.thicknessNumber')
const eraser = document.querySelector('.eraser')
const pen = document.querySelector('.pen')
const circle = document.querySelector('.circle')
pen.style.backgroundColor = '#d4d4d4'
pen.style.boxShadow = 'inset 2px 2px 5px rgba(0, 0, 0, 0.2)'
function coordinate(e) {
    box.textContent = 'x: ' + e.x + ' ' + 'y: ' + e.y
    box.style.left = (e.x + 15) + 'px'
    box.style.top = e.y + 'px'
}
function circleconfig(e) {
    circle.style.left = e.x + 'px'
    circle.style.top = e.y + 'px'
    circle.style.width = ctx.lineWidth + 'px'
    circle.style.height = ctx.lineWidth + 'px'
}
function boxcoordinate() {
    thicknessNumber.style.left = 8 + ((thickness.value - thickness.min) / (thickness.max - thickness.min) * 134) + 'px'
}
boxcoordinate()
paper.width = window.innerWidth
paper.height = window.innerHeight
let write = false
ctx.lineWidth = 3
ctx.lineCap = 'round'
ctx.lineJoin = 'round'
ctx.globalCompositeOperation = 'source-over'
thickness.addEventListener('input', function () {
    ctx.lineWidth = thickness.value
    thicknessNumber.textContent = thickness.value
    boxcoordinate()
})
pen.addEventListener('click', function () {
    ctx.globalCompositeOperation = 'source-over'
    eraser.style.backgroundColor = '#f0f0f0'
    pen.style.backgroundColor = '#d4d4d4'
    eraser.style.boxShadow = 'none'
    pen.style.boxShadow = 'inset 2px 2px 5px rgba(0, 0, 0, 0.2)'
})
eraser.addEventListener('click', function () {
    ctx.globalCompositeOperation = 'destination-out'
    pen.style.backgroundColor = '#f0f0f0'
    eraser.style.backgroundColor = '#d4d4d4'
    pen.style.boxShadow = 'none'
    eraser.style.boxShadow = 'inset 2px 2px 5px rgba(0, 0, 0, 0.2)'
})
color.addEventListener('input', function () {
    ctx.strokeStyle = color.value
})
clean.addEventListener('click', function () {
    ctx.clearRect(0, 0, paper.width, paper.height)
})
paper.addEventListener('mousedown', function (e) {
    write = true
    coordinate(e)
    box.style.display = 'block'
    ctx.beginPath()
    ctx.arc(e.x, e.y, ctx.lineWidth / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(e.x, e.y)
})
paper.addEventListener('mousemove', function (e) {
    if (write) {
        coordinate(e)
        ctx.lineTo(e.x, e.y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(e.x, e.y)
    }
})
window.addEventListener('mouseup', function (e) {
    write = false
    box.style.display = 'none'
})
window.addEventListener('mousemove', function (e) {
    circleconfig(e)
})