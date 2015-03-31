
Portal.PasswordCredentials = Ember.Object.extend({
  email: null,
  password: null,
  terms: false,
  
  validate: function() {
    log('validate');
    if (typeof this.get('email') === "undefined" || this.get('email') === '' ||
        typeof this.get('password') === "undefined"  || this.get('password') === null || this.get('password').length < 6) {
      return false;
    }
    return true;
  },
  
  termsAccepted: function() {
    log('termsAccepted');
    return this.get('terms');
  },
  
});
