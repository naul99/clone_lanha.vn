(function ($) {
  $.fn.customFancybox = () => {
    $("[data-custom-fancybox]").each((i, el) => {
      const $this = $(el);
      const options = { buttons: ["close"], animationEffect: "fade" };

      // find selector
      let value = $this.attr("data-custom-fancybox");
      if (!value.length) {
        // generate unique string to use as selector
        value =
          (+new Date()).toString(16) +
          ((Math.random() * 100000000) | 0).toString(16);
        $this.attr("data-custom-fancybox", value);
      }
      options.selector = `[data-custom-fancybox="${value}"]`;

      // check if is gallery
      const isGallery = $(options.selector).length > 1;

      // gallery sync with flickity
      if (isGallery && typeof Flickity !== "undefined") {
        const flkty = Flickity.data(el.closest(".flickity-enabled"));
        if (flkty) {
          // update slider on lightbox change
          options.afterShow = (instance, slide) => {
            // slide to the equivalent image
            flkty.selectCell(slide.index);
          };
        }
      }

      // init fancybox
      $this.fancybox(options);
    });
  };

  setTimeout(() => {
    $.fn.customFancybox();
  }, 50);
})(jQuery);
