
var Portal = window.Portal || {};
Portal.I18n = Portal.I18n || {}

Portal.I18n.de_DE = function(module) {
    
  module.localizedStrings = {
 
    home_page: {
      password_hint: "Wir haben dir eine Mail mit einem Link geschickt, mit dem du dir ein neues Passwort generieren und schicken lassen kannst. Falls du innerhalb der nächsten Minuten keine Mail bekommst, wende dich an den Support.",
      email_not_set: "Die Mail zum Passwort zurücksetzen konnte nicht versendet werden.",
    },

    general: {
      and: 'und',
    },
    
    error: {
      stringMissing: "(error: text missing!)",
    },
  };
  
  return module;
  
}(Portal.I18n.de_DE || {});
