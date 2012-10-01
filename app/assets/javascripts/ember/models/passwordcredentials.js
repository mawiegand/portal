
Portal.PasswordCredentials = Ember.Object.extend({
  email: null,
  password: null,
  terms: false,
  
  validate: function() {
    console.log('validate');
    if (this.get('email') === undefined || this.get('email') === '' ||
        this.get('password') === undefined  || this.get('password') === null || this.get('password').length < 6) {
      return false;
    }
    return true;
  },
  
  termsAccepted: function() {
    console.log('termsAccepted');
    return this.get('terms');
  },
  
});
