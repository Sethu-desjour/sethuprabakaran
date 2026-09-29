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
