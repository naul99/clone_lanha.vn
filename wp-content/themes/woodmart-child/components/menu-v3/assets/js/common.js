/**
 * Add delay for submenu stagger animation v1.2.0
 * @since 3.3.0
 */
BRISE.submenuAnimationDelay = function ({ step = 40 } = {}) {
  document.querySelectorAll(".desktop-menu ul.sub-menu").forEach((el) => {
    Array.from(el.children).forEach((e, index) => {
      e.style.animationDelay = step * (index + 1) + "ms";
    });
  });
};
BRISE.submenuAnimationDelay();

/**
 * Avoid first click on large touch screen devices v2.0.3
 */
BRISE.avoidFirstClick = function () {
  // is touch screen
  const isAvoid = () => {
    const isTouchScreen = document
      .querySelector("html")
      .classList.contains("vc_mobile");
    const isMobileLayout = window.innerWidth <= 1180;
    return isTouchScreen && isMobileLayout;
  };

  if (!isAvoid()) return;

  const itemsHasChild = document.querySelectorAll(
    '.desktop-menu ul.menu li[class*="has-child"] > a'
  );
  const removeClickable = (item) => item.classList.remove("clickable");

  itemsHasChild.forEach((item) => {
    // on click
    item.addEventListener("click", (e) => {
      if (item.classList.contains("clickable")) return;

      e.preventDefault();
      item.classList.add("clickable");
    });

    // on mouse leave => remove clickable
    item
      .closest('li[class*="has-child"]')
      .addEventListener("mouseleave", () => removeClickable(item));

    // on menu button click > remove clickable
    document.querySelectorAll('[data-toggle="menu-open"]').forEach((btn) => {
      btn.addEventListener("click", () => removeClickable(item));
    });
  });
};
BRISE.avoidFirstClick();

/**
 * Mobile Menu Accordion v2.0.3
 * Required Easy Tab Accordion
 */
BRISE.mobileMenuAccordion = ({
  ul = ".mobile-menu ul",
  isButtonInsideLink = false,
} = {}) => {
  document.querySelectorAll(ul).forEach((ul) => {
    const ul_id = BRISE.uniqueId("ul-");
    const triggerAttr = `data-submenu-trigger-${ul_id}`;
    const receiverAttr = `data-submenu-id-${ul_id}`;

    const createArrowButton = (li) => {
      const li_id = BRISE.uniqueId("li-");

      // check href
      const a = li.querySelector(":scope > a");
      const href = a.getAttribute("href");
      const isEmptyLink = href === "#" || href === null;

      // add id for submenu
      const ul = li.querySelector(":scope > ul");
      if (!ul) return;
      ul.setAttribute(receiverAttr, li_id);

      // create button
      const button = BRISE.createEl({
        tag: "div",
        className: "menu-item-arrow",
      });
      if (isButtonInsideLink && isEmptyLink) {
        button.innerHTML = `<button class="menu-item-arrow__button t"><i class="fa-solid fa-chevron-down"></i></button>`;
        a.setAttribute(triggerAttr, li_id);
      } else {
        button.innerHTML = `<button class="menu-item-arrow__button t" ${triggerAttr}="${li_id}"><i class="fa-solid fa-chevron-down"></i></button>`;
      }

      // place button
      if (isButtonInsideLink && isEmptyLink) {
        a.innerHTML = `<span>${a.innerHTML}</span>`;
        a.appendChild(button);
        a.classList.add("has-arrow-inside");
      } else {
        li.appendChild(button);
      }
    };

    // create arrow button
    let activeSection = -1;
    let hasChildInside = false;

    ul.querySelectorAll(
      ':scope > li[class*="has-child"]:not([class*="mega"])'
    ).forEach((li, index) => {
      hasChildInside = true;
      createArrowButton(li);

      const isCurrent = () => {
        let result = false;
        li.classList.forEach((string) => {
          if (string.indexOf("current") !== -1) result = true;
        });
        return result;
      };
      if (isCurrent() && activeSection === -1) {
        activeSection = index;
      }
    });

    // avoid creating meaningless ETA instance
    if (hasChildInside) {
      // init accordion
      new EasyTabAccordion({
        el: ul,
        trigger: `[${triggerAttr}]`,
        triggerAttr: triggerAttr,
        receiver: `[${receiverAttr}]`,
        receiverAttr: receiverAttr,
        allowCollapseAll: true,
        activeSection,
        onBeforeOpen: () => {
          setTimeout(() => {
            document
              .querySelector(`[${receiverAttr}]`)
              .closest("li")
              .classList.add("opening");
          }, 50);
        },
        onBeforeClose: () => {
          document
            .querySelector(`[${receiverAttr}]`)
            .closest("li")
            .classList.remove("opening");
        },
      });
    }
  });
};
BRISE.mobileMenuAccordion();

