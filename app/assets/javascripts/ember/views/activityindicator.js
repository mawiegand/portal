
var AWE = window.AWE || {};
AWE.UI = AWE.UI || {}; 

AWE.UI.Ember = (function(module) {
  
  module.ActivityIndicatorView = Ember.View.extend({
    tagName: 'span',
  });  

  return module;
    
}(AWE.UI.Ember || {}));
