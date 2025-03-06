/**
 * Gallery
 */
document.querySelectorAll(".br-gallery-slider-v3").forEach((wrapper) => {
  const itemsWrapper = wrapper.querySelector(".br-gallery-slider-v3__items"),
    loopSliderSettings = wrapper.classList.contains("slider-loop"),
    itemsCount = wrapper.querySelectorAll(".br-gallery-slider-v3__item").length;
  let slider = undefined;

  // restructure HTML for slider
  const restructureSliderItem = (fromDesktopToMobile = true) => {
    if (fromDesktopToMobile) {
      wrapper
        .querySelectorAll(".br-gallery-slider-v3__item-group")
        .forEach((wrap) => (wrap.outerHTML = wrap.innerHTML));
    } else {
      const items = wrapper.querySelectorAll(".br-gallery-slider-v3__item"),
        totalGroup =
          Math.floor(items.length / 5) + (items.length % 5 === 0 ? 0 : 1);

      // remove all groups item
      itemsWrapper
        .querySelectorAll(".br-gallery-slider-v3__item-group")
        .forEach((child) => child.remove());

      // group items
      for (let i = 0; i < totalGroup; i++) {
        const group = BRISE.createEl({
          tag: "div",
          className: "br-gallery-slider-v3__item-group",
        });
        for (let j = 0; j < 5; j++) {
          if (!!items[5 * i + j]) group.appendChild(items[5 * i + j]);
        }

        // append group to item wrapper
        itemsWrapper.appendChild(group);
      }
    }
  };

  // resize to handle slider
  new MatchMediaScreen({
    object: {
      isDesktop: true,
      responsive: [
        {
          breakpoint: 767,
          settings: {
            isDesktop: false,
          },
        },
      ],
    },
    debounce: 100, // [ms] debounce time on resize event
    // fire everytime a matched breakpoint is found
    onMatched: (data) => {
      // check loop base on number items
      const hasLoop =
        itemsCount > (data.object.isDesktop ? 5 : 2) && loopSliderSettings;

      // check loop class
      if (hasLoop) {
        wrapper.classList.add("slider-loop");
      } else {
        wrapper.classList.remove("slider-loop");
      }

      // destroy slider
      if (slider !== undefined) slider.destroy();

      // restructure HTML
      restructureSliderItem(!data.object.isDesktop);

      // re-init slider
      window.addEventListener("load", () => {
        slider = new FlickityResponsive(itemsWrapper, {
          contain: true,
          pageDots: false,
          autoPlay:
            parseFloat(wrapper.getAttribute("data-autoplay-speed")) * 1000,
          wrapAround: hasLoop,
          prevNextButtons: false,
          fade: data.object.isDesktop,
          prevArrow: data.object.isDesktop
            ? wrapper.querySelector(".br-gallery-slider-v3__nav .previous")
            : false,
          nextArrow: data.object.isDesktop
            ? wrapper.querySelector(".br-gallery-slider-v3__nav .next")
            : false,
          on: {
            ready: () => {
              wrapper
                .querySelectorAll(".br-gallery-slider-v3__item")
                .forEach((item) => {
                  item.querySelector("a").setAttribute("tabindex", "-1");
                });
            },
          },
        });
        slider.resize();
      });
    },
  });
});
