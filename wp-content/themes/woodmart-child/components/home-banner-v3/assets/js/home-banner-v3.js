/**
 * Home Banner
 */
document.querySelectorAll(".br-home-banner-v3").forEach((wrapper) => {
  new Flickity(wrapper, {
    contain: true,
    fade: true,
    prevNextButtons: false,
    autoPlay: parseFloat(wrapper.getAttribute("data-autoplay-speed")) * 1000,
    wrapAround: wrapper.classList.contains("slider-loop"),
  });
});
