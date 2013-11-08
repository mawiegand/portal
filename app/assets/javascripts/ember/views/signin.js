
Portal.SigninDialog = Ember.View.extend({
  templateName: 'signin-dialog',
  
  isLoadingBinding: 'Portal.DialogController.isLoading',
  isFbLoadingBinding: 'Portal.DialogController.isFbLoading',

  registrationStatusBinding: 'Portal.DialogController.registrationStatus',

  showSignup: function() {
    this.get('controller').toggleViewClicked();
  },
  
  showPasswordReset: function() {
    this.get('controller').resetPasswordClicked();
  },

  facebook: function() {
    Portal.DialogController.signinFacebook();
  },
});

Portal.SigninBarView = Ember.View.extend({
  templateName: 'signin-form',

  isLoadingBinding: 'Portal.DialogController.isLoading',
  isFbLoadingBinding: 'Portal.DialogController.isFbLoading',

  registrationStatusBinding: 'Portal.DialogController.registrationStatus',
  
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

  facebook: function() {
    Portal.DialogController.signinFacebook();
  }
});