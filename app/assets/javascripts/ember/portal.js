#= require_self
#= require_tree ./models
#= require_tree ./views
#= require_tree ./controllers
#= require_tree ./helpers
#= require_tree ./templates


Portal = Ember.Application.create({
  ready: function() {
        
    // setting up controller
    var username = Portal.Cookie.restoreEmail();
    if (username) {  // returning customer, let him login
      Portal.DialogController.set('bartype', Portal.DIALOG_TYPE_SIGNIN);
      Portal.DialogController.set('dialogtype', Portal.DIALOG_TYPE_SIGNIN);
    }
    
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


Portal.Cookie = Ember.Object.create({
  email: null,
  
  init: function() {
    this._super();
    this.set('email', this.restoreEmail());
  },
  
  restoreEmail: function() {
    var i,x,y, cookies=document.cookie.split(";");
    for (i=0; i< cookies.length; i++) {
      x=cookies[i].substr(0,cookies[i].indexOf("="));
      y=cookies[i].substr(cookies[i].indexOf("=")+1);
      x=x.replace(/^\s+|\s+$/g,"");
      if (x=='wackadoo_email') {
        var email = unescape(y);
        this.set('email', email)
        return email;
      }
    }
    return null;
  },

  saveEmail: function(email, days) {
    var expires = new Date();
    expires.setDate(expires.getDate() + days);
    var value = escape(email) + ((expires==null) ? "" : "; expires="+expires.toUTCString());
    document.cookie= "wackadoo_email=" + value;
    this.set('email', email);
  }, 

});

Portal.Config = {
  // automatically determine the server to use -> same origin policy
  SERVER_ROOT: !document.location.host ? 'http://localhost' : document.location.protocol + '//' + document.location.host, 
};
Portal.Config.identityProviderBase = Portal.Config.SERVER_ROOT + '/identity_provider/';
Portal.Config.gameserverURL = Portal.Config.SERVER_ROOT + (document.location.host !== "wackadoo.de" ? '/client/map.html' : '/client1/map.html');
