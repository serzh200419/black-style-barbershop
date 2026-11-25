import { copy, coordinates, directions, gallery, instagram, listing, phones, prices } from './content.js';

const page = document.body.dataset.page;
const params = new URLSearchParams(location.search);
const language = Object.hasOwn(copy, params.get('lang')) ? params.get('lang') : 'hy';
const t = copy[language];
const brand = 'Black Style Barbershop';
const sections = ['', '', '#work', '#about', '#contact'];
const href = (target, section = '', lang = language) =>
  './' + (target === 'services' ? 'services.html' : 'index.html') +
  (lang === 'hy' ? '' : '?lang=' + lang) + section;
const tel = (phone) => 'tel:' + phone.replaceAll(' ', '');
const external = 'target="_blank" rel="noopener"';
const arrow = '<span aria-hidden="true">↗</span>';
const call = '<a class="button outline" href="' + tel(phones[0]) + '">' + t.call + '</a>';
const navigation = t.nav.map((name, i) => {
  const target = i === 1 ? 'services' : 'home';
  const current = i < 2 && target === page ? ' aria-current="page"' : '';
  return '<a href="' + href(target, sections[i]) + '"' + current + '>' + name + '</a>';
}).join('');

document.documentElement.lang = language;
document.title = page === 'services' ? t.nav[1] + ' · ' + brand : brand;
document.querySelector('#header').innerHTML = `
  <div class="shell header-inner">
    <a class="brand" href="${href('home')}" aria-label="${brand}"><img src="./assets/logo.webp" alt="${brand}" width="155" height="42"></a>
    <nav class="desktop-nav" aria-label="${t.menu}">${navigation}</nav>
    <div class="header-actions">
      <div class="languages" aria-label="Language">${Object.keys(copy).map(lang =>
        `<a href="${href(page, location.hash, lang)}" lang="${lang}" hreflang="${lang}" data-lang="${lang}"${lang === language ? ' aria-current="true"' : ''}>${lang.toUpperCase()}</a>`
      ).join('')}</div>
      <details class="mobile-nav"><summary aria-label="${t.menu}"><span></span><span></span></summary><nav aria-label="${t.menu}">${navigation}</nav></details>
    </div>
  </div>`;

function serviceRow(index, detailed = false) {
  const [name, description] = t.services[index];
  const service = prices[index];
  const amount = new Intl.NumberFormat(language).format(service.amount) + ' ' + t.currency;
  return `<li class="service-row">
    <div><${detailed ? 'h3' : 'span'} class="service-name">${name}</${detailed ? 'h3' : 'span'}>${detailed ? `<p>${description}</p>` : ''}</div>
    <div class="price"><span>${service.from ? t.from.replace('{price}', amount) : amount}</span>${service.sample ? `<small>${t.sample}</small>` : ''}</div>
  </li>`;
}

const note = `<p class="price-note">${t.note}</p>`;
const home = `
  <section class="hero">
    <img class="hero-image" src="./assets/hero.webp" alt="" fetchpriority="high" width="1672" height="941">
    <div class="shell hero-inner">
      <p class="eyeline">${t.area}</p>
      <h1 lang="en"><span>Black Style</span> <span>Barbershop</span></h1>
      <p class="tagline">${t.tagline}</p>
      <div class="actions"><a class="button primary" href="${href('services')}">${t.view}</a>${call}</div>
    </div>
  </section>
  <section class="band" id="services-preview"><div class="shell split">
    <div><h2>${t.nav[1]}</h2><a class="text-link" href="${href('services')}">${t.view} ${arrow}</a></div>
    <div><ul class="service-list">${[0, 1, 2].map(i => serviceRow(i)).join('')}</ul>${note}</div>
  </div></section>
  <section class="band work" id="work"><div class="shell ${gallery.length ? '' : 'split'}">
    <h2>${t.nav[2]}</h2>
    <div>
      ${gallery.length ? `<div class="gallery">${gallery.slice(0, 6).map(photo => `<img src="${photo.src}" alt="${photo.alt[language]}" style="object-position: ${photo.position ?? 'center'}" loading="lazy">`).join('')}</div>` : `<p>${t.work}</p>`}
      <a class="text-link" href="${instagram}" ${external}>${t.instagram} ${arrow}</a>
    </div>
  </div></section>
  <section class="band about" id="about"><div class="shell split"><h2>${t.nav[3]}</h2><p>${t.about}</p></div></section>
  <section class="band contact" id="contact"><div class="shell split">
    <div>
      <h2>${t.nav[4]}</h2>
      <address>${t.address.join('<br>')}</address>
      <div class="phones">${phones.map(phone => `<a href="${tel(phone)}">${phone}</a>`).join('')}</div>
      <div class="map-links"><a class="text-link" href="${directions}" ${external}>${t.directions} ${arrow}</a><a class="text-link" href="${listing}" ${external}>${t.listing} ${arrow}</a></div>
    </div>
    <iframe title="${t.map}" src="https://maps.google.com/maps?q=${coordinates}&amp;z=17&amp;hl=${language}&amp;output=embed" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  </div></section>`;

const groups = [[0, 1, 2], [3, 4], [5, 6, 7]];
const services = `
  <div class="shell services-main">
    <h1>${t.nav[1]}</h1>
    ${note}
    ${groups.map((group, i) => `<section class="price-group split"><h2>${t.groups[i]}</h2><ul class="service-list">${group.map(index => serviceRow(index, true)).join('')}</ul></section>`).join('')}
    <div class="services-end"><a class="text-link" href="${listing}" ${external}>${t.source} ${arrow}</a>${call}</div>
  </div>`;

document.querySelector('#main').innerHTML = page === 'home' ? home : services;
document.querySelector('#footer').innerHTML = `<div class="shell footer-inner"><a href="${href('home')}">${brand}</a><a href="${instagram}" ${external}>Instagram ${arrow}</a></div>`;

const menu = document.querySelector('.mobile-nav');
menu.querySelector('nav').addEventListener('click', (event) => {
  if (event.target.closest('a')) menu.open = false;
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.open) {
    menu.open = false;
    menu.querySelector('summary').focus();
  }
});
window.addEventListener('hashchange', () => {
  for (const link of document.querySelectorAll('[data-lang]')) {
    link.href = href(page, location.hash, link.dataset.lang);
  }
});
if (location.hash) {
  requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
}
