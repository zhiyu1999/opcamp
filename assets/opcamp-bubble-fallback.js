(function () {
  const bubbles = [
    {
      id: "liangzhu",
      title: "良渚",
      eyebrow: "空间即生活方式",
      body: "良渚有湿地、稻田、苕溪、博物馆和老建筑。它会无声地修改一个外来者的状态，让创造不再只发生在屏幕前，而是发生在具体的空气、饭桌、散步和夜谈里。"
    },
    {
      id: "foam",
      title: "泡沫",
      eyebrow: "一群真正有意思的 OPC",
      body: "AI 时代有太多宏大叙事和估值曲线的泡沫。我们更关心一个真实的人，是否因为一个产品，今天的生活比昨天好了一点。"
    },
    {
      id: "taste",
      title: "taste",
      eyebrow: "懂生活才能做出好产品",
      body: "代码可以 AI 写，框架可以现学，部署可以一键完成。但一个不认真生活的人，很难做出有颗粒度、有分寸感、也真正贴近生活的产品。"
    },
    {
      id: "waterline",
      title: "水位",
      eyebrow: "为创造者找回舒服水位",
      body: "水位太高会窒息，水位太低会浮夸。水位刚好，是既没有被工作淹没，也没有飘在生活之上，在水里泡着，做着一件有意思的事。"
    },
    {
      id: "spark",
      title: "星火",
      eyebrow: "信任关系和在地网络",
      body: "我们借朋友们星星之火般的力量，尝试燎原一种基于信任关系构建出的生态网络。人提供的背书和连接，是 AI 替代不了的东西。"
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

  function handlePointActivation(event) {
    if (event.defaultPrevented || document.querySelector(".bubble-modal .modal-card")) return;

    const point = event.changedTouches?.[0] || event;
    if (typeof point.clientX !== "number" || typeof point.clientY !== "number") return;

    const button = event.target.closest?.(".float-bubble") || findBubbleAtPoint(point.clientX, point.clientY);
    if (!button) return;

    event.preventDefault?.();
    event.stopPropagation?.();

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

  document.addEventListener("DOMContentLoaded", bindAllBubbles);
  document.addEventListener("click", handlePointActivation, true);
  document.addEventListener("pointerup", handlePointActivation, true);
  document.addEventListener("touchend", handlePointActivation, true);
  window.addEventListener("click", handlePointActivation, true);
  window.addEventListener("pointerup", handlePointActivation, true);
  window.addEventListener("touchend", handlePointActivation, true);

  const observer = new MutationObserver(bindAllBubbles);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
