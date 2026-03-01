// HTMLからCanvas要素を取得
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- ボールの設定 ---
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 4;
let dy = -4;
let ballRadius = 10;

// --- パドルの設定 ---
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// --- ブロックの設定 ---
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

// --- ゲーム状態の設定 ---
let score = 0; // スコア
let lives = 3; // 残機

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// マウス移動のイベントリスナー
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// --- 描画関連関数 ---
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// --- 新機能: スコアと残機の描画 ---
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

// --- 当たり判定（ブロック） ---
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++; // ブロックを消したらスコアアップ
                    
                    // すべてのブロックを消したらクリア
                    if (score == brickRowCount * brickColumnCount) {
                        alert("ゲームクリア！おめでとう！");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// ゲームループ
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore(); // スコア表示
    drawLives(); // 残機表示
    collisionDetection();

    // --- 当たり判定（壁・パドル） ---
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            // パドルを外れたら残機を減らす
            lives--;
            if (!lives) {
                alert("ゲームオーバー");
                document.location.reload();
            } else {
                // ボールとパドルを初期位置に戻す
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 4;
                dy = -4;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();