
/** extends Ember.TextField to bubble-up submit and cancel actions. */
Portal.TextField = Ember.TextField.extend({

  templateName: 'portal-textfield',

  enablePlaceholder: Portal.Config.ENABLE_IE_PLACEHOLDER,

  empty: false,

  valueObserver: function() {
    if (this.get('enablePlaceholder')) {
//      log("valueObserver <" + this.get('value') + '>', this.get('empty'), typeof(this.get('value')) == 'string' && this.get('value'), this.get('value') == null);
      if (this.get('empty') && this.get('value') != null && this.get('value') != '') {
        this.switchToOriginal();
      }
      else if (!this.get('empty') && (this.get('value') == null || this.get('value') == '')) {
        this.switchToShadow();
      }
    }
  }.observes('value', 'empty'),

  isVisible: function() {
    return this.get('enablePlaceholder') && !this.get('empty');
  }.property('value', 'empty'),

  shadowIsVisible: true,
  shadowClassBinding: 'class',

  init: function() {
    this._super();
  },

  shadowType: function() {
    if (this.get('type') == 'password' || this.get('type') == 'text') {
      return 'text';
    }
  }.property('type'),

  switchToShadow: function() {
    log("switchToShadow", $(this.get('element')).next('input'));
    this.set('empty', true);
    $(this.get('element')).next('input').focus();
  },

  switchToOriginal: function() {
    log("switchToOriginal");
    this.set('empty', false);
    $(this.get('element')).focus();
  },

  focusOut: function() {

  },

  insertNewline: function(event) {
    this._super(event);
    var parentView = this.get('parentView');
    if (parentView && parentView.submit !== undefined) parentView.submit(event);
  },
});

Portal.ShadowTextField = Ember.TextField.extend({

//  classNames: ["red"],

  isVisible: function() {
    return this.getPath('parentView.empty');
  }.property('parentView.empty'),

  init: function() {
    this._super();

    log(this.getPath('parentView.placeholder'), "val: " + this.get('value'));
    this.set('value', this.getPath('parentView.placeholder'));
  },

  keyDown: function(event) {
    log('event', event);
    this.setPath('parentView.value', String.fromCharCode(event.charCode));
  },

});