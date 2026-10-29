/**
 * 艺声乐器文化传播网站 — 音乐社区留言板（无限循环 · FLIP 丝滑动画）
 * Yisheng Musical Culture — Community Message Board (Infinite Cycle)
 */
(function () {
  'use strict';

  /* ================================================================
     留言池
     ================================================================ */
  var MESSAGES = [
    { id: 1, nickname: '古筝爱好者', avatar: '筝', avatarColor: '#6944e8', date: '2026-06-03 14:30', content: '今天第一次去听了古筝音乐会，《渔舟唱晚》真的太美了！强烈推荐大家去感受一下中国古典音乐的魅力。' },
    { id: 2, nickname: '节奏之王',   avatar: '鼓', avatarColor: '#e8734a', date: '2026-06-03 10:15', content: '学非洲鼓三个月了，每天练习一小时，现在终于能打出基本节奏型了！有没有一起学打击乐的朋友？一起交流学习心得~' },
    { id: 3, nickname: '爵士迷',     avatar: '萨', avatarColor: '#3b82f6', date: '2026-06-02 21:45', content: '最近迷上了萨克斯风，John Coltrane的《A Love Supreme》听了一百遍都不腻。萨克斯的音色真的有一种直击灵魂的力量。' },
    { id: 4, nickname: '钢琴教师',   avatar: '琴', avatarColor: '#5840d9', date: '2026-06-02 16:00', content: '作为一名钢琴老师，我想说学琴最重要的不是天赋，而是坚持。每天练30分钟比周末突击3小时效果好得多。家长们一定要有耐心，陪伴是最好的教育。' },
    { id: 5, nickname: '吉他少年',   avatar: '吉', avatarColor: '#22c55e', date: '2026-06-02 09:20', content: '学吉他一年了，刚买了第一把电吉他！Fender Stratocaster，经典日落色，手感真的太棒了。接下来要好好练solo技巧~' },
    { id: 6, nickname: '文化行者',   avatar: '文', avatarColor: '#f97316', date: '2026-06-01 20:00', content: '读完文化溯源栏目的尺八文章，感触很深。尺八从中国传到日本后，竟然发展出了完全不同的音乐文化。音乐真是文化交流最好的桥梁。' },
    { id: 7, nickname: '民乐守护者', avatar: '二', avatarColor: '#ef4444', date: '2026-06-01 14:55', content: '最近在学二胡，《二泉映月》的前奏练了两周还没完全掌握。二胡太考验基本功了，但一旦拉出那个味道，一切都值了！' },
    { id: 8, nickname: '音乐初心者', avatar: '乐', avatarColor: '#8b5cf6', date: '2026-06-01 11:30', content: '大家好！我刚接触乐器，目前在看钢琴和古筝之间纠结。钢琴比较通用但占地方，古筝音色好听但学习资源少一些。大家有什么建议吗？' }
  ];

  /* ================================================================
     配置 — 统一节奏，动画时长一致
     ================================================================ */
  var VISIBLE_MAX = 8;
  var CYCLE_INTERVAL = 2500;    // 轮播间隔 (ms) — 初始弹出和循环共用此速度
  var STAGGER_DELAY = CYCLE_INTERVAL;  // 初始弹出间隔 = 循环速度（保持一致）
  var CYCLE_START_PAUSE = CYCLE_INTERVAL;  // 初始完成后停顿 = 循环速度
  var ANIM_DURATION = 400;      // 单次动画时长 (ms) — 卡片位移、缩放均统一

  /* ================================================================
     状态
     ================================================================ */
  var cycleIdx = VISIBLE_MAX;
  var cycleTimer = null;

  /* ================================================================
     工具
     ================================================================ */
  function esc(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function createCard(m) {
    var article = document.createElement('article');
    article.className = 'message-card';
    article.innerHTML =
      '<div class="message-main">' +
        '<div class="message-avatar" style="background-color:' + m.avatarColor + ';">' +
          '<span>' + esc(m.avatar) + '</span>' +
        '</div>' +
        '<div class="message-body">' +
          '<div class="message-header">' +
            '<span class="message-nickname">' + esc(m.nickname) + '</span>' +
            '<span class="message-date">' + esc(m.date) + '</span>' +
          '</div>' +
          '<p class="message-content">' + esc(m.content) + '</p>' +
        '</div>' +
      '</div>';
    return article;
  }

  /* ================================================================
     FLIP 动画核心
     ================================================================ */
  function flipInsert(card) {
    var container = document.getElementById('messages-list');
    if (!container) return;

    var existing = container.querySelectorAll('.message-card');
    var count = existing.length;

    // First — 记录所有现有卡片的位置
    var prevY = [];
    for (var i = 0; i < count; i++) {
      prevY.push(existing[i].getBoundingClientRect().top);
    }

    // 新卡片以全尺寸插入顶部（不可见）
    card.style.opacity = '0';
    card.style.transform = 'scale(0.6)';
    container.insertBefore(card, container.firstChild);

    // Last — 计算位移差，反向补偿
    for (var i = 0; i < count; i++) {
      var newY = existing[i].getBoundingClientRect().top;
      var delta = prevY[i] - newY;
      if (Math.abs(delta) > 0.5) {
        existing[i].style.transition = 'none';
        existing[i].style.transform = 'translateY(' + delta + 'px)';
      }
    }

    // 强制重绘
    container.offsetHeight;

    // Invert + Play — 动画归零
    var dur = (ANIM_DURATION / 1000).toFixed(2) + 's';
    var ease = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
    for (var j = 0; j < count; j++) {
      existing[j].style.transition = 'transform ' + dur + ' ' + ease;
      existing[j].style.transform = '';
    }

    // 新卡片缩放 + 淡入
    card.style.transition =
      'opacity ' + dur + ' ease,' +
      'transform ' + dur + ' cubic-bezier(0.34, 1.56, 0.64, 1)';
    requestAnimationFrame(function () {
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    });

    // 清理
    setTimeout(function () {
      card.style.transition = '';
      card.style.opacity = '';
      card.style.transform = '';
      for (var k = 0; k < count; k++) {
        if (existing[k]) {
          existing[k].style.transition = '';
          existing[k].style.transform = '';
        }
      }
    }, ANIM_DURATION + 50);
  }

  /* ================================================================
     底部卡片移除（瞬间，不带动画 — FLIP 已掩盖位移）
     ================================================================ */
  function removeCardBottom() {
    var container = document.getElementById('messages-list');
    if (!container) return;
    var cards = container.querySelectorAll('.message-card');
    if (cards.length === 0) return;
    cards[cards.length - 1].remove();
  }

  /* ================================================================
     轮播一步
     ================================================================ */
  function cycleOne() {
    var msg = MESSAGES[cycleIdx % MESSAGES.length];
    cycleIdx++;
    removeCardBottom();
    flipInsert(createCard(msg));
    updateStats();
  }

  /* ================================================================
     启动留言板
     ================================================================ */
  function startBoard() {
    var container = document.getElementById('messages-list');
    if (!container) return;
    container.innerHTML = '';

    var limit = Math.min(VISIBLE_MAX, MESSAGES.length);
    for (var i = 0; i < limit; i++) {
      (function (index) {
        setTimeout(function () {
          flipInsert(createCard(MESSAGES[index]));
          if (index === limit - 1) {
            setTimeout(function () {
              cycleTimer = setInterval(cycleOne, CYCLE_INTERVAL);
            }, CYCLE_START_PAUSE);
          }
        }, index * STAGGER_DELAY);
      })(i);
    }

    cycleIdx = limit;
    updateStats();
  }

  /* ================================================================
     用户发布留言
     ================================================================ */
  function initForm() {
    var form = document.getElementById('message-form');
    var nicknameInput = document.getElementById('msg-nickname');
    var contentInput = document.getElementById('msg-content');
    var charCount = document.getElementById('char-count');
    if (!form) return;

    if (contentInput && charCount) {
      contentInput.addEventListener('input', function () {
        charCount.textContent = contentInput.value.length;
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nickname = nicknameInput.value.trim();
      var content = contentInput.value.trim();
      if (!nickname || !content) { toast('请填写标题和留言内容'); return; }
      if (content.length > 500) { toast('留言内容不能超过500字'); return; }

      var colors = ['#6944e8','#e8734a','#3b82f6','#22c55e','#f97316','#ef4444','#8b5cf6','#ec4899'];
      var now = new Date();
      var date =
        now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0');

      var msg = {
        id: Date.now(),
        nickname: nickname,
        avatar: nickname.charAt(0),
        avatarColor: colors[Math.floor(Math.random() * colors.length)],
        date: date,
        content: content
      };

      MESSAGES.push(msg);
      removeCardBottom();
      flipInsert(createCard(msg));

      form.reset();
      if (charCount) charCount.textContent = '0';
      updateStats();
      toast('留言发布成功！');
    });
  }

  /* ================================================================
     统计
     ================================================================ */
  function updateStats() {
    var totalEl = document.getElementById('total-messages');
    var todayEl = document.getElementById('today-messages');
    var likesEl = document.getElementById('total-likes');
    var onlineEl = document.getElementById('online-users');

    if (totalEl) totalEl.textContent = MESSAGES.length;
    if (todayEl) {
      var today = new Date();
      var todayStr = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');
      todayEl.textContent = MESSAGES.filter(function (m) {
        return m.date.startsWith(todayStr);
      }).length;
    }
    if (likesEl) likesEl.textContent = 56 + MESSAGES.length - 8;
    if (onlineEl) onlineEl.textContent = Math.floor(Math.random() * 8) + 8;
  }

  /* ================================================================
     Toast
     ================================================================ */
  function toast(message) {
    var wrap = document.getElementById('toastWrap');
    if (!wrap) return;
    wrap.querySelectorAll('.toast-item').forEach(function (t) { t.remove(); });
    var el = document.createElement('div');
    el.className = 'toast-item';
    el.textContent = message;
    wrap.appendChild(el);
    setTimeout(function () { el.remove(); }, 2500);
  }

  /* ================================================================
     启动
     ================================================================ */
  function boot() {
    startBoard();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
