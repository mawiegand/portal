
var Portal = window.Portal || {};
Portal.I18n = Portal.I18n || {}

Portal.I18n.en_US = function(module) {
    
  module.localizedStrings = {
 
    home_page: {
      password_hint: "We sent you a mail with a link to request a new password. if you don't get the mail within the next minutes, contact our support team.", 
      email_not_set: "The mail could not be sent.",
    },

    general: {
      and: 'and',
    },
    
    error: {
      stringMissing: "(error: text missing!)",
    },
  };
  
  return module;
  
}(Portal.I18n.en_US || {});
