
var Portal = window.Portal || {};
Portal.I18n = Portal.I18n || {}

Portal.I18n.de_DE = function(module) {
    
  module.localizedStrings = {
 
    general: {
      and: 'und',
    },
    
    error: {
      stringMissing: "(error: text missing!)",
      input: "Gib eine gültige E-Mailadresse und ein Passwort mit mindestens sechs Zeichen an.",
      termsofservice: 'Du musst die AGB akzeptieren, um dich zu registrieren.',
    },    
  };
  
  return module;
  
}(Portal.I18n.de_DE || {});
