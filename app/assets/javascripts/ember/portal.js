#= require_self
#= require_tree ./models
#= require_tree ./views
#= require_tree ./controllers
#= require_tree ./helpers
#= require_tree ./templates


Portal = Ember.Application.create({
  ready: function() {
    
    // connect non-ember view object to the dialog controller
    $('#togglebar').click(function() {
      Portal.DialogController.toggleViewClicked();
    });
    
    $('#switchbar').click(function() {
      Portal.DialogController.switchBarClicked();
    });

    // create those ember views that are visible at the start of the
    // application
    Portal.MenueView = Ember.View.create({
      templateName: 'menue',
      controllerBinding: 'Portal.DialogController',
      
      showSignin: function() {
        this.get('controller').toggleViewClicked();
      },
      showSignup: function() {
        this.get('controller').toggleViewClicked();
      },
    }).appendTo('#menubar');

    Portal.BarView = Ember.View.create({
      templateName: 'bar-view',
      typeBinding: 'Portal.DialogController.bartype',
      hiddenBinding: 'Portal.DialogController.visibility',
    }).appendTo('#loginbar');

    Portal.ToggleView = Ember.View.create({
      templateName: 'toggle-view',
      controllerBinding: 'Portal.DialogController',
    }).appendTo('#togglebar');
    
    Portal.DialogView = Ember.View.create({
      templateName: 'dialog',
      controllerBinding: 'Portal.DialogController',
    });

  },
});

Portal.DIALOG_STATE_HIDDEN  = 0;
Portal.DIALOG_STATE_VISIBLE = 1;
Portal.DIALOG_TYPE_SIGNUP  = 0;
Portal.DIALOG_TYPE_SIGNIN  = 1;


Portal.Config = {
  identityProviderBase: 'https://localhost/identity_provider/',
  gameserverURL: 'https://localhost/client/map.html'
};
