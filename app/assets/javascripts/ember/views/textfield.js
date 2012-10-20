
/** extends Ember.TextField to bubble-up submit and cancel actions. */
Portal.TextField = Ember.TextField.extend({
    
  insertNewline: function(event) {
    this._super(event);
    var parentView = this.get('parentView');
    if (parentView && parentView.submit !== undefined) parentView.submit(event);
  },
  
  cancel: function(event) {
    this._super(event);
    var parentView = this.get('parentView');
    if (parentView && parentView.cancel !== undefined) parentView.cancel(event);
  }
});