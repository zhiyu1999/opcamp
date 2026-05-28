(function () {
  const bubbles = [
    {
      id: "liangzhu",
      title: "良渚",
      eyebrow: "空间即生活方式",
      body: "良渚有五千年的文明遗址，有大片的湿地、稻田、苕溪，有路边随便走走就能遇上的博物馆和老建筑。或许是这种文化的厚度会让外来者迅速地被吸引，在良渚这样的地方，空间就是一种生活方式。"
    },
    {
      id: "foam",
      title: "泡沫",
      eyebrow: "一群真正有意思的 OPC",
      body: "AI 时代的特色是泡沫和 NPC。千万级融资的泡沫、宏大叙事的泡沫、估值曲线的泡沫，伸手一碰就破灭，下面什么都没有。一个人就是一支队伍，想清楚一个产品，动手做出来，找到第一批用户，自己迭代下去。"
    },
    {
      id: "taste",
      title: "taste",
      eyebrow: "懂生活才能做出好产品",
      body: "代码可以 AI 写，框架可以现学，部署可以一键完成。但一个不认真生活的人，做不出有 taste 的产品。一个总在出差、不下厨、不散步、不和朋友坐下来好好聊天的人，对生活的颗粒度就是粗的。"
    },
    {
      id: "waterline",
      title: "水位",
      eyebrow: "为创造者重新找回舒服的水位",
      body: "水位太高，就是淹没。每天 12 个小时盯屏幕、回消息、追指标，水漫过头顶，人是窒息的。水位太低，就是浮夸。水位刚好，是既没有被工作淹没，也没有飘在生活之上，在水里泡着，做着一件有意思的事。"
    },
    {
      id: "spark",
      title: "星火",
      eyebrow: "信任关系和在地网络",
      body: "在借各位真诚友善的朋友们星星之火般的力量，尝试燎原基于信任关系构建出壁垒的生态网络。A single spark can start a prairie fire。祝我们都循此苦旅，抵达繁星。"
    }
  ];

  function bubbleFromButton(button) {
    const list = button.closest(".bubble-arena")
      ? Array.from(document.querySelectorAll(".bubble-arena .float-bubble"))
      : Array.from(document.querySelectorAll(".hero-bubble-layer .float-bubble"));
    const index = Math.max(0, list.indexOf(button));
    return bubbles[index] || bubbles[0];
  }

  function closeFallbackModal() {
    document.querySelector(".bubble-modal.opcamp-fallback-modal")?.remove();
    document.removeEventListener("keydown", handleEscape);
  }

  function handleEscape(event) {
    if (event.key === "Escape") closeFallbackModal();
  }

  function openFallbackModal(bubble, index) {
    closeFallbackModal();

    const modal = document.createElement("div");
    modal.className = "bubble-modal opcamp-fallback-modal";
    modal.innerHTML = [
      '<button class="modal-underlay" aria-label="关闭详情"></button>',
      '<article class="modal-card" role="dialog" aria-modal="true">',
      '<button class="close-button" aria-label="关闭详情">×</button>',
      `<span class="marker">BUBBLE 0${index + 1}</span>`,
      `<h2>${bubble.title}</h2>`,
      `<p class="kicker">${bubble.eyebrow}</p>`,
      `<p>${bubble.body}</p>`,
      "</article>"
    ].join("");

    modal.querySelector(".modal-underlay").addEventListener("click", closeFallbackModal);
    modal.querySelector(".close-button").addEventListener("click", closeFallbackModal);
    document.body.appendChild(modal);
    document.addEventListener("keydown", handleEscape);
  }

  function bindBubble(button) {
    if (button.dataset.opcampBubbleBound === "true") return;
    button.dataset.opcampBubbleBound = "true";
    button.type = "button";
    button.addEventListener("click", function () {
      const bubble = bubbleFromButton(button);
      const index = bubbles.findIndex(item => item.title === button.innerText.trim());

      window.setTimeout(function () {
        if (!document.querySelector(".bubble-modal .modal-card")) {
          openFallbackModal(bubble, index >= 0 ? index : bubbles.indexOf(bubble));
        }
      }, 80);
    });
  }

  function findBubbleAtPoint(clientX, clientY) {
    const buttons = Array.from(document.querySelectorAll(".float-bubble"));

    for (let i = buttons.length - 1; i >= 0; i -= 1) {
      const button = buttons[i];
      const rect = button.getBoundingClientRect();
      const pad = 8;

      if (
        clientX >= rect.left - pad &&
        clientX <= rect.right + pad &&
        clientY >= rect.top - pad &&
        clientY <= rect.bottom + pad
      ) {
        return button;
      }
    }

    return null;
  }

  function markBubbleHit(button, point) {
    button.classList.add("opcamp-hit");
    window.setTimeout(() => button.classList.remove("opcamp-hit"), 420);
    makePopSparks(point.clientX, point.clientY);
  }

  function handlePointActivation(event) {
    if (event.defaultPrevented || document.querySelector(".bubble-modal .modal-card")) return;

    const point = event.changedTouches?.[0] || event;
    if (typeof point.clientX !== "number" || typeof point.clientY !== "number") return;

    const button = event.target.closest?.(".float-bubble") || findBubbleAtPoint(point.clientX, point.clientY);
    if (!button) return;

    event.preventDefault?.();
    event.stopPropagation?.();
    markBubbleHit(button, point);

    const bubble = bubbleFromButton(button);
    const index = bubbles.findIndex(item => item.title === button.innerText.trim());

    window.setTimeout(function () {
      if (!document.querySelector(".bubble-modal .modal-card")) {
        openFallbackModal(bubble, index >= 0 ? index : bubbles.indexOf(bubble));
      }
    }, 80);
  }

  function bindAllBubbles() {
    document.querySelectorAll(".float-bubble").forEach(bindBubble);
  }

  let hoverBubble = null;
  let bubbleCursor = null;

  function getBubbleCursor() {
    if (bubbleCursor) return bubbleCursor;

    bubbleCursor = document.createElement("div");
    bubbleCursor.className = "opcamp-bubble-cursor";
    bubbleCursor.setAttribute("aria-hidden", "true");
    bubbleCursor.innerHTML = [
      '<img src="/images/bubble-pop-gun-icon.png" alt="">',
      '<span class="cursor-primary">击碎泡泡</span>',
      '<span class="cursor-secondary">查看更多细节</span>'
    ].join("");
    document.body.appendChild(bubbleCursor);
    return bubbleCursor;
  }

  function moveBubbleCursor(event) {
    if (!hoverBubble || !event || typeof event.clientX !== "number") return;

    const cursor = getBubbleCursor();
    cursor.style.transform = `translate3d(${event.clientX + 18}px, ${event.clientY + 18}px, 0) rotate(-4deg) scale(1)`;
  }

  function showBubbleCursor(button, event) {
    if (!button.closest(".shoot-section")) return;

    hoverBubble = button;
    const cursor = getBubbleCursor();
    cursor.classList.add("is-visible");
    moveBubbleCursor(event);
  }

  function hideBubbleCursor(button) {
    if (button && hoverBubble !== button) return;

    hoverBubble = null;
    if (bubbleCursor) {
      bubbleCursor.classList.remove("is-visible");
      bubbleCursor.style.transform = "translate3d(-999px, -999px, 0) rotate(-4deg) scale(.88)";
    }
  }

  function makePopSparks(clientX, clientY) {
    if (typeof clientX !== "number" || typeof clientY !== "number") return;

    const count = 10;
    for (let i = 0; i < count; i += 1) {
      const spark = document.createElement("span");
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.34;
      const distance = 42 + Math.random() * 44;
      spark.className = "opcamp-pop-spark";
      spark.style.left = `${clientX}px`;
      spark.style.top = `${clientY}px`;
      spark.style.setProperty("--spark-x", `${Math.cos(angle) * distance}px`);
      spark.style.setProperty("--spark-y", `${Math.sin(angle) * distance}px`);
      document.body.appendChild(spark);
      window.setTimeout(() => spark.remove(), 700);
    }
  }

  function bindBubbleHover(button) {
    if (button.dataset.opcampHoverBound === "true") return;
    button.dataset.opcampHoverBound = "true";

    button.addEventListener("pointerenter", event => showBubbleCursor(button, event));
    button.addEventListener("pointermove", moveBubbleCursor);
    button.addEventListener("pointerleave", () => hideBubbleCursor(button));
    button.addEventListener("focus", event => showBubbleCursor(button, event));
    button.addEventListener("blur", () => hideBubbleCursor(button));
    button.addEventListener("click", event => {
      markBubbleHit(button, event);
    });
  }

  function bindShootHover() {
    document.querySelectorAll(".shoot-section .float-bubble").forEach(bindBubbleHover);
  }

  const copy = {
    onboarding: {
      marker: "// ONBOARDING",
      title: "泡前须知",
      steps: [
        ["01", "往下滑，看看过往的项目发生了什么，有什么 NPC 和有意思的故事"],
        ["02", "泡泡能戳，看看更多有趣的创造"],
        ["03", "觉得这群人还行，觉得事情有意思，欢迎你来～"]
      ],
      button: "▸ 探索 OPCamp"
    },
    about: [
      "回到创造该有的样子，回到纯粹的「有意思」。",
      "很多人第一次来良渚大多是顺路来的，可能是来看看朋友，可能是来参加一个 meet-up，也可能就是听说「良渚最近聚了一群有意思的人」，过来看看是真是假。",
      "我们会推荐他们落脚在汤泉，便宜、实惠还舒服。慢慢地，汤泉就成了一个天然的中转站，大家经常晚上在这里打德扑，因为来到这儿的这群人本来就需要一个能松下来、坐下来聊点什么的地方。",
      "汤泉成为了我们的一种工作方式 + 生活方式，于是在某天一拍脑袋一想，这不就是 work life balance 吗？在这里，可以花二十分钟泡一壶茶聊聊业务，也可以泡一碗泡面就解决晚饭，回去接着把要紧的工作干完。"
    ],
    keywordStatement: {
      title: "在非标的道场，做有「回旋镖」的产品",
      subtitles: ["空间即生活方式", "产品即生活方式"],
      body: "Still a long way to go。AI 推动的所谓平权下，Think Different 某种程度前所未有的重要。work life balance 的探索和平衡，或许是 Think Different 的重要部分；不过重要的是清楚自己想要什么，什么样的生活会让自己感到舒适。在好的场域和空间，会激发正向又正确的无限想象。把更多的繁琐工作交给 agent 和 AI，推动更有创造力的东西，我们一同探索。"
    },
    timeline: [
      {
        title: "Day 1 · 中午｜在地漫游与破冰",
        rows: [
          ["13:00", "数栖湾集合，漫游玉鸟集周边"],
          ["14:20", "良渚在地介绍（大雄）& 三方分享：Artist 分享黑客松经验，Victor 分享 OPC 流量逻辑，Rona 分享空间 / 产品即生活方式"],
          ["15:30", "桌游破冰，自主分组"],
          ["16:00", "前往汤泉，自由泡汤"],
          ["18:30", "集体晚餐；19:30 项目开发启动"],
          ["24:00", "强制休息，不熬夜"]
        ]
      },
      {
        title: "Day 2 · 清晨到傍晚",
        rows: [
          ["08:00", "早餐"],
          ["08:30", "集体八段锦。带领大家打金刚功和长寿功，让身体也参与到创造里。"],
          ["09:00", "私汤浸泡，继续需求对齐"],
          ["12:00", "午餐"],
          ["14:00", "退房，返回数栖湾，继续项目冲刺"],
          ["17:00", "项目路演，每组 5–10 分钟；18:00 正式开始团建"]
        ]
      }
    ],
    rhythmNote: "一群在 AI 时代真正在做事的人，每周在汤泉聚一次，泡 48 小时。都在比「更快」的时代，「亲自然」「长期主义」「价值投资」这样的长线价值观会慢慢回归到人的视野。新一期投入更多的精力聚焦在产品上，一起在非标的道场，做「有回旋镖」的产品。",
    info: [
      ["时间", "5 月 16 日 – 5 月 17 日（两天一夜，含汤泉门票）"],
      ["地点", "良渚汤泉（驻扎与创造）→ 数栖湾（最终 Demo）"],
      ["全程票", "288 元 / 人"],
      ["早鸟票", "188 元 / 人（限 3 人，技术开发者享受）"],
      ["围观票", "188 元 / 人（任选一天）"],
      ["过夜", "汤泉包含过夜。困了就睡，醒了就接着做。"],
      ["餐食", "不含，会有集体觅食，由良渚本地朋友带路，去那些「不带你你大概率找不到」的小馆子。"]
    ],
    npcs: [
      ["三寿", "玄学内容出海", "AI 产品经理，专注于企业 ERP 信息化与数字化建设，并长期进行寺院道观田野调查，关注 AI 产品与技术商业化，分享玄学反诈与行业观察。"],
      ["Artist", "AI + Web3 连续创业者", "DNN 游民网络创始人，ABC Labs 发起人，15 年社区建设者，浙大区块链协会主席和 ETH 杭州发起人。"],
      ["杨小水", "心灵女巫，产品设计师", "gap 创业过设计公司，旅居的心灵女巫，某 AI 玄学产品设计师，请于打开的感受中创造可能！"],
      ["Rona", "05 后探险家", "伪装「连续创业者」，乱探索的 05 后。做过多个创业项目，混迹于 N 个 AI startup，热爱文字、喜欢商业、AI 小学生。"],
      ["大雄", "独立游戏人", "良渚附近的独立游戏人社区「游戏客厅」组织者，前四三九九高级游戏设计师。"],
      ["汽水", "前美团数据工程师，数字游民", "9 年 ToB 数据治理经验，曾一人交付过百万级企业项目。现专注于出海电商的数据分析、数据治理。副业是皮穿支针灸教材编辑，致力于中医现代化。"]
    ],
    quiet: "我们越来越少敢于 shutdown，因为停下的后果总是不确定的，悬浮的状态让人担忧。人生里大部分有意思的事，也都不是计划出来的。比如或许是某个下午，看到太阳你被自动传送到了公园。",
    reviewPeople: [
      ["Rebecca", "先后任职百事中国、佳士得、阿里天猫，现头部消费品牌上市公司 AI 顾问，自研 AI 投资决策智能体 Invert，上海交通大学 / 香港科技大学 EMBA。"],
      ["川", "北大理论物理本硕、德国量子物理博士，做过量化、研究过芯片，目前在西湖大学从事科研。"],
      ["辰辰", "道系修行者，驻守玄门十年，深谙卦象推演、传统养生内修与心性修证之道，以跨次元视角拆解能量逻辑、梳理身心状态。"],
      ["张三", "用纯靠数量取胜的打法，在 5 个月里做了 150 个 APP 并上线实现了盈利。"],
      ["Hersey", "前 36 氪科技记者，现在做自由撰稿，住在良渚算半个本地人。"],
      ["Tris", "做生命科学基因测序的技术销售，同时玩机车、跑步、拍照、研究炒股，还懂点四柱命理。"]
    ],
    reviewProjects: [
      ["鲸落 — 宁窕", "选择心情 → AI 匹配歌单 → 可视化呈现。留学期间游历 29 国。比起 A 面告诉所有人的心情，可以做 B 面，让鲸落听到。"],
      ["TravelMagic — 余", "动态地图旅行轨迹 · 语音创建路线 · 一键分享视频。刚结束 10 个月环球旅行，自称「删除照片狂热爱好者」。"],
      ["这有短剧 — 京富", "AI 短漫剧一站式生产平台。大厂架构师且拥有多个学位，打通从剧本分析、角色定制、分镜绘制到视频合成的完整创作链路。"],
      ["Tempo — ysun", "更符合 AI 时代的 presentation。OPC 全栈开发者，专门做「上台」场景，并且很清楚自己不做什么。"],
      ["桌游社区天梯系统 — 波哥 + 林菲", "跨游戏的身份和段位。波哥从上海到杭州，开了十几年桌游店，把线上天梯的设计思路搬到线下。"],
      ["Moments — 高中生开发者", "现场年龄最小的参与者。AI 让「怎么做」很快就能出来 base demo，但「为什么而做」是只有人和人才能碰撞出来的核心。"]
    ],
    audience: {
      title: "不限定身份。但如果你是这样的人，会在这里很自在：",
      rows: [
        "做过一些事，也踩过一些坑。经历丰富又多元，想用一种不那么紧绷的方式继续做事、也看看新的可能。",
        "相信小工具的力量。相信某些解决生活痛点并闭环的小工具，比「重塑某某行业」更值得花时间。",
        "愿意找到舒服的水位。愿意在 48 小时里，剥掉那些不必要的泡沫，找到自己舒服的水位。"
      ]
    },
    footer: {
      title: "人生需要很多务虚的时刻，需要很多因为审美、因为氛围而被渲染出来的清醒梦境。",
      body: "邀请你来汤泉待两天一夜，和一群同样在认真生活、认真做产品的人玩玩。",
      join: [
        ["朋友推荐（最希望的方式）", "找一位参加过往期的朋友推荐你。人和人之间的信任链条是我们最重视的资产。"],
        ["留言私信 + 一次电话", "身边没有人参加过？欢迎给我们留言或私信，我们会和你做一个 10-15 分钟的电话聊聊。不是面试，就是认识一下。希望在见到新朋友之前，彼此先建立一点真实的连接。毕竟在 AI 时代，人提供的背书和信任，是 AI 替代不了的东西。"]
      ],
      buttons: ["我有朋友推荐 / 我要报名", "我想先和你们聊 10 分钟"],
      partners: "跳格 OutBox · 杭州 OPC 联盟 · ABC Labs · 数栖湾 · 千帆社 · 游戏客厅 · 观玄社"
    }
  };

  function setText(node, text) {
    if (node && node.textContent !== text) node.textContent = text;
  }

  function setImageSource(node, src) {
    if (node && node.getAttribute("src") !== src) node.setAttribute("src", src);
  }

  function renderSiteFallback() {
    if (document.querySelector(".opcamp-static-site")) return;

    const app = document.querySelector(".opcamp");
    if (!app || document.querySelector(".gate-screen") || document.querySelector(".guide-screen")) return;

    const heroText = document.querySelector(".hero-copy")?.textContent || "";
    if (heroText.includes("松弛是一种生产力")) return;

    const fallback = document.createElement("div");
    fallback.className = "opcamp-static-site";
    fallback.innerHTML = `
      <section class="static-hero" id="top">
        <div class="static-hero-copy">
          <p class="topline">// V02    2026 · 5.17 - 5.18    杭州 · 良渚汤泉</p>
          <h1>松弛是一种生产力，<br><span>要[健康的]创造。</span></h1>
          <h2>剥离泡沫，泡进生活。</h2>
          <p>在松弛的空间里做有意思的创造。良渚汤泉 · 48 小时 · 关于空间、AI 产品与生活方式的实验。</p>
          <p class="mono-line">A GATHERING OF OPCs | 48 HOURS OF NOT BEING NPC</p>
          <div class="button-row">
            <a class="site-button primary" href="#signup">报名下一期</a>
            <a class="site-button" href="#review">看看上期都发生了什么</a>
          </div>
        </div>
        <aside class="dictionary">
          <span>泡 / pao /</span>
          <p><b>v.</b> to soak; to immerse oneself fully. 把自己交给当下</p>
          <p><b>n.</b> a bubble; something fragile, fleeting. 易碎，转瞬即逝</p>
        </aside>
      </section>
      <section class="section about-section" id="about">
        <div class="section-grid">
          <div><p class="marker">N°.01</p><h2>关于汤泉 OPCamp</h2></div>
          <div class="long-copy">
            ${copy.about.map((text, index) => `<p class="${index === 0 ? "lead" : ""}">${text}</p>`).join("")}
          </div>
        </div>
      </section>
      <section class="keyword-section">
        <div class="section-head">
          <p class="marker">N°.02 / PRODUCT FIELD</p>
          <h2>${copy.keywordStatement.title}</h2>
        </div>
        <div class="opcamp-keyword-statement">
          <div class="keyword-statement-subtitles">${copy.keywordStatement.subtitles.map(item => `<p>·${item}</p>`).join("")}</div>
          <p class="keyword-statement-body">${copy.keywordStatement.body}</p>
        </div>
      </section>
      <section class="shoot-section">
        <div class="section-head">
          <p class="marker">N°.03 / BUBBLE SHOOT</p>
          <h2>拿起泡泡枪，打碎泡沫看见细节</h2>
          <p class="section-note">点击任意泡泡，打开对应的内容说明。</p>
        </div>
        <div class="bubble-arena static-bubble-arena">
          ${bubbles.map((bubble, index) => {
            const size = 116 + (index % 3) * 18;
            return `<button class="float-bubble field" style="left:${18 + index * 16}%;top:${index % 2 ? 36 : 58}%;width:${size}px;height:${size}px;margin-left:${-size / 2}px;margin-top:${-size / 2}px"><span>${bubble.title}</span></button>`;
          }).join("")}
        </div>
      </section>
      <section class="section timeline-section">
        <div class="section-grid">
          <div><p class="marker">N°.04</p><h2>48 小时怎么过</h2><p class="section-note">留白也是这次「泡」的一部分。我们不会把流程排得太满。</p></div>
          <div class="timeline-wrap">
            ${copy.timeline.map(group => `<article class="timeline-group"><h3>${group.title}</h3>${group.rows.map(row => `<div><span>${row[0]}</span><p>${row[1]}</p></div>`).join("")}</article>`).join("")}
          </div>
        </div>
      </section>
      <section class="section rhythm-section">
        <div class="section-grid">
          <div><p class="marker">N°.05</p><h2>汤泉 OPCamp，每周一期。</h2><p class="section-note">${copy.rhythmNote}</p></div>
          <div class="info-table">${copy.info.map(row => `<div><span>${row[0]}</span><p>${row[1]}</p></div>`).join("")}</div>
        </div>
        <div class="npc-grid">${copy.npcs.map((npc, index) => `<article><span class="marker">NPC 0${index + 1}</span><h3>${npc[0]}</h3><p class="kicker">${npc[1]}</p><p>${npc[2]}</p></article>`).join("")}</div>
      </section>
      <section class="photo-break">
        <div class="quiet-copy-wrap"><p class="quiet-manifesto">${copy.quiet}</p></div>
      </section>
      <section class="section review-section" id="review">
        <div class="section-head"><p class="marker">N°.06 / REVIEW</p><h2>往期回顾</h2></div>
        <div class="review-strip">${copy.reviewPeople.map((item, index) => `<article><span class="marker">0${index + 1}</span><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join("")}</div>
        <blockquote>AI 让「怎么做」很快就能出来 base demo，但「为什么而做」是只有人和人才能碰撞出来的核心。</blockquote>
      </section>
      <section class="audience-section">
        <h2>${copy.audience.title}</h2>
        <div>${copy.audience.rows.map((row, index) => `<article><span>N°.0${index + 1}</span><p>${row}</p></article>`).join("")}</div>
      </section>
      <footer class="footer-section" id="signup">
        <img src="/images/bg-giant-bubble.png" alt="">
        <div>
          <p class="marker">N°.08 / SIGNUP</p>
          <h2>${copy.footer.title}</h2>
          <p>${copy.footer.body}</p>
          <div class="join-grid">${copy.footer.join.map((item, index) => `<article><span>0${index + 1}</span><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join("")}</div>
          <div class="button-row centered">
            <a class="site-button primary" href="https://hcn9m5eta0s5.feishu.cn/share/base/form/shrcnf03FAZqhlNjgvKGUrkmuuf">${copy.footer.buttons[0]}</a>
            <a class="site-button" href="https://hcn9m5eta0s5.feishu.cn/share/base/form/shrcnf03FAZqhlNjgvKGUrkmuuf">${copy.footer.buttons[1]}</a>
          </div>
          <p class="partners">${copy.footer.partners}</p>
          <p class="copyright">© 2026 汤泉 OPCamp · LIANGZHU</p>
        </div>
      </footer>
    `;
    app.appendChild(fallback);
    bindAllBubbles();
    bindShootHover();
  }

  function updateCards(selector, items, updater) {
    document.querySelectorAll(selector).forEach((node, index) => {
      const item = items[index];
      if (item) updater(node, item, index);
    });
  }

  function updateReview() {
    const activeText = document.querySelector(".review-section .tab-row button.active")?.textContent?.trim();
    const items = activeText === "项目作品" ? copy.reviewProjects : copy.reviewPeople;

    updateCards(".review-strip article", items, (article, item) => {
      setText(article.querySelector("h3"), item[0]);
      setText(article.querySelector("p:not(.marker)"), item[1]);
    });
  }

  function updateModalCopy() {
    const modal = document.querySelector(".bubble-modal .modal-card");
    if (!modal) return;

    const title = modal.querySelector("h2")?.textContent?.trim();
    const bubble = bubbles.find(item => item.title === title);
    if (!bubble) return;

    setText(modal.querySelector(".kicker"), bubble.eyebrow);
    const body = Array.from(modal.querySelectorAll("p")).find(node => !node.classList.contains("kicker"));
    setText(body, bubble.body);
  }

  function applyCopyUpdates() {
    const guide = document.querySelector(".guide-panel");
    if (guide) {
      setText(guide.querySelector(".marker"), copy.onboarding.marker);
      setText(guide.querySelector("h1"), copy.onboarding.title);
      updateCards(".guide-panel article", copy.onboarding.steps, (article, item) => {
        setText(article.querySelector("span"), item[0]);
        setText(article.querySelector("p"), item[1]);
      });
      setText(guide.querySelector(".site-button.primary"), copy.onboarding.button);
    }

    const aboutParagraphs = document.querySelectorAll(".about-section .long-copy p");
    copy.about.forEach((text, index) => setText(aboutParagraphs[index], text));

    const keywordSection = document.querySelector(".keyword-section");
    if (keywordSection) {
      setText(keywordSection.querySelector(".section-head h2"), copy.keywordStatement.title);
      setText(keywordSection.querySelector(".section-head .marker"), "N°.02 / PRODUCT FIELD");
      keywordSection.querySelector(".keyword-row")?.setAttribute("aria-hidden", "true");

      let statement = keywordSection.querySelector(".opcamp-keyword-statement");
      if (!statement) {
        statement = document.createElement("div");
        statement.className = "opcamp-keyword-statement";
        statement.innerHTML = [
          '<div class="keyword-statement-subtitles"></div>',
          '<p class="keyword-statement-body"></p>'
        ].join("");
        keywordSection.querySelector(".keyword-row")?.insertAdjacentElement("beforebegin", statement);
      }

      const subtitleWrap = statement.querySelector(".keyword-statement-subtitles");
      copy.keywordStatement.subtitles.forEach((text, index) => {
        let item = subtitleWrap.children[index];
        if (!item) {
          item = document.createElement("span");
          subtitleWrap.appendChild(item);
        }
        item.textContent = `·${text}`;
      });
      Array.from(subtitleWrap.children).slice(copy.keywordStatement.subtitles.length).forEach(item => {
        item.remove();
      });
      setText(statement.querySelector(".keyword-statement-body"), copy.keywordStatement.body);
    }

    updateCards(".timeline-group", copy.timeline, (group, item) => {
      setText(group.querySelector("h3"), item.title);
      group.querySelectorAll(":scope > div").forEach((row, rowIndex) => {
        const rowItem = item.rows[rowIndex];
        if (!rowItem) return;
        setText(row.querySelector("span"), rowItem[0]);
        setText(row.querySelector("p"), rowItem[1]);
      });
    });

    setText(document.querySelector(".rhythm-section .section-note"), copy.rhythmNote);
    updateCards(".info-table > div", copy.info, (row, item) => {
      setText(row.querySelector("span"), item[0]);
      setText(row.querySelector("p"), item[1]);
    });

    updateCards(".npc-grid article", copy.npcs, (article, item, index) => {
      setText(article.querySelector(".marker"), `NPC 0${index + 1}`);
      setText(article.querySelector("h3"), item[0]);
      setText(article.querySelector(".kicker"), item[1]);
      setText(article.querySelector("p:not(.kicker)"), item[2]);
    });

    setText(document.querySelector(".quiet-manifesto"), copy.quiet);
    setImageSource(document.querySelector(".photo-break .break-photo img"), "/images/bg-beach-bubbles.png");
    updateReview();

    setText(document.querySelector(".audience-section h2"), copy.audience.title);
    updateCards(".audience-section article", copy.audience.rows, (article, item) => {
      setText(article.querySelector("p"), item);
    });

    const footer = document.querySelector(".footer-section");
    if (footer) {
      setImageSource(footer.querySelector(":scope > img"), "/images/bg-giant-bubble.png");
      setText(footer.querySelector("h2"), copy.footer.title);
      setText(footer.querySelector("h2 + p"), copy.footer.body);
      updateCards(".join-grid article", copy.footer.join, (article, item) => {
        setText(article.querySelector("h3"), item[0]);
        setText(article.querySelector("p"), item[1]);
      });
      updateCards(".footer-section .button-row a", copy.footer.buttons, (button, item) => {
        setText(button, item);
      });
      setText(footer.querySelector(".partners"), copy.footer.partners);
    }

    updateModalCopy();
    window.setTimeout(renderSiteFallback, 900);
  }

  document.addEventListener("DOMContentLoaded", bindAllBubbles);
  document.addEventListener("DOMContentLoaded", bindShootHover);
  document.addEventListener("DOMContentLoaded", applyCopyUpdates);
  document.addEventListener("click", handlePointActivation, true);
  document.addEventListener("pointerup", handlePointActivation, true);
  document.addEventListener("touchend", handlePointActivation, true);
  window.addEventListener("click", handlePointActivation, true);
  window.addEventListener("pointerup", handlePointActivation, true);
  window.addEventListener("touchend", handlePointActivation, true);

  const observer = new MutationObserver(function () {
    bindAllBubbles();
    bindShootHover();
    applyCopyUpdates();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
