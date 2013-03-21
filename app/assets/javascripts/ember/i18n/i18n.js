
var Portal = window.Portal || {};

Portal.I18n = function(module) {

  module.lookupTranslation = function(path, index) {
    if (path === undefined || path === null) return "" ;
    var locale = window.currentLocale || Portal.Config.DEFAULT_LOCALE
    if (!Portal.I18n[locale]) return "(NO TRANSLATION FOR "+locale+" LOADED.)";
    path = "localizedStrings." + path;   
    var string = Ember.getPath(Portal.I18n[locale], path);
    string     = string ? string : Ember.getPath(Portal.I18n[Portal.Config.DEFAULT_LOCALE], path);
    string     = string ? string : Ember.getPath(Portal.I18n[locale], 'localizedStrings.error.stringMissing');
    string     = string ? string :"FATAL ERROR IN I18N FOR LOCALE " + locale;
    
    if (string && string instanceof Array) { // allow to specify several translations for the same thing (not so borring...)
      if (index) {
        string = string[index % string.length];
      }
      else {
        string = string[Math.floor(Math.random()*string.length)];   
      } 
    }
    return string ;
  };
  
  module.localizedListString = function(list) {
    if (!list || list.length == 0) {
      return ""
    }
    var string = "";
    list.forEach(function(item, index) {
      string += item;
      if (index < list.length-2) string += ", ";
      if (index < list.length-1) string += " " + AWE.I18n.lookupTranslation('general.and') + " ";
    })
    return string;
  };

  return module;
  
}(Portal.I18n || {});