/**
 * Line animation for menu hover v2.0.3
 */
BRISE.menuHoverLineAnimation = function (options) {
  // vars
  const settings = {
    wrapper: "", // string selector
    listItem: ":scope > li", // string selector
    css: {},
    defaultItem: '[class*="current"]',
    ...options,
  };

  // update position
  function updatePosition(listItem, line) {
    if (!listItem) {
      line.style.opacity = "0";
    } else {
      const halfWidth = listItem.offsetWidth * 0.5;

      const spacing =
        EV.getOffset(listItem).left -
        EV.getOffset(document.querySelector(settings.wrapper)).left;
      const offset = spacing + halfWidth;
      const transformX = offset - halfWidth;

      Object.assign(line.style, {
        transform: `translateX(${transformX}px)`,
        width: `${listItem.offsetWidth}px`,
        opacity: "",
      });
    }
  }

  // loop each wrapper
  document.querySelectorAll(settings.wrapper).forEach((wrapper) => {
    const listItems = wrapper.querySelectorAll(settings.listItem);
    const defaultListItem = wrapper.querySelector(settings.defaultItem);
    let isStillInUl = false;

    const line = document.createElement("div");
    wrapper.appendChild(line);

    const style = {
      position: "absolute",
      left: "0",
      ...settings.css,
    };

    Object.assign(line.style, style);

    // hover in
    listItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        updatePosition(item, line);
      });
    });

    // hover out
    listItems.forEach((item) => {
      item.addEventListener("mouseleave", () => {
        if (!isStillInUl) updatePosition(defaultListItem, line);
      });
    });

    // hover on ul
    wrapper.addEventListener("mouseenter", () => {
      isStillInUl = true;
    });
    wrapper.addEventListener("mouseleave", () => {
      isStillInUl = false;
      updatePosition(defaultListItem, line);
    });

    // on load
    if (defaultListItem) {
      updatePosition(defaultListItem, line);
    }
  });
};
// BRISE.menuHoverLineAnimation({
//     wrapper: ".desktop-menu.main-menu ul.menu", css: {
//         bottom: '-1px',
//         height: '3px',
//         backgroundColor: 'var(--br-color-primary)',
//         pointerEvents: 'none',
//         transition: 'all .6s ease, opacity .2s',
//     }
// });

BRISE.handleScroll = () => {
  // Track the last known scroll position
  let lastScrollY = 0;

  // Function to add and remove classes based on scroll position
  function handleClass() {
    const body = document.body;
    const scrollY = window.scrollY || window.pageYOffset;
    const pageHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    // Remove all scroll-related classes first
    body.classList.remove(
      "scroll-top",
      "scroll-middle",
      "scroll-bottom",
      "scroll-up",
      "scroll-down"
    );

    // Add class based on scroll direction
    if (scrollY > lastScrollY) {
      body.classList.add("scroll-down");
    } else if (scrollY < lastScrollY) {
      body.classList.add("scroll-up");
    }

    // Update the last scroll position
    lastScrollY = scrollY;

    // Add class based on page position
    if (scrollY === 0) {
      body.classList.add("scroll-top");
    } else if (scrollY >= pageHeight) {
      body.classList.add("scroll-bottom");
    } else {
      body.classList.add("scroll-middle");
    }
  }

  // Add the scroll event listener
  window.addEventListener("scroll", handleClass);
  window.addEventListener("DOMContentLoaded", handleClass);
};
BRISE.handleScroll();
