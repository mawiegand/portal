
Portal.PasswordCredentials = Ember.Object.extend({
  email: null,
  password: null,
  
  validate: function() {
    if (this.get('email') === undefined || this.get('email') === '' ||
        this.get('password') === undefined  || this.get('password') === null || this.get('password').length < 4) {
      alert ('Please provide a valid email and a password of at least 4 characters.');
      return false;
    }
    return true;
  },
});
