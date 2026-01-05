/**
 * slide.js - 高機能スライド閲覧システム
 */

/**
 * slide.js - UI維持・3クリック広告・ループ版
 */
class SlideSystem {
    constructor(containerId, slideData, sectionNumber) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.slides = slideData;
        this.sectionNumber = sectionNumber;
        this.currentIndex = 0;
        this.clickCount = 0; // クリックカウンター
        this.isAdShowing = false;
        this.init();
    }

    init() {
        this.renderBase();
        this.updateSlide();
        this.addEventListeners();
    }

    // 元のデザインを維持
    renderBase() {
        this.container.innerHTML = `
            <div class="slide-header" style="display:flex; justify-content:space-between; color:white; padding:10px; font-size:14px; background:rgba(0,0,0,0.5);">
                <span>Section #${this.sectionNumber}: ${this.slides[0].title}</span>
                <div class="page-control">
                    <input type="number" id="page-input-${this.sectionNumber}" min="1" max="${this.slides.length}" 
                           style="width:40px; background:rgba(255,255,255,0.2); border:1px solid white; color:white; text-align:center; border-radius:4px;">
                    <span> / ${this.slides.length}</span>
                </div>
            </div>
            
            <div class="slide-main" id="slide-viewer-${this.sectionNumber}" style="height:350px; display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative; background:#f9f9f9; color:#333;">
                <div id="slide-content-area-${this.sectionNumber}" style="width:100%; transition: opacity 0.3s; text-align:center; padding:20px;"></div>
                <div id="ad-overlay-${this.sectionNumber}" style="display:none; position:absolute; inset:0; background:rgba(0,0,0,0.95); color:white; z-index:100; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="position:absolute; top:15px; right:15px; cursor:pointer; font-size:24px;" onclick="window.closeAd(${this.sectionNumber})">✖</div>
                    <p style="font-size:12px; color:#888;">ADVERTISEMENT</p>
                    <div style="width:300px; height:250px; background:#222; border:1px solid #444; display:flex; align-items:center; justify-content:center;">
                        [Google AdSense Slot]
                    </div>
                    <p style="margin-top:15px; font-size:14px;">広告を閉じるとスライドを続行できます</p>
                </div>
            </div>
            <div class="slide-footer" style="padding:15px; color:rgba(180, 36, 36, 0.96); font-size:20px; text-align:center; background:rgba(255,255,255,0.1);">
                タップ・クリックで次へ / ページ番号入力＋Enterで移動
            </div>
        `;
    }

    updateSlide() {
        const area = document.getElementById(`slide-content-area-${this.sectionNumber}`);
        const input = document.getElementById(`page-input-${this.sectionNumber}`);
        if (!area || this.isAdShowing) return;

        const current = this.slides[this.currentIndex];
        area.style.opacity = 0;
        
        setTimeout(() => {
            area.innerHTML = `
                <h2 style="font-size:28px; margin-bottom:15px;">${current.subTitle || ''}</h2>
                <div style="font-size:18px; line-height:1.6; max-width:85%; margin:0 auto;">${current.body || current.text}</div>
            `;
            area.style.opacity = 1;
            if (input) input.value = this.currentIndex + 1;
        }, 200);
    }

    showAd() {
        this.isAdShowing = true;
        const adOverlay = document.getElementById(`ad-overlay-${this.sectionNumber}`);
        if (adOverlay) adOverlay.style.display = 'flex';
    }

    closeAd() {
        this.isAdShowing = false;
        const adOverlay = document.getElementById(`ad-overlay-${this.sectionNumber}`);
        if (adOverlay) adOverlay.style.display = 'none';
        this.clickCount = 0; // カウントリセット
        // もし最後まで到達していたら最初に戻る、途中の広告ならそのまま続行
        if (this.currentIndex >= this.slides.length - 1) {
            this.currentIndex = 0;
        }
        this.updateSlide();
    }

    next() {
        this.clickCount++;
        // 3クリックごとに広告を表示
        if (this.clickCount >= 3) {
            this.showAd();
            return;
        }

        if (this.currentIndex < this.slides.length - 1) {
            this.currentIndex++;
            this.updateSlide();
        } else {
            // スライド終了時も広告を出す
            this.showAd();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlide();
        }
    }

    addEventListeners() {
        const viewer = document.getElementById(`slide-viewer-${this.sectionNumber}`);
        const input = document.getElementById(`page-input-${this.sectionNumber}`);

        viewer.addEventListener('click', (e) => {
            if (this.isAdShowing || e.target.closest('#ad-overlay-' + this.sectionNumber)) return;
            const rect = viewer.getBoundingClientRect();
            if (e.clientX - rect.left < rect.width / 2) this.prev();
            else this.next();
        });

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
}


// グローバル管理
window.allSlideApps = {};
window.closeAd = (num) => {
    if (window.allSlideApps[num]) window.allSlideApps[num].closeAd();
};
    