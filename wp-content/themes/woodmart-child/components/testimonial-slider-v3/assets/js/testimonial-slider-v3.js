/**
 * Testimonial Slider v3
 */
document.querySelectorAll(".br-testimonial-slider-v3").forEach((wrapper) => {
  let slider;
  const initSlider = () => {
    slider = new FlickityResponsive(
      wrapper.querySelector(".br-testimonial-slider-v3__items"),
      {
        contain: true,
        prevNextButtons: false,
        groupCells: "100%",
        autoPlay:
          parseFloat(wrapper.getAttribute("data-autoplay-speed")) * 1000,
        wrapAround: wrapper.classList.contains("slider-loop"),
        responsive: [
          {
            breakpoint: 768,
            settings: {
              pageDots: false,
            },
          },
        ],
      }
    );
  };

  window.addEventListener("load", () => {
    BRISE.keepSameHeight(
      wrapper.querySelectorAll(".br-testimonial-slider-v3__item")
    );
    initSlider();
  });

  window.addEventListener("resize", () => {
    slider.resize();
    BRISE.keepSameHeight(
      wrapper.querySelectorAll(".br-testimonial-slider-v3__item")
    );
  });
});
