/* eslint-disable no-param-reassign */
export {};

const modalFormInfoList = [
  {
    title: 'Оставить заявку на бесплатную консультацию',
    button: 'Получить консультацию',
  },
  {
    title: 'Получить подробный расчет на почту',
    button: 'Получить расчет',
  },
];

const closeModal = (modalEl: HTMLDivElement) => {
  modalEl.style.opacity = '0';
  modalEl.style.overflowY = 'inherit';
  modalEl.style.pointerEvents = 'none';
  document.body.style.overflowY = 'auto';
};

const openModal = (modalEl: HTMLDivElement) => {
  modalEl.style.opacity = '1';
  modalEl.style.overflowY = 'auto';
  modalEl.style.pointerEvents = 'auto';
  document.body.style.overflowY = 'hidden';
};

const modalElList = document.querySelectorAll('.modal');
const [formModalEl, policyModalEl, youtubeAdvModalEl, contactsModalEl] = modalElList;

const formTitleEl = formModalEl.querySelector('h3') as HTMLHeadingElement;
const formBtnEl = formModalEl.querySelector('button') as HTMLButtonElement;

const modalWrapperElList = document.querySelectorAll('.modal__center-wrapper');
modalElList.forEach(modalEl => {
  modalEl.addEventListener('click', (e: Event) => {
    if (e.target === e.currentTarget || [...modalWrapperElList].includes(e.target as Element)) {
      const clickedModal = e.currentTarget as HTMLDivElement;
      if (clickedModal === youtubeAdvModalEl) {
        const iframe = clickedModal.querySelector('iframe');
        if (iframe) {
          const iframeSrc = iframe.src;
          iframe.src = iframeSrc;
        }
      }
      closeModal(clickedModal);
    }
  });
});

const closeModalElList = document.querySelectorAll('.modal__close');
closeModalElList.forEach(closeEl => {
  closeEl.addEventListener('click', () => {
    modalElList.forEach(modalEL => {
      closeModal(modalEL as HTMLDivElement);
    });
  });
});

// Найти кнопки и прописать события
const policyBtnElList = document.querySelectorAll('.js-policy');
policyBtnElList.forEach(el => {
  el.addEventListener('click', () => {
    openModal(policyModalEl as HTMLDivElement);
  });
});

const callbackBtnElList = document.querySelectorAll('.js-callback');
const planBtnElList = document.querySelectorAll('.js-plan');

callbackBtnElList.forEach(btn => {
  btn.addEventListener('click', () => {
    formTitleEl.textContent = modalFormInfoList[0].title;
    formBtnEl.textContent = modalFormInfoList[0].button;
    openModal(formModalEl as HTMLDivElement);
  });
});
planBtnElList.forEach(btn => {
  btn.addEventListener('click', () => {
    formTitleEl.textContent = modalFormInfoList[1].title;
    formBtnEl.textContent = modalFormInfoList[1].button;
    openModal(formModalEl as HTMLDivElement);
  });
});

const youtubeAdvBtnCallEl = document.querySelector('.js-youtube');
youtubeAdvBtnCallEl?.addEventListener('click', () => {
  openModal(youtubeAdvModalEl as HTMLDivElement);
});

const contactsBtnCallEl = document.querySelector('.js-contacts-call');
contactsBtnCallEl?.addEventListener('click', () => {
  openModal(contactsModalEl as HTMLDivElement);
});
