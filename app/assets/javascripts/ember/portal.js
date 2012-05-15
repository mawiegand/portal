#= require_self
#= require_tree ./models
#= require_tree ./views
#= require_tree ./controllers
#= require_tree ./helpers
#= require_tree ./templates


Portal = Ember.Application.create({
  ready: function() {
    var detailsVisible = false;
    var mainbarMinHeight = 0;
    var origMargin = 0;
    var origPadding = 0;
    
    $('#togglebar').click(function() {
      Portal.DialogController.toggleViewClicked();
    });
    
    $('#switchbar').click(function() {
      if (!detailsVisible) {
        
        mainbarMinHeight = $('#mainbar').css('min-height')
        origMargin = $('#loginbar').css('margin-bottom');
        origPadding = $('#loginbar').css('padding-top');
      
        $('#detailsbar').show();
        $('#switchbar-bottom').show();
      
        $('#mainbar')
        .css('min-height', '0')
        .slideUp(); 
        $('#togglebar').fadeOut();
      
        $('#menubar').slideUp(function() {
          if (Portal.DialogController.get('visibility') === Portal.DIALOG_STATE_VISIBLE) {
            Portal.DialogController.toggleVisibility(false);
          }
        });
        $('#loginbar').animate({'margin-bottom': '-80px', 'padding-top': '10px'});
        $('#logo-small').fadeOut();
        $('#switchbar-teaser').fadeOut();
      
        detailsVisible = true;
      }
      else {
        $('#menubar').slideDown();
        $('#mainbar').slideDown(function() {
          $('#detailsbar').hide(); 
          $('#switchbar-bottom').hide();
          $('#mainbar').css('min-height', mainbarMinHeight);
          $('#logo-small').fadeIn();
          $('#switchbar-teaser').fadeIn()
          $('#togglebar').fadeIn();
        });
        $('#loginbar').animate({'margin-bottom': origMargin, 'padding-top': origPadding});

        detailsVisible = false;
      }
    });
    
    Portal.MenueView = Ember.View.create({
      templateName: 'menue',
      controllerBinding: 'Portal.DialogController',
    }).appendTo('#menubar');

    Portal.BarView = Ember.View.create({
      templateName: 'bar-view',
      typeBinding: 'Portal.DialogController.bartype',
      hiddenBinding: 'Portal.DialogController.visibility',
      
      submit: function() {
        console.log('submit pressed');
      },
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
