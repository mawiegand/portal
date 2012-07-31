
Portal.PasswordDialog = Ember.View.extend({
  templateName: 'password-dialog',
  
  isLoadingBinding: 'Portal.DialogController.isLoading',

  showSignin: function() {
    this.get('controller').toggleViewClicked();
  },
});

Portal.PasswordBarView = Ember.View.extend({
  templateName: 'password-form',
  
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

  submit: function(event) {
    Portal.DialogController.createPasswordResetToken();
  },
});