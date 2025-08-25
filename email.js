// email.js
// Fonction d'envoi d'emails avec EmailJS

/**
 * Envoie un email via EmailJS
 * @param {string} templateId - L'ID du template EmailJS
 * @param {object} params - Les paramètres à injecter dans l'email
 * @returns {Promise}
 */
function sendEmail(templateId, params) {
  return emailjs.send("template_rzhs70i", templateId, params)
}
