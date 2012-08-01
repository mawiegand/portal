
Portal.PasswordCredentials = Ember.Object.extend({
  email: null,
  password1: null,
  password2: null,
  password: null,
  
  passwordObserver: function(){
    console.log('---> password', this.get('password'), this);
  }.observes('password'),
  
  password1Observer: function(){
    this.set('password', this.get('password1'));
    console.log('---> password1', this.get('password'));
  }.observes('password1'),
  
  password2Observer: function(){
    this.set('password', this.get('password2'));
    console.log('---> password2', this.get('password'));
  }.observes('password2'),
  
  validate: function() {
    if (this.get('email') === undefined || this.get('email') === '' ||
        this.get('password') === undefined  || this.get('password') === null || this.get('password').length < 6) {
      return false;
    }
    return true;
  },
});
