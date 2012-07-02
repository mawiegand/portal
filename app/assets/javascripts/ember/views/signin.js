
Portal.SigninDialog = Ember.View.extend({
  templateName: 'signin-dialog',
  
  isLoadingBinding: 'Portal.DialogController.isLoading',

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
  
  isLoadingBinding: 'Portal.DialogController.isLoading',
  
  didInsertElement: function() {
    this._super();
    var username = Portal.Cookie.restoreEmail();

    if (username && !Portal.DialogController.get('credentials').get('email')) {
      Portal.DialogController.get('credentials').set('email', username);
      this.$('input#password').focus();      
    }
    else {
      this.$('input:first').focus();
    }
  },

  cancel: function(event) {
    Portal.DialogController.cancel();
  },

  submit: function(event) {
    Portal.DialogController.signin();
  },
});