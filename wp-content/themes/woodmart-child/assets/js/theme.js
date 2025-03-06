BRISE = {};

BRISE.createEl = ({ tag = "div", className = "" }) => {
  const el = document.createElement(tag);

  if (className.length) {
    el.classList.add(className);
  }

  return el;
};

BRISE.uniqueId = (prefix = "") => {
  return (
    prefix +
    (+new Date()).toString(16) +
    ((Math.random() * 100000000) | 0).toString(16)
  );
};

BRISE.keepSameHeight = (items) => {
  // Convert items to an array
  const itemArray = Array.from(items);

  // Reset heights
  itemArray.forEach((item) => (item.style.height = ""));

  // Find the maximum height
  const maxHeight = Math.max(...itemArray.map((item) => item.clientHeight));

  // Set all items to the maximum height
  itemArray.forEach((item) => (item.style.height = `${maxHeight}px`));
};

jQuery(document).ready(function ($) {
  $(".vc_tta-panel.has-image").each(function () {
    const $current = $(this).find(".vc_tta-panel-image"),
      id = $current.closest(".vc_tta-panel").attr("id");
    console.log(id);
    $current.prependTo('.vc_tta-tabs-list a[href^="#' + id + '"]');
  });

  $(".vc_tta-tabs").each(function () {
    if ($(this).find(".vc_tta-panel.has-image").length > 0) {
      $(this).addClass("has-icon-image");
    }
  });

  $(".product-custom-design .wd-images-gallery .gallery-images").each(
    function () {
      if ($(this).find(".wd-gallery-item").length > 4) {
        $(this).addClass("wrapped-items");
        $(this)
          .find(".wd-gallery-item")
          .eq(3)
          .find("a")
          .attr("data-items", "+" + $(this).find(".wd-gallery-item").length);
      }
    }
  );

  /**
   * Define script
   * */
  const $body = jQuery("body");
  const $html = jQuery("html");
  BRISE.css = (el, prop, val) =>
    typeof val !== "undefined"
      ? el.style.setProperty(prop, val)
      : getComputedStyle(el).getPropertyValue(prop);

  /**
   * Update CSS variables
   */
  BRISE.updateCSSVariables = function () {
    let lastValue = 0;

    function update() {
      // only update if viewport width changes
      if (lastValue === document.body.clientWidth) return;
      lastValue = document.body.clientWidth;

      // variable
      const htmlTag = document.documentElement;

      // reset
      BRISE.css(htmlTag, "--br-100vw", "");
      BRISE.css(htmlTag, "--br-gap-side", "");
      BRISE.css(htmlTag, "--br-container", "");

      // calc new value
      const container = 1230;
      const gapContainer = 15;
      const vw100 = document.body.clientWidth;
      const gapSize = Math.max(gapContainer, (vw100 - container) * 0.5);

      // update variables at root element
      BRISE.css(htmlTag, "--br-100vw", `${vw100}px`);

      // update gap side
      BRISE.css(htmlTag, "--br-gap-side", `${gapSize}px`);

      // container size
      BRISE.css(
        htmlTag,
        "--br-container",
        `${Math.min(container, document.body.clientWidth - gapContainer * 2)}px`
      );
    }

    window.addEventListener("resize", update);
    update();

    BRISE.getAddressBarHeight();
  };

  /**
   * Toggle class
   */
  BRISE.toggleClass = function () {
    document.querySelectorAll("[data-toggle]").forEach((el) => {
      const className = el.getAttribute("data-toggle");

      el.addEventListener("click", () => {
        console.log("click");
        document.documentElement.classList.toggle(className);
      });
    });
  };

  /**
   * Get address bar height and update variable v0.0.1
   * https://stackoverflow.com/a/64836824/6453822
   */
  BRISE.getAddressBarHeight = () => {
    const pseudoDiv = BRISE.createEl({
      tag: "div",
      className: "pseudo-address-bar-detector",
    });
    document.body.appendChild(pseudoDiv);

    Object.assign(pseudoDiv.style, {
      height: "100vh",
      width: 0,
      position: "absolute",
      pointerEvents: "none",
    });

    const actualHeight = window.innerHeight;
    const elementHeight = pseudoDiv.clientHeight;
    const barHeight = elementHeight - actualHeight;

    // remove from DOM
    pseudoDiv.remove();

    BRISE.css(
      document.documentElement,
      "--br-address-bar-height",
      `${barHeight}px`
    );
  };

  /**
   * Init Functions
   */
  BRISE.loadFunctions = function () {
    // Theme functions
    BRISE.updateCSSVariables();
    BRISE.toggleClass();
  };

  BRISE.loadFunctions();
});
