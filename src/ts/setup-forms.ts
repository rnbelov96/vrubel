export {};

declare let IMask: any;

const formsList = document.querySelectorAll('form');

formsList.forEach(form => {
  const nameInputEl = form.querySelector('[data-type="name"]') as HTMLInputElement | null;
  const phoneInputEl = form.querySelector('[data-type="phone"]') as HTMLInputElement;
  const emailInputEl = form.querySelector('[data-type="email"]') as HTMLInputElement;
  const cityInputEl = form.querySelector('[data-type="city"]') as HTMLInputElement | null;

  let phoneMask: any;
  phoneInputEl.addEventListener('focus', () => {
    if (!phoneMask || phoneMask.unmaskedValue === '') {
      phoneMask = IMask(phoneInputEl, {
        mask: '+7 (000) 000 0000',
        lazy: false,
      });
    }
  });
  phoneInputEl.addEventListener('blur', e => {
    const inputEl = e.currentTarget as HTMLInputElement;
    if (phoneMask.unmaskedValue === '') {
      phoneMask.destroy();
      inputEl.value = '';
    }
  });

  const onFocus = ((e: Event) => {
    const targerEl = e.currentTarget as HTMLInputElement;
    targerEl.classList.remove('input-error');
  });

  nameInputEl?.addEventListener('focus', onFocus);
  phoneInputEl.addEventListener('focus', onFocus);
  emailInputEl.addEventListener('focus', onFocus);
  cityInputEl?.addEventListener('focus', onFocus);
});
