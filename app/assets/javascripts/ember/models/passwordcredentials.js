
Portal.PasswordCredentials = Ember.Object.extend({
  email: null,
  password: null,
  
  validate: function() {
    if (this.get('email') === undefined || this.get('email') === '' ||
        this.get('password') === undefined  || this.get('password') === null || this.get('password').length < 4) {
      return false;
    }
    return true;
  },
});
