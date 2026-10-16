let mitame = document.querySelector('canvas')
const ctx = mitame.getContext("2d")
let player = 1;
let koma = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

let ok = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

let ptarn = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1]
]
let gameover = 0
function censer() {
    ok = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ]
    let turn = true
    gameover++
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            for (let step = 0; step < 8; step++) {
                if (koma[y][x] == 0) {
                    let goal = 1
                    for (let z = ptarn[step][0], s = ptarn[step][1]; koma[y + z]?.[x + s] != player && koma[y + z]?.[x + s] != 0 && koma[y + z]?.[x + s] != null; z += ptarn[step][0], s += ptarn[step][1]) { goal++ }

                    if (koma[y + goal * ptarn[step][0]]?.[x + goal * ptarn[step][1]] == player && goal > 1) {
                        ctx.beginPath();
                        if (player == 1) {
                            ctx.fillStyle = '#18181875'
                        } else {
                            ctx.fillStyle = '#ffffff75'
                        }
                        ctx.arc(37.5 + 75 * x, 37.5 + 75 * y, 30, 0, 2 * Math.PI);
                        ctx.fill();
                        ok[y][x] = 1;
                        turn = false
                        gameover = 0
                        break
                    }
                }
            }
        }
    }
    if (turn) {
        player = (player === 1) ? 2 : 1;
        if (gameover < 2) {
            censer()
        } else {
            alert('gamefinish')
        }

    }
}

function drawBoard() {
    ctx.clearRect(0, 0, 600, 600);
    ctx.beginPath();
    for (let step = 1; step < 8; step++) {
        ctx.moveTo(0, step * 75)
        ctx.lineTo(600, step * 75)
        ctx.moveTo(step * 75, 0)
        ctx.lineTo(step * 75, 600)
    }
    ctx.stroke();
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (koma[y][x] == 1) {
                ctx.fillStyle = '#181818'
            } else if (koma[y][x] == 2) {
                ctx.fillStyle = '#ffffff'
            } else {
                continue;
            }
            ctx.beginPath();
            ctx.arc(37.5 + 75 * x, 37.5 + 75 * y, 30, 0, 2 * Math.PI)
            ctx.fill();
        }
    }
    censer()
}

mitame.addEventListener("click", (event) => {
    const rect = mitame.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const x = Math.floor(clickX / 75);
    const y = Math.floor(clickY / 75);
    if (koma[y][x] === 0 && ok[y][x] == 1) {
        koma[y][x] = player;
        for (let step = 0; step < 8; step++) {
            let goal = 1
            let kari = [[y + ptarn[step][0], x + ptarn[step][1]]]
            for (let z = ptarn[step][0], s = ptarn[step][1]; koma[y + z]?.[x + s] != player && koma[y + z]?.[x + s] != 0 && koma[y + z]?.[x + s] != null; z += ptarn[step][0], s += ptarn[step][1]) { goal++, kari.push([y + z, x + s]) }
            if (koma[y + goal * ptarn[step][0]]?.[x + goal * ptarn[step][1]] != player) {
                kari = []
            }
            kari.forEach(nakami => {
                koma[nakami[0]][nakami[1]] = player;
            });
        }
        player = (player === 1) ? 2 : 1;
        drawBoard();
    }
});

drawBoard();






