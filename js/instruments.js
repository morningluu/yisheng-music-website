/**
 * 艺声乐器文化传播网站 — 乐器展示页逻辑
 * Yisheng Musical Culture — Instruments Page Logic
 */

(function () {
  'use strict';

  /* ============================================================
     Instrument Data Store (12 instruments)
     ============================================================ */
  const INSTRUMENTS = [
    { id: 1,  name: '西塔琴',   origin: '印度',   price: 18000, likes: 256, views: 2340, category: 'string',    categoryName: '弦乐器', intro: '印度古典乐器代表，音色悠扬婉转，是印度音乐文化中不可或缺的灵魂乐器。' },
    { id: 2,  name: '古筝',     origin: '中国',   price: 12800, likes: 312, views: 3560, category: 'string',    categoryName: '弦乐器', intro: '中国传统弹拨乐器，音色清亮悠远，承载着数千年的中华音乐文明。' },
    { id: 3,  name: '立式钢琴', origin: '意大利', price: 45000, likes: 489, views: 5120, category: 'keyboard',  categoryName: '键盘乐器', intro: '乐器之王，音域宽广表现力丰富，三百年来一直是西方音乐的核心乐器。' },
    { id: 4,  name: '非洲鼓',   origin: '西非',   price: 3200,  likes: 198, views: 1890, category: 'percussion',categoryName: '打击乐器', intro: '西非传统打击乐器，节奏感极强，被誉为"会说话的鼓"。' },
    { id: 5,  name: '萨克斯风', origin: '比利时', price: 22000, likes: 367, views: 4230, category: 'wind',      categoryName: '管乐器', intro: '爵士乐灵魂乐器，音色温暖醇厚，由比利时乐器制造家阿道夫·萨克斯发明。' },
    { id: 6,  name: '小提琴',   origin: '意大利', price: 35000, likes: 521, views: 6780, category: 'string',    categoryName: '弦乐器', intro: '弦乐器皇后，音色细腻表现力强，是交响乐团中最重要的旋律乐器之一。' },
    { id: 7,  name: '尺八',     origin: '日本',   price: 4200,  likes: 156, views: 1230, category: 'wind',      categoryName: '管乐器', intro: '源自中国唐代，后传入日本并发展出独特的禅宗音乐风格，音色苍凉悠远。' },
    { id: 8,  name: '二胡',     origin: '中国',   price: 2800,  likes: 234, views: 2670, category: 'string',    categoryName: '弦乐器', intro: '中国传统拉弦乐器，音色接近人声，擅长表达深沉细腻的情感。' },
    { id: 9,  name: '电子琴',   origin: '日本',   price: 4500,  likes: 178, views: 1560, category: 'keyboard',  categoryName: '键盘乐器', intro: '现代电子乐器代表，能模拟多种乐器音色，广泛应用于音乐教育与创作。' },
    { id: 10, name: '爵士鼓',   origin: '美国',   price: 12000, likes: 345, views: 3890, category: 'percussion',categoryName: '打击乐器', intro: '现代音乐节奏核心，由多个鼓与镲片组成，是乐队中不可或缺的节奏基石。' },
    { id: 11, name: '长笛',     origin: '法国',   price: 3800,  likes: 210, views: 1980, category: 'wind',      categoryName: '管乐器', intro: '现代交响乐团中最古老的管乐器之一，音色清澈明亮，被誉为"乐队中的夜莺"。' },
    { id: 12, name: '电吉他',   origin: '美国',   price: 7500,  likes: 423, views: 5340, category: 'string',    categoryName: '弦乐器', intro: '现代摇滚与流行音乐的标志性乐器，通过电磁拾音器将弦振动转换为电信号。' },
  ];

  const ITEMS_PER_PAGE = 12;

  /* Instrument ID → image file mapping */
  const IMAGE_MAP = { 1:1, 2:2, 3:4, 4:5, 5:6, 6:7, 7:8, 8:9, 9:23, 10:10, 11:11, 12:12 };

  /* ============================================================
     Instrument Filter Controller
     ============================================================ */
  const InstrumentFilter = {
    state: {
      category: 'all',
      currentPage: 1,
    },

    init() {
      this.categorySelect = document.getElementById('category-filter');
      this.filterBtn = document.getElementById('filter-btn');
      this.resetBtn = document.getElementById('reset-btn');
      this.gridContainer = document.getElementById('instruments-grid');
      this.paginationContainer = document.getElementById('pagination');

      if (!this.gridContainer) return;

      this._bindEvents();
      this._render();
    },

    _bindEvents() {
      // 点击"筛选"按钮 → 读取下拉框值后筛选
      if (this.filterBtn) {
        this.filterBtn.addEventListener('click', () => {
          try {
            this.state.category = this.categorySelect ? this.categorySelect.value : 'all';
            this.state.currentPage = 1;
            this._render();
          } catch (e) {
            // 容错：静默失败
          }
        });
      }

      // 点击"重置"按钮
      if (this.resetBtn) {
        this.resetBtn.addEventListener('click', () => {
          try {
            this.state.category = 'all';
            this.state.currentPage = 1;
            if (this.categorySelect) this.categorySelect.value = 'all';
            this._render();
          } catch (e) {
            // 容错：静默失败
          }
        });
      }
    },

    _getFiltered() {
      let items = [...INSTRUMENTS];

      if (this.state.category && this.state.category !== 'all') {
        items = items.filter((item) => item.category === this.state.category);
      }

      return items;
    },

    _render() {
      const filtered = this._getFiltered();
      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

      if (this.state.currentPage > totalPages) {
        this.state.currentPage = totalPages;
      }
      if (this.state.currentPage < 1) {
        this.state.currentPage = 1;
      }

      const start = (this.state.currentPage - 1) * ITEMS_PER_PAGE;
      const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

      this._renderGrid(pageItems);
      this._renderPagination(totalItems, totalPages);
    },

    _renderGrid(items) {
      if (!this.gridContainer) return;

      if (items.length === 0) {
        this.gridContainer.innerHTML = `
          <div class="col-12">
            <div class="no-results">
              <div class="no-results-icon"><i class="bi bi-inbox"></i></div>
              <h3>暂无匹配乐器</h3>
              <p>当前分类下没有乐器，请尝试其他分类</p>
            </div>
          </div>`;
        return;
      }

      // 动态渲染不使用 fade-in-up，避免依赖外部 ScrollAnimator 导致卡片不可见
      this.gridContainer.innerHTML = items
        .map(
          (item) => `
        <div class="col-lg-3 col-md-6">
          <article class="instrument-card">
            <div class="card-img">
              <img src="images/${IMAGE_MAP[item.id]}.jpg" alt="${this._escapeHTML(item.name)}" class="w-100" style="aspect-ratio: 1/1; object-fit: cover;" loading="lazy">
            </div>
            <div class="card-body" style="padding: 12px 16px;">
              <div class="card-title-row">
                <h3 class="card-title">${this._escapeHTML(item.name)}</h3>
                <span class="card-price">&yen;${item.price.toLocaleString()}</span>
              </div>
              <span class="card-category">${this._escapeHTML(item.categoryName)}</span>
              <p class="card-text">${this._escapeHTML(item.intro)}</p>
              <div class="card-info-bar">
                <span class="card-info-stat"><i class="bi bi-geo-alt"></i> ${this._escapeHTML(item.origin)}</span>
                <span class="card-info-stat"><i class="bi bi-heart"></i> ${item.likes}</span>
                <span class="card-info-stat"><i class="bi bi-eye"></i> ${item.views.toLocaleString()}</span>
              </div>
            </div>
            <div class="card-footer card-footer-center" style="padding: 8px 12px;">
              <button class="btn btn-detail btn-detail-wide" type="button">
                查看详情 <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </article>
        </div>`
        )
        .join('');
    },

    _renderPagination(totalItems, totalPages) {
      if (totalPages <= 1) {
        if (this.paginationContainer) this.paginationContainer.innerHTML = '';
        return;
      }

      if (!this.paginationContainer) return;

      const current = this.state.currentPage;
      let pagesHTML = '';

      // Previous
      pagesHTML += `<button class="page-btn" ${
        current === 1 ? 'disabled' : ''
      } data-page="${current - 1}" aria-label="上一页"><i class="bi bi-chevron-left"></i></button>`;

      // Page numbers
      const maxButtons = 5;
      let startPage = Math.max(1, current - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);
      if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      if (startPage > 1) {
        pagesHTML += `<button class="page-btn" data-page="1">1</button>`;
        if (startPage > 2) {
          pagesHTML += `<span class="page-btn" style="border:none;cursor:default;pointer-events:none;">...</span>`;
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pagesHTML += `<button class="page-btn ${
          i === current ? 'active' : ''
        }" data-page="${i}">${i}</button>`;
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pagesHTML += `<span class="page-btn" style="border:none;cursor:default;pointer-events:none;">...</span>`;
        }
        pagesHTML += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
      }

      // Next
      pagesHTML += `<button class="page-btn" ${
        current === totalPages ? 'disabled' : ''
      } data-page="${current + 1}" aria-label="下一页"><i class="bi bi-chevron-right"></i></button>`;

      this.paginationContainer.innerHTML = pagesHTML;

      // Bind page button events
      this.paginationContainer.querySelectorAll('[data-page]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const page = parseInt(btn.getAttribute('data-page'), 10);
          if (page !== this.state.currentPage) {
            this.state.currentPage = page;
            this._render();
            if (this.gridContainer) {
              const navHeight =
                document.querySelector('.navbar')?.offsetHeight || 64;
              const top =
                this.gridContainer.getBoundingClientRect().top +
                window.scrollY -
                navHeight -
                20;
              window.scrollTo({ top, behavior: 'smooth' });
            }
          }
        });
      });
    },

    _escapeHTML(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    },
  };

  /* ============================================================
     Bootstrap
     ============================================================ */
  function boot() {
    InstrumentFilter.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
