
Portal.PasswordCredentials = Ember.Object.extend({
  email: null,
  password: null,
  password_new: null,
  
  validate: function() {
    log('validate');
    if (typeof this.get('email') === "undefined" || this.get('email') === '' ||
        typeof this.get('password') === "undefined"  || this.get('password') === null || this.get('password').length < 6) {
      return false;
    }
    return true;
  },

  validateEmail: function() {
    var mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+[^_]$/;
    if (this.get('email').match(mailFormat))
    {
      return true;
    }
    return false;
  },
  
  validate_password_change: function() {
    if (validate() === false ||
        typeof this.get('password_new') === "undefined"  || this.get('password_new') === null || this.get('password_new').length < 6) {
      return false;
    }
    return true;
  },
  
  reset_new_password: function(){
    this.set('password_new', null);
  },
  
  set_new_password: function(password){
    this.set('password', password);
  }
});
