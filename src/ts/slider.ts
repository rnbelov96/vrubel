export {};

const changeMode = (pageWidth: number) => {
  if (pageWidth <= 575) {
    return 1;
  }
  if (pageWidth > 575 && pageWidth <= 991) {
    return 2;
  }
  return 3;
};

const imagesLength = 12;
let currentImage = 1;
let pageWidth = document.documentElement.scrollWidth;
let mode = changeMode(pageWidth);

const translateXPosList = [
  {
    mode: 3,
    pos: -100,
  },
  {
    mode: 2,
    pos: -200,
  },
  {
    mode: 1,
    pos: -400,
  },
];
let initTranslateXPos = translateXPosList.find(el => el.mode === mode)
  ?.pos as number;
let translateXPos = initTranslateXPos;
let translateStep = 100 / mode;
let offset: number;
let posInit: number;
let isDragging = false;

const imagesBoxEl = document.querySelector(
  '.slider__img-box',
) as HTMLDivElement;
const wrapperEl = document.querySelector('.slider__wrapper') as HTMLDivElement;

let wrapperCoords = wrapperEl.getBoundingClientRect();
let wrapperLeftCoords = wrapperCoords.left;
let wrapperWidth = wrapperCoords.width;

const navBoxEl = document.querySelector('.slider__nav-box') as HTMLDivElement;

let navItemList: HTMLButtonElement[];

const blockBtns = () => {
  navItemList.forEach(el => {
    // eslint-disable-next-line no-param-reassign
    el.disabled = true;
  });
};

const activateBtns = () => {
  navItemList.forEach(el => {
    // eslint-disable-next-line no-param-reassign
    el.disabled = false;
  });
};

navItemList = Array(imagesLength)
  .fill({}, 0, imagesLength)
  .map((_el, index) => {
    const navItemEl = document.createElement('button');
    navItemEl.classList.add('slider__nav-item');
    if (index === 0) {
      navItemEl.classList.add('slider__nav-item_active');
    }
    navItemEl.dataset.image = String(index + 1);
    navItemEl.addEventListener('click', e => {
      blockBtns();
      const navEl = e.currentTarget as HTMLDivElement;
      imagesBoxEl.style.transition = 'transform .5s';
      const prevCurrentImage = currentImage;
      currentImage = Number(navEl.dataset.image);
      const newTranslateXPos = initTranslateXPos - translateStep * (currentImage - 1);
      translateXPos = newTranslateXPos;
      imagesBoxEl.style.transform = `translate3d(${translateXPos}%, 0px, 0px)`;
      navItemList[currentImage - 1].classList.add('slider__nav-item_active');
      navItemList[prevCurrentImage - 1].classList.remove(
        'slider__nav-item_active',
      );
      setTimeout(() => {
        imagesBoxEl.style.transition = '';
        activateBtns();
      }, 500);
    });
    return navItemEl;
  });

navBoxEl.append(...navItemList);

window.addEventListener('resize', () => {
  wrapperCoords = wrapperEl.getBoundingClientRect();
  wrapperLeftCoords = wrapperCoords.left;
  wrapperWidth = wrapperCoords.width;

  pageWidth = document.documentElement.scrollWidth;
  const newMode = changeMode(pageWidth);
  if (mode === newMode) {
    return;
  }
  mode = newMode;
  translateStep = 100 / mode;
  initTranslateXPos = translateXPosList.find(el => el.mode === mode)
    ?.pos as number;
  const newTranslateXPos = initTranslateXPos - translateStep * (currentImage - 1);
  translateXPos = newTranslateXPos;
  imagesBoxEl.style.transform = `translate3d(${translateXPos}%, 0px, 0px)`;
});

const dragAction = (e: MouseEvent) => {
  const posX = e.pageX - wrapperLeftCoords;
  offset = ((posInit - posX) / wrapperWidth) * 100;
  const newTranslateXPos = translateXPos - offset;
  imagesBoxEl.style.transform = `translate3d(${newTranslateXPos}%, 0px, 0px)`;
};

const swipeAction = (e: TouchEvent) => {
  const posX = e.touches[0].clientX - wrapperLeftCoords;
  offset = ((posInit - posX) / wrapperWidth) * 100;
  const newTranslateXPos = translateXPos - offset;
  imagesBoxEl.style.transform = `translate3d(${newTranslateXPos}%, 0px, 0px)`;
};

const dragStart = (e: MouseEvent) => {
  isDragging = true;
  posInit = e.pageX - wrapperLeftCoords;
  wrapperEl.addEventListener('mousemove', dragAction);
  wrapperEl.addEventListener('touchmove', swipeAction);
};

const swipeStart = (e: TouchEvent) => {
  isDragging = true;
  posInit = e.touches[0].clientX - wrapperLeftCoords;
  wrapperEl.addEventListener('mousemove', dragAction);
  wrapperEl.addEventListener('touchmove', swipeAction);
};

const swipeEnd = () => {
  blockBtns();
  const prevCurrentImage = currentImage;
  isDragging = false;
  imagesBoxEl.style.transition = 'transform .5s';
  wrapperEl.removeEventListener('mousemove', dragAction);
  wrapperEl.removeEventListener('touchmove', swipeAction);

  if (offset < -translateStep / 8) {
    translateXPos += translateStep;
    currentImage -= 1;
    if (currentImage === 0) {
      currentImage = imagesLength;
    }
    navItemList[currentImage - 1].classList.add('slider__nav-item_active');
    navItemList[prevCurrentImage - 1].classList.remove(
      'slider__nav-item_active',
    );
  }

  if (offset > translateStep / 8) {
    translateXPos -= translateStep;
    currentImage += 1;
    if (currentImage === imagesLength + 1) {
      currentImage = 1;
    }
    navItemList[currentImage - 1].classList.add('slider__nav-item_active');
    navItemList[prevCurrentImage - 1].classList.remove(
      'slider__nav-item_active',
    );
  }

  offset = 0;

  imagesBoxEl.style.transform = `translate3d(${translateXPos}%, 0px, 0px)`;

  setTimeout(() => {
    imagesBoxEl.style.transition = '';
    if (currentImage === imagesLength && prevCurrentImage === 1) {
      translateXPos = initTranslateXPos - translateStep * (imagesLength - 1);
      imagesBoxEl.style.transform = `translate3d(${translateXPos}%, 0px, 0px)`;
    }

    if (currentImage === 1 && prevCurrentImage === imagesLength) {
      translateXPos = initTranslateXPos;
      imagesBoxEl.style.transform = `translate3d(${translateXPos}%, 0px, 0px)`;
    }
    activateBtns();
  }, 500);
};

const swipeLeave = () => {
  if (isDragging) {
    swipeEnd();
  }
};

wrapperEl.addEventListener('mousedown', dragStart);
wrapperEl.addEventListener('touchstart', swipeStart);

wrapperEl.addEventListener('mouseup', swipeEnd);
wrapperEl.addEventListener('touchend', swipeEnd);

wrapperEl.addEventListener('mouseleave', swipeLeave);
