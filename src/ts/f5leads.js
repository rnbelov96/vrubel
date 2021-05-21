/* eslint-disable no-plusplus */

const validateForm = form => {
  const nameInputEl = form.querySelector('[data-type="name"]');
  const phoneInputEl = form.querySelector('[data-type="phone"]');
  const emailInputEl = form.querySelector('[data-type="email"]');

  let isOk = true;

  if (phoneInputEl.value === '') {
    phoneInputEl.classList.add('input-error');
    isOk = false;
  }

  if (
    phoneInputEl.value !== ''
    && !validator.isMobilePhone(`${phoneInputEl.value.replace(/\(|\)|-|_|\s/g, '')}`, 'ru-RU')
  ) {
    phoneInputEl.classList.add('input-error');
    isOk = false;
  }

  if (emailInputEl.value !== '' && !validator.isEmail(emailInputEl.value)) {
    emailInputEl.classList.add('input-error');
    isOk = false;
  }

  if (isOk) {
    if (nameInputEl) {
      localStorage.setItem('userName', nameInputEl.value);
    } else {
      localStorage.setItem('userName', '');
    }

    return true;
  }
  return false;
};

function objectifyForm(formArray) {
  const returnArray = {};
  for (let i = 0; i < formArray.length; i++) {
    [, returnArray[formArray[i][0]]] = formArray[i];
  }
  return returnArray;
}

function parseQueryString(query) {
  const vars = query.split('&');
  const queryString = {};
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    const key = decodeURIComponent(pair[0]);
    const value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof queryString[key] === 'undefined') {
      queryString[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof queryString[key] === 'string') {
      const arr = [queryString[key], decodeURIComponent(value)];
      queryString[key] = arr;
      // If third or later entry with this name
    } else {
      queryString[key].push(decodeURIComponent(value));
    }
  }
  return queryString;
}

const query = window.location.search.substring(1);
const qs = parseQueryString(query);

function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

document.addEventListener('DOMContentLoaded', () => {
  document.formData = {};
  document.formData.ganalytics = '';
  document.formData.roistat = '';
  document.formData.formname = 'form';
  document.formData.domain = window.location.host;
  document.formData.send_to_bitrix = document.f5leads.send_to_bitrix;
  document.formData.expect_second_form = document.f5leads.expect_second_form;
  document.formData.emails = document.f5leads.emails;
  if (document.formData.domain.length === 0) {
    document.formData.domain = window.location.hostname;
  }
  document.formData.utm_source = localStorage.utm_source || qs.utm_source || '';
  localStorage.utm_source = document.formData.utm_source;
  document.formData.utm_medium = localStorage.utm_medium || qs.utm_medium || '';
  localStorage.utm_medium = document.formData.utm_medium;
  document.formData.utm_campaign = localStorage.utm_campaign || qs.utm_campaign || '';
  localStorage.utm_campaign = document.formData.utm_campaign;
  document.formData.utm_term = localStorage.utm_term || qs.utm_term || '';
  localStorage.utm_term = document.formData.utm_term;
  document.formData.utm_content = localStorage.utm_content || qs.utm_content || '';
  localStorage.utm_content = document.formData.utm_content;
  document.formData.utm_placement = localStorage.utm_placement || qs.utm_placement || '';
  localStorage.utm_placement = document.formData.utm_placement;

  ymaps.ready(() => {
    document.formData.city = ymaps.geolocation.city || '';
  });

  const x = new Date();
  document.formData.timezone = (-1 * x.getTimezoneOffset()) / 60;

  const formsList = document.querySelectorAll('form');

  formsList.forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validateForm(form)) {
        return;
      }

      document.formData.roistat = getCookie('roistat_visit') || '';

      document.formData = {
        ...document.formData,
        ...objectifyForm([...new FormData(form).entries()]),
      };

      if (document.formData.name === undefined) document.formData.name = window.location.hostname;

      const data = JSON.stringify(document.formData);

      const response = await fetch(
        'https://tp3g2f5vh2.execute-api.eu-central-1.amazonaws.com/dev/add_lead',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
          body: data,
        },
      );

      if (!response.ok) {
        window.location = 'error.html';
        return;
      }

      if (
        document.f5leads.expect_second_form === '1'
        && form.classList.contains('secondform')
      ) {
        if (document.f5leads.onSubmitSecondForm !== undefined) document.f5leads.onSubmitSecondForm(form);
      } else {
        localStorage.lastFirstFormData = JSON.stringify(document.formData);
        if (document.f5leads.onSubmitFirstForm !== undefined) document.f5leads.onSubmitFirstForm(form);
      }
    });
  });
});
