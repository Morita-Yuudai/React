/**
 * slide.js - 高機能スライド閲覧システム
 */

class SlideSystem {
    constructor(containerId, slideData, sectionNumber) {
        this.container = document.getElementById(containerId);
        this.slides = slideData;
        this.sectionNumber = sectionNumber; // 上から何番目の紹介か
        this.currentIndex = 0;
        this.isAdShowing = false;
        this.init();
    }

    init() {
        this.renderBase();
        this.updateSlide();
        this.addEventListeners();
    }

    renderBase() {
        this.container.innerHTML = `
            <div class="slide-header" style="display:flex; justify-content:space-between; color:white; padding:10px; font-size:14px;">
                <span>Section #${this.sectionNumber}: ${this.slides[0].title}</span>
                <div class="page-control">
                    <input type="number" id="page-input" min="1" max="${this.slides.length}" 
                           style="width:40px; background:rgba(255,255,255,0.2); border:1px solid white; color:white; text-align:center; border-radius:4px;">
                    <span> / ${this.slides.length}</span>
                </div>
            </div>
            <div class="slide-main" id="slide-viewer" style="flex-grow:1; display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative;">
                <div id="slide-content-area" style="width:100%; transition: opacity 0.3s;"></div>
            </div>
            <div class="slide-footer" style="padding:10px; color:rgba(180, 36, 36, 0.96); font-size:30px; text-align:center;">
                タップ・クリックで次へ / ページ番号入力＋Enterで移動
            </div>
        `;
    }

    updateSlide() {
        const viewer = document.getElementById(`slide-viewer-${this.sectionNumber}`);
        if (!viewer || this.isAdShowing) return;
        const area = document.getElementById('slide-content-area');
        const input = document.getElementById('page-input');
        const current = this.slides[this.currentIndex];

        area.style.opacity = 0;
        setTimeout(() => {
            area.innerHTML = `
                <h2 style="font-size:28px; margin-bottom:15px;">${current.subTitle || ''}</h2>
                <div style="font-size:18px; line-height:1.6; max-width:80%; margin:0 auto;">${current.body}</div>
            `;
            area.style.opacity = 1;
            input.value = this.currentIndex + 1;
        }, 200);
    }

    addEventListeners() {
        const viewer = document.getElementById('slide-viewer');
        const input = document.getElementById('page-input');

        // クリックで進む（左側なら戻る、右側なら進む）
        viewer.addEventListener('click', (e) => {
            const rect = viewer.getBoundingClientRect();
            if (e.clientX - rect.left < rect.width / 2) {
                this.prev();
            } else {
                this.next();
            }
        });

        // ページ番号入力
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                let val = parseInt(input.value) - 1;
                if (val >= 0 && val < this.slides.length) {
                    this.currentIndex = val;
                    this.updateSlide();
                }
            }
        });
    }
    
showAd() {
        this.isAdShowing = true;
        const viewer = document.getElementById(`slide-viewer-${this.sectionNumber}`);
        viewer.innerHTML = `
            <div style="position:absolute; inset:0; background:#000; color:#fff; z-index:100; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <div style="position:absolute; top:10px; right:10px; cursor:pointer;" onclick="window.adCloseHandler(${this.sectionNumber})">✖ 閉じる</div>
                <div style="width:250px; height:200px; border:1px solid #444; display:flex; align-items:center; justify-content:center;">
                    [Google広告枠]
                </div>
                <p style="font-size:12px; margin-top:10px;">広告を閉じると最初に戻ります</p>
            </div>
        `;
    }

    next() {
        if (this.currentIndex < this.slides.length - 1) {
            this.currentIndex++;
            this.updateSlide();
        } else {
            this.showAd();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlide();
        }
    }
    }
    // 広告を閉じるためのグローバル関数
window.allSlides = {}; 
window.adCloseHandler = (num) => {
    const slideApp = window.allSlides[num];
    if (slideApp) {
        slideApp.isAdShowing = false;
        slideApp.currentIndex = 0;
        slideApp.updateSlide();
    }
};
    