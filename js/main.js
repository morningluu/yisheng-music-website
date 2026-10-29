/**
 * 艺声乐器文化传播网站 — 主逻辑模块
 * Yisheng Musical Culture — Main Application Logic
 */

(function () {
  'use strict';

  /* ============================================================
     Navigation Controller
     ============================================================ */
  const NavController = {
    init() {
      this.navbar = document.querySelector('.navbar');
      this.currentPath = window.location.pathname;

      this._highlightCurrentPage();
      this._bindScroll();
    },

    /* Highlight the active nav link based on current URL */
    _highlightCurrentPage() {
      const filename = this.currentPath.split('/').pop() || 'index.html';
      const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === filename || (filename === '' && href === 'index.html')) {
          link.classList.add('active');
        }
      });
    },

    /* Add shadow on scroll */
    _bindScroll() {
      const onScroll = () => {
        if (window.scrollY > 20) {
          this.navbar.classList.add('scrolled');
        } else {
          this.navbar.classList.remove('scrolled');
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    },
  };

  /* ============================================================
     Scroll Animation (Intersection Observer)
     ============================================================ */
  const ScrollAnimator = {
    init() {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              if (!entry.target.classList.contains('animate-repeat')) {
                this.observer.unobserve(entry.target);
              }
            } else if (entry.target.classList.contains('animate-repeat')) {
              entry.target.classList.remove('visible');
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px',
        }
      );

      this._observeAll();
    },

    _observeAll() {
      const targets = document.querySelectorAll(
        '.fade-in-up, .fade-in, .stagger-children'
      );
      targets.forEach((el) => this.observer.observe(el));
    },

    refresh() {
      const targets = document.querySelectorAll(
        '.fade-in-up:not(.visible), .fade-in:not(.visible), .stagger-children:not(.visible)'
      );
      targets.forEach((el) => this.observer.observe(el));
    },
  };

  /* ============================================================
     Scroll to Top Button
     ============================================================ */
  const ScrollTop = {
    init() {
      this.btn = document.querySelector('.scroll-top');
      if (!this.btn) return;

      window.addEventListener(
        'scroll',
        () => {
          if (window.scrollY > 500) {
            this.btn.classList.add('visible');
          } else {
            this.btn.classList.remove('visible');
          }
        },
        { passive: true }
      );

      this.btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
  };

  /* ============================================================
     Like Button Handler (Event Delegation)
     ============================================================ */
  const LikeHandler = {
    init() {
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('.card-like');
        if (!btn) return;

        e.preventDefault();
        const isLiked = btn.classList.contains('liked');
        const countSpan = btn.querySelector('span');

        if (isLiked) {
          btn.classList.remove('liked');
          if (countSpan) {
            const current = parseInt(countSpan.textContent, 10);
            countSpan.textContent = Math.max(0, current - 1);
          }
          this._showToast('已取消点赞');
        } else {
          btn.classList.add('liked');
          if (countSpan) {
            const current = parseInt(countSpan.textContent, 10);
            countSpan.textContent = current + 1;
          }
          this._showToast('已点赞');
        }
      });
    },

    _showToast(message) {
      // Remove existing toasts
      const wrap = document.getElementById('toastWrap');
      if (!wrap) return;
      wrap.querySelectorAll('.toast-item').forEach((t) => t.remove());

      const toast = document.createElement('div');
      toast.className = 'toast-item';
      toast.textContent = message;
      wrap.appendChild(toast);

      setTimeout(() => toast.remove(), 2500);
    },
  };

  /* ============================================================
     Culture Modal Handler (弹窗阅读全文)
     ============================================================ */
  const CultureModal = {
    /* Article full-text data keyed by data-culture-modal attribute */
    articles: {
      1: {
        category: '中国传统乐器',
        title: '中国古筝艺术：两千年弦音的传承与发展',
        text: [
          '古筝，又名汉筝、秦筝，是中国最古老的弹拨乐器之一，距今已有两千五百多年的历史。早在战国时期，古筝便在秦国（今陕西一带）广为流传，故又名"秦筝"。古筝最初为五弦，后逐渐演变为十二弦、十三弦、十六弦，直至今日最普遍的二十一弦筝，每一次变革都映射着中国音乐审美的发展与演变。',
          '古筝的音域宽广，音色清亮悠远，演奏技巧丰富多样。右手技法主要包括托、劈、挑、抹、剔、勾、摇、撮等，左手则以按、滑、揉、颤为主，左右手配合可以产生千变万化的音色效果。古筝的代表曲目有《渔舟唱晚》《高山流水》《战台风》《林冲夜奔》等，每一首都是中华音乐文化宝库中的璀璨明珠。',
          '自古以来，古筝艺术便与诗词、书画等传统文化形态相互交融。历代文人墨客留下了大量咏筝诗词，如白居易"弦凝指咽声停处，别有深情一万重"、李商隐"锦瑟无端五十弦，一弦一柱思华年"等千古名句。古筝之美，早已融入中华文化的精神血脉之中。',
          '近年来，随着中国文化自信的不断增强，古筝艺术迎来了前所未有的发展机遇。不仅在国内掀起了学习热潮，更在国际舞台上大放异彩。古筝艺术已被列入联合国教科文组织人类非物质文化遗产代表作名录，成为世界认识中国文化的重要窗口。越来越多的外国友人通过学习古筝，深入了解中国音乐与文化的独特魅力。',
        ],
      },
      2: {
        category: '印度音乐文化',
        title: '西塔琴与拉格：印度古典音乐的灵魂对话',
        text: [
          '西塔琴是印度最具代表性的古典乐器之一，其历史可追溯至十三世纪的波斯。西塔琴的独特之处在于其精妙的设计——琴身由一个半球形共鸣箱和一根中空的长颈组成，通常有十八至二十一根弦，其中包括七根主奏弦和十余根共鸣弦。演奏时，共鸣弦在主弦振动时自然产生一种空灵悠远的回响效果，这是西塔琴最迷人的音色特征。',
          '在印度古典音乐体系中，西塔琴与"拉格"密不可分。拉格是印度音乐的基本旋律框架，它不同于西方音乐的"音阶"概念，而是一种更为精细和复杂的旋律系统。每个拉格都有其特定的上行与下行音阶、核心音群、特征性乐句以及情感色彩。不同的拉格还被认为对应不同的季节、时辰和情感状态——有些拉格专为清晨演奏，营造庄严肃穆的氛围；有些拉格则在傍晚演奏，表达浪漫与思念。',
          '二十世纪最伟大的西塔琴大师拉维·香卡将这一乐器推向了世界舞台。他通过与国际音乐家（如披头士乐队、小提琴家耶胡迪·梅纽因）的合作，让西方世界领略到了印度古典音乐的深邃魅力。拉维·香卡不仅是一位杰出的演奏家，更是印度音乐文化走向世界的最重要的使者。他的音乐跨越了文化边界，证明了音乐是全人类共通的语言。',
        ],
      },
      3: {
        category: '西方乐器史',
        title: '钢琴的演变：从羽管键琴到现代三角钢琴',
        text: [
          '钢琴的祖先可以追溯到十四世纪的羽管键琴和楔槌键琴。羽管键琴通过羽毛管拨弦发声，音色清脆但无法控制力度变化；楔槌键琴虽然可以通过按键力度控制音量，但声音过于微弱。1709年，意大利人巴托洛梅奥·克里斯托福里发明了世界上第一架能够通过触键力度控制声音强弱的键盘乐器，这便是现代钢琴的雏形。他将这一革命性的发明命名为"有强弱音的羽管键琴"，即"Pianoforte"，后来简称为"Piano"。',
          '在随后的十八世纪和十九世纪，钢琴经历了持续的改良。德国制造商戈特弗里德·西尔伯曼改进了克里斯托福里的击弦机设计，法国人塞巴斯蒂安·埃拉尔发明了双擒纵击弦机，使得快速重复弹奏同一琴键成为可能。到了十九世纪中叶，现代钢琴的基本结构和88个琴键的标准已然确立。与此同时，欧洲工业革命带来的钢铁铸造技术，使得钢琴能够承受更大的琴弦张力，音色也愈发饱满辉煌。',
          '钢琴的发展与西方音乐史紧密相连。从巴赫的音乐逻辑、莫扎特的优雅旋律、贝多芬的磅礴激情，到肖邦的诗意键盘、李斯特的炫技巅峰、德彪西的印象色彩，每一位作曲家都在钢琴上找到了最丰富的表达语言。钢琴是唯一能够完整呈现交响乐总谱的独奏乐器——它跨越七个半八度的宽广音域、从极弱到极强的巨大动态范围，使其赢得了"乐器之王"的美誉。',
          '二十世纪以来，钢琴的形式更加多元：除了传统的三角钢琴和立式钢琴外，还有数字钢琴、舞台电钢琴、合成器等衍生产品。但无论形式如何变化，钢琴作为音乐教育和创作核心的地位从未动摇。如今，全球每年有数百万人学习钢琴，钢琴所承载的音乐文化将继续影响一代又一代人。',
        ],
      },
    },

    init() {
      this.overlay = document.getElementById('cultureModalOverlay');
      this.body = document.getElementById('cultureModalBody');
      this.closeBtn = document.getElementById('cultureModalClose');
      if (!this.overlay) return;

      // Delegate click on "阅读全文" buttons
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-culture-modal]');
        if (!btn) return;
        const id = parseInt(btn.getAttribute('data-culture-modal'), 10);
        this._open(id);
      });

      // Close button
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this._close());
      }

      // Click overlay to close
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this._close();
      });

      // ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.overlay.classList.contains('open')) {
          this._close();
        }
      });
    },

    _open(id) {
      const article = this.articles[id];
      if (!article) return;

      this.body.innerHTML = `
        <span class="modal-article-category">${article.category}</span>
        <h2 class="modal-article-title">${article.title}</h2>
        <div class="modal-article-text">
          ${article.text.map((p) => `<p>${p}</p>`).join('')}
        </div>
      `;

      this.overlay.classList.add('open');
      this.overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    },

    _close() {
      this.overlay.classList.remove('open');
      this.overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    },
  };

  /* ============================================================
     Smooth Scroll for Anchor Links
     ============================================================ */
  const SmoothScroll = {
    init() {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const targetId = link.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const navHeight =
          document.querySelector('.navbar')?.offsetHeight || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({ top, behavior: 'smooth' });
      });
    },
  };

  /* ============================================================
     Current Year
     ============================================================ */
  const FooterYear = {
    init() {
      const el = document.getElementById('current-year');
      if (el) el.textContent = new Date().getFullYear();
    },
  };

  /* ============================================================
     Bootstrap — Application Entry
     ============================================================ */
  function boot() {
    NavController.init();
    ScrollAnimator.init();
    ScrollTop.init();
    LikeHandler.init();
    SmoothScroll.init();
    FooterYear.init();
    CultureModal.init();

    // Refresh animations after DOM settles
    document.addEventListener('DOMContentLoaded', () => {
      ScrollAnimator.refresh();
    });

    window.addEventListener('load', () => {
      ScrollAnimator.refresh();
    });
  }

  // Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
