
var Portal = window.Portal || {};
Portal.I18n = Portal.I18n || {}

Portal.I18n.en_US = function(module) {
    
  module.localizedStrings = {
 
    general: {
      and: 'and',      
    },
    
    error: {
      stringMissing: "(error: text missing!)",
      input: 'Enter a valid email address and choose a password of at least six characters.',
    },
  };
  
  return module;
  
}(Portal.I18n.en_US || {});
