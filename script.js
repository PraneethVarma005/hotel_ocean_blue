// Mobile menu
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
  });

  document.querySelectorAll(".mobile-nav a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("active");
    });
  });
}

// Reveal animations
const revealEls = document.querySelectorAll(".reveal, .reveal-up, .reveal-left, .reveal-right");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

revealEls.forEach(el => revealObserver.observe(el));

// Gallery Lightbox + Load More + Swipe + Prev/Next
const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const loadMoreGalleryBtn = document.getElementById("loadMoreGallery");

const galleryImages = galleryItems.map(item => item.getAttribute("data-img"));
let currentIndex = 0;

function showImage(index) {
  if (!galleryImages.length) return;

  if (index < 0) {
    currentIndex = galleryImages.length - 1;
  } else if (index >= galleryImages.length) {
    currentIndex = 0;
  } else {
    currentIndex = index;
  }

  lightboxImg.src = galleryImages[currentIndex];
}

function openLightbox(index) {
  currentIndex = index;
  showImage(currentIndex);

  if (lightbox) {
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (lightboxImg) {
    lightboxImg.src = "";
  }
}

function nextImage() {
  showImage(currentIndex + 1);
}

function prevImage() {
  showImage(currentIndex - 1);
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    openLightbox(index);
  });
});

// Load More Gallery
if (loadMoreGalleryBtn) {
  const hiddenItems = Array.from(document.querySelectorAll(".hidden-gallery-item"));
  let revealedCount = 0;
  const batchSize = 6;

  loadMoreGalleryBtn.addEventListener("click", () => {
    const nextBatch = hiddenItems.slice(revealedCount, revealedCount + batchSize);

    nextBatch.forEach(item => {
      item.style.display = "block";
      item.classList.remove("hidden-gallery-item");

      // Re-observe for reveal animation if needed
      if (item.classList.contains("reveal") || item.classList.contains("reveal-up") || item.classList.contains("reveal-left") || item.classList.contains("reveal-right")) {
        revealObserver.observe(item);
      }
    });

    revealedCount += nextBatch.length;

    if (revealedCount >= hiddenItems.length) {
      loadMoreGalleryBtn.style.display = "none";
    }
  });

  if (hiddenItems.length === 0) {
    loadMoreGalleryBtn.style.display = "none";
  }
}

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightboxNext) {
  lightboxNext.addEventListener("click", (e) => {
    e.stopPropagation();
    nextImage();
  });
}

if (lightboxPrev) {
  lightboxPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    prevImage();
  });
}

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (!lightbox || !lightbox.classList.contains("active")) return;

  if (e.key === "Escape") {
    closeLightbox();
  } else if (e.key === "ArrowRight") {
    nextImage();
  } else if (e.key === "ArrowLeft") {
    prevImage();
  }
});

// Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

if (lightboxImg) {
  lightboxImg.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightboxImg.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
}

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;
  const minSwipeDistance = 50;

  if (Math.abs(swipeDistance) < minSwipeDistance) return;

  if (swipeDistance < 0) {
    nextImage();
  } else {
    prevImage();
  }
}