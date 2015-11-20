
Portal.RegistrationStatus = Ember.Object.extend({
  signin_mode: null,
  signup_mode: null,
  
  isLoading: function() {
    return this.get('signin_mode') == null || this.get('signup_mode') == null;
  }.property('signin_mode', 'signup_mode').cacheable(),
  
  canSignin: function() {
    return this.get('signin_mode') == 1 || this.get('signin_mode') == null;
  }.property('signin_mode').cacheable(),

  canSignup: function() {
    return this.get('signup_mode') > 0 || this.get('signup_mode') == null;
  }.property('signup_mode').cacheable(),
});
