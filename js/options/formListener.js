// js/options/formListener.js
function initFormListener() {
  window.addEventListener('message', (e) => {
    if (e.data === 'formSubmitted') {
      document.getElementById('lead-form-overlay').style.display = 'none';
      localStorage.setItem('lead_form_filled', 'true');
    }
  });
}

export { initFormListener };
