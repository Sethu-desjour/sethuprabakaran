// Fade sections in as they scroll into view.
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

// Border under the nav once the page is scrolled.
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

document.getElementById("year").textContent = new Date().getFullYear();

// Build the mailto link at runtime so the address isn't in the HTML for scrapers.
// Without JS the link falls back to LinkedIn.
const rev = (s) => s.split("").reverse().join("");
document.querySelectorAll(".js-email").forEach((a) => {
  const addr = `${rev(a.dataset.u)}@${rev(a.dataset.d)}`;
  a.href = `mailto:${addr}`;
  a.textContent = addr;
  a.removeAttribute("target");
  a.removeAttribute("rel");
});

// Testimonial carousel dots: one per card, highlight the current one, click to jump.
const track = document.querySelector(".quotes");
const dotsEl = document.querySelector(".quotes__dots");
if (track && dotsEl) {
  const cards = [...track.children];
  const dots = cards.map((card, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Testimonial ${i + 1} of ${cards.length}`);
    b.addEventListener("click", () => {
      track.scrollTo({ left: card.offsetLeft - cards[0].offsetLeft, behavior: "smooth" });
    });
    dotsEl.appendChild(b);
    return b;
  });
  const update = () => {
    const x = track.scrollLeft;
    const atEnd = x + track.clientWidth >= track.scrollWidth - 2;
    let current = 0;
    cards.forEach((c, i) => { if (c.offsetLeft - cards[0].offsetLeft <= x + 10) current = i; });
    if (atEnd) current = cards.length - 1;
    dots.forEach((d, i) => d.setAttribute("aria-current", i === current ? "true" : "false"));
  };
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}
