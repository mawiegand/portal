Portal.SignupDialog = Ember.View.extend({
  templateName: 'signup-dialog',
  
  showSignin: function() {
    this.get('controller').toggleViewClicked();
  },
  
  showPasswordReset: function() {
    alert ('Sorry, not yet implemented.');
  },
  
  showSupport: function() {
    alert ('Sorry, not yet implemented.');
  },
  
});


Portal.SignupBarView = Ember.View.extend({
  templateName: 'signup-form',
  
  didInsertElement: function() {
    this._super();
    this.$('input:first').focus();
  },  

  submit: function(event) {
    Portal.DialogController.signup();
  },
});
