/**
 * layout.js - 幾何学的分岐・透過制御アルゴリズム
 * 1. lineWidth: 8〜16px
 * 2. Intersection logic: 3本以上の交差で45度分岐
 * 3. Text Awareness: 中央のコンテンツエリアは透過度80%(Alpha 0.2)に引き上げ
 */

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    document.body.appendChild(canvas);

    Object.assign(canvas.style, {
        position: 'fixed', top: '0', left: '0',
        width: '100vw', height: '100vh',
        zIndex: '-1', pointerEvents: 'none'
    });

    const ctx = canvas.getContext('2d');
    let width, height;
    const hubs = []; // 交差点（ハブ）を管理

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        draw();
    }

    // 線を引く基本関数
    function drawLine(x1, y1, angle, length, color, alpha) {
        const x2 = x1 + Math.cos(angle) * length;
        const y2 = y1 + Math.sin(angle) * length;

        // コンテンツエリア（画面中央）との重なり判定
        // 中央付近は透過度を上げる（透明度80% = Alpha 0.2）
        let currentAlpha = alpha;
        const centerX = width / 2;
        const centerY = height / 2;
        const dist = Math.sqrt((x1 - centerX) ** 2 + (y1 - centerY) ** 2);
        
        if (dist < 400) { // 中央から400px以内は文字と被ると判断
            currentAlpha = 0.2; 
        }

        ctx.beginPath();
        ctx.globalAlpha = currentAlpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.random() * 8 + 8; // 指示通りの幅
        ctx.lineCap = 'round';
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // 境界の灰色線（30%透過）を並走させる
        ctx.beginPath();
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = '#808080';
        ctx.lineWidth = 1;
        ctx.moveTo(x1 + 5, y1 + 5);
        ctx.lineTo(x2 + 5, y2 + 5);
        ctx.stroke();

        return { x: x2, y: y2 };
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const colors = ['#FF0000', '#FFFFFF', '#0000FF'];
        
        // 1. まず数箇所「交差点（ハブ）」を定義
        for (let i = 0; i < 5; i++) {
            hubs.push({ x: Math.random() * width, y: Math.random() * height });
        }

        hubs.forEach(hub => {
            // 指示：交点（ハブ）を軸に3本以上の線を45度間隔で放射
            let baseAngle = Math.random() * Math.PI * 2;
            for (let j = 0; j < 3; j++) {
                const angle = baseAngle + (j * Math.PI / 4); // 45度(π/4)ずつずらす
                drawLine(hub.x, hub.y, angle, Math.random() * 500 + 200, colors[j % 3], 0.6);
            }
        });

        // 2. 無造作な線を数本追加
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const angle = Math.random() * Math.PI * 2;
            drawLine(x, y, angle, Math.random() * 400, colors[i % 3], 0.5);
        }

        // 3. モザイクレイヤー（60%透過）を最後に被せる
        applyMosaic(40);
    }

    function applyMosaic(size) {
        ctx.globalAlpha = 0.6; // モザイクレイヤーの透過度
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(0, 0, width, height);

        for (let x = 0; x < width; x += size) {
            for (let y = 0; y < height; y += size) {
                if ((x + y) % (size * 2) === 0) {
                    ctx.fillStyle = 'rgba(200, 200, 200, 0.05)';
                    ctx.fillRect(x, y, size, size);
                }
            }
        }
    }

    window.addEventListener('resize', resize);
    resize();
});