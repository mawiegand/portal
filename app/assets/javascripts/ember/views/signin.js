Portal.SigninDialog = Ember.View.extend({
  templateName: 'signin-dialog',

  showSignup: function() {
    this.get('controller').toggleViewClicked();
  },
  
  showPasswordReset: function() {
    alert ('Sorry, not yet implemented.');
  },
  
  showSupport: function() {
    alert ('Sorry, not yet implemented.');
  },
  
});

Portal.SigninBarView = Ember.View.extend({
  templateName: 'signin-form',
  
  didInsertElement: function() {
    this._super();
    this.$('input:first').focus();
  },

  submit: function(event) {
    Portal.DialogController.signin();
  },
});