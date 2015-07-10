

Portal.PasswordChangeDialog = Ember.View.extend({
  templateName: 'password-change-dialog',
  
  isLoadingBinding: 'Portal.DialogController.isLoading',

  showSignin: function() {
    this.get('controller').toggleViewClicked();
  },
});

Portal.PasswordChangeBarView = Ember.View.extend({
  templateName: 'password-change-form',
  
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
    Portal.DialogController.changePassword();
  },
});