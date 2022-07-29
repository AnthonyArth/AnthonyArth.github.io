let items = document.querySelectorAll("#computer-timeline li");

function isElementInViewport(element) {
    let rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function slideIn() {
    for (let i = 0; i < items.length; ++i) {
      if (isElementInViewport(items[i])) {
        items[i].classList.add("slide-in");
      } else {
        items[i].classList.remove("slide-in");
      }
    }
}

window.addEventListener("load", slideIn);
window.addEventListener("scroll", slideIn);
window.addEventListener("resize", slideIn);