const naviBack = document.getElementById("navigation-background");
const naviBtn = document.getElementById("navi-button");
const secAbout = document.getElementById("section-about");
const compPhotos = document.getElementsByClassName("composition__photo");
const secFeature = document.getElementById("section-features");
const featBoxs = document.getElementsByClassName("feature-box");
const secTour = document.getElementById("section-tours");
const cardBack = document.getElementsByClassName("card__side");

function handleWillChanges(
  elem: HTMLElement,
  target: HTMLElement[],
  value: string
): void {
  elem.addEventListener("mouseenter", () => {
    [...target].forEach(t => (t.style.willChange = value));
  });

  const onMouseLeave = (): void => {
    [...target].forEach(t => (t.style.willChange = "auto"));
  };

  elem.addEventListener("mouseleave", () => {
    setTimeout(() => {
      onMouseLeave();
    }, 3000);
  });
};

function handleWillChange(
  elem: HTMLElement,
  target: HTMLElement,
  value: string
): void {
  elem.addEventListener("mouseenter", () => {
    target.style.willChange = value;
  });

  const onMouseLeave = (): void => {
    target.style.willChange = "auto";
  };

  elem.addEventListener("mouseleave", () => {
    setTimeout(() => {
      onMouseLeave();
    }, 2000);
  });
};

if (naviBtn && naviBack) {
  handleWillChange(naviBtn, naviBack, "transform, opacity");
}
// handleWillChanges(secAbout, compPhotos, "transform");
// handleWillChanges(secFeature, featBoxs, "transform, opacity");
// handleWillChanges(secTour, cardBack, "transform");

// * Lazy Load Pictures
const images = document.querySelectorAll("[data-src]");
const imageSets = document.querySelectorAll("[data-srcset]");

const imgOptions = {
  threshold: 0,
  rootMargin: "0px 0px 200px 0px"
};

type HTMLImageOrMedia = HTMLImageElement | HTMLMediaElement

function preloadImage(img: HTMLImageOrMedia): void {
  const src = img.getAttribute("data-src");
  if (!src) return;

  if (process.env.NODE_ENV === 'development') {
    console.log(`Function preloadImage executed ${src}`);
  }

  img.src = src;
}

function preloadImageSet(imgSet: HTMLSourceElement): void {
  const srcSet = imgSet.getAttribute("data-srcset");
  if (!srcSet) return;

  if (process.env.NODE_ENV === 'development') {
    console.log(`Function preloadImageSet executed ${srcSet}`);
  }
  imgSet.srcset = srcSet;
}

const imgObserver = new IntersectionObserver((entries, imgObserver) => {
  entries.forEach((entry: IntersectionObserverEntry) => {
    if (!entry.isIntersecting) return;

    const { target } = entry;

    if (
      target instanceof HTMLImageElement ||
      target instanceof HTMLMediaElement
    ) {
      preloadImage(target);
    }

    imgObserver.unobserve(target);
  });
}, imgOptions);

images.forEach(image => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Observing image ${image}`);
  }
  imgObserver.observe(image);
});

const imageSetObserver = new IntersectionObserver(
  (entries, imageSetObserver) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (!entry.isIntersecting) return;

      const { target } = entry;
      if (target instanceof HTMLSourceElement) {
        preloadImageSet(target);
      }

      imageSetObserver.unobserve(target);
    });
  },
  imgOptions
);

imageSets.forEach(imageSet => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Observing src-set ${imageSet}`);
  }
  imageSetObserver.observe(imageSet);
});

// * Text Animations
const text = <HTMLHeadingElement | null>(
  document.querySelector(".heading-fancy")
);

function fancier(elem: HTMLHeadingElement): void {
  if (!elem || !elem.textContent) return;

  const characters = elem.textContent.split("");

  // blank out the element before adding each character back inside of <span>'s
  elem.textContent = "";
  characters.forEach(char => (elem.innerHTML += `<span>${char}</span>`));

  let char = 0;

  const complete = () => {
    // clearInterval(timer);
    clearTimeout(timeout);
    return;
  }

  const onTick = () => {
    const span = elem.querySelectorAll("span")[char];
    span.classList.add("fade");

    if (char === characters.length - 1) {
      complete();
      return;
    }

    char++;
  }

  let timeout = setTimeout(() => {
    setInterval(onTick, 90);
  }, 300);
}

if (text) {
  fancier(text);
}

// * Video playback
const vid = <HTMLVideoElement | null>document.getElementById("bgvideo");
// vid.defaultPlaybackRate = 0.1;

const slow = 0.65;
const normal = 1.0;

function slowMotionVideo(elem: HTMLVideoElement, rate: number = 1): void {
  if (elem.readyState === 4) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Changing ${elem}'s playback rate to ${rate}`);
    }

    elem.defaultPlaybackRate = rate;
    elem.playbackRate = rate;
    elem.load();
    elem.play();

    if (process.env.NODE_ENV === 'development') {
      console.log(`Changed ${elem}'s playback rate to ${elem.playbackRate}`);
    }
  }
}

// slowMotionVideo(vid, slow);

if (vid && vid instanceof HTMLVideoElement) {
  vid.addEventListener("load", () => {
    slowMotionVideo(vid, slow);
  });
}
