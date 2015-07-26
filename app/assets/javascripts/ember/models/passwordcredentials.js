
Portal.PasswordCredentials = Ember.Object.extend({
  email: null,
  password: null,
  terms: false,
  
  validate: function() {
    if (typeof this.get('email') === "undefined" || this.get('email') === '' ||
        typeof this.get('password') === "undefined"  || this.get('password') === null || this.get('password').length < 6) {
      return false;
    }
    return true;
  },
  
  termsAccepted: function() {
    return this.get('terms');
  },
  
});
