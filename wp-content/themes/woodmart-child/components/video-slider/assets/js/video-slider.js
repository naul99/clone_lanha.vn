/**
 * Video Slider
 */
document.querySelectorAll(".br-video-slider").forEach((wrapper) => {
  const iframe = wrapper.querySelector(".br-video-slider__iframe iframe");

  window.addEventListener("click", (e) => {
    const target = e.target.closest(".br-video-slider__video-item");
    if (target) {
      iframe.setAttribute("src", `${target.getAttribute("data-iframe-url")}`);
    }
  });
});
