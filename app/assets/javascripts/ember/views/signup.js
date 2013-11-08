Portal.SignupDialog = Ember.View.extend({
  templateName: 'signup-dialog',
  
  isLoadingBinding: 'Portal.DialogController.isLoading',
  isFbLoadingBinding: 'Portal.DialogController.isFbLoading',

  registrationStatusBinding: 'Portal.DialogController.registrationStatus',
  showWaitingListNoticeBinding: 'Portal.DialogController.showWaitingListNotice',
  
  showSignin: function() {
    this.get('controller').toggleViewClicked();
  },
  
  showPasswordReset: function() {
    alert ('Sorry, not yet implemented.');
  },
  
  showSupport: function() {
    alert ('Sorry, not yet implemented.');
  },

  facebook: function() {
    Portal.DialogController.signinFacebook();
  },
});


Portal.SignupBarView = Ember.View.extend({
  templateName: 'signup-form',
  
  isLoadingBinding: 'Portal.DialogController.isLoading',
  isFbLoadingBinding: 'Portal.DialogController.isFbLoading',

  registrationStatusBinding: 'Portal.DialogController.registrationStatus',
  
  didInsertElement: function() {
    this._super();
    this.$('input:first').focus();
  },  
  
  cancel: function(event) {
    Portal.DialogController.cancel();
  },

  submit: function(event) {
    Portal.DialogController.signup();
  },

  facebook: function() {
    Portal.DialogController.signinFacebook();
  },
});
