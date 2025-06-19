// js/renderContent.js

import { pageContent } from './pageContent.js';

const contentDiv = document.getElementById('content');

pageContent.forEach(section => {
  const sectionEl = document.createElement('section');
  sectionEl.className = 'info-section';

  const titleEl = document.createElement('h2');
  titleEl.textContent = section.title;
  sectionEl.appendChild(titleEl);

  if (section.paragraphs) {
    section.paragraphs.forEach(paraHTML => {
      const p = document.createElement('p');
      p.innerHTML = paraHTML;
      sectionEl.appendChild(p);
    });
  }

  if (section.list) {
    const ul = document.createElement('ul');
    section.list.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = item;
      ul.appendChild(li);
    });
    sectionEl.appendChild(ul);
  }

  contentDiv.appendChild(sectionEl);
});
    