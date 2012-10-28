#= require_self
#= require_tree ./config
#= require_tree ./models
#= require_tree ./views
#= require_tree ./controllers
#= require_tree ./helpers
#= require_tree ./templates
#= require_tree ./i18n

Portal = Ember.Application.create({
  ready: function() {
    
    Portal.DialogController = Portal.DialogControllerClass.create();
    
    // binding to ajaxSend in order to modify the accept header
    // of outgoing packages (-> accept only json, no html!)
    $(document).bind('ajaxSend', function(event, xhr) {
      xhr.setRequestHeader('Accept', 'application/json');
    });    
        
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
      
      aboutClicked: function() {
        this.get('controller').switchBarClicked();
      },
      
      showSignin: function() {
        this.get('controller').toggleViewClicked();
      },
      showSignup: function() {
        this.get('controller').toggleViewClicked();
      },
    }).appendTo('#menubar');

    Portal.BarView = Ember.View.create({
      templateName: 'bar-view',
      
      signupType: function() {
        return Portal.DialogController.get('bartype') === Portal.DIALOG_TYPE_SIGNUP;
      }.property('Portal.DialogController.bartype').cacheable(),
      
      signinType: function() {
        return Portal.DialogController.get('bartype') === Portal.DIALOG_TYPE_SIGNIN;
      }.property('Portal.DialogController.bartype').cacheable(),
      
      passwordType: function() {
        return Portal.DialogController.get('bartype') === Portal.DIALOG_TYPE_PASSWORD;
      }.property('Portal.DialogController.bartype').cacheable(),
      
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

    if (window.startMsg) {
      if (window.startMsg == 'passwordSent') {
        Portal.DialogController.toggleVisibility(false);
        Portal.DialogController.set('passwordSent', true);
        Portal.DialogController.set('dialogtype', Portal.DIALOG_TYPE_PASSWORD);
      }
      else if (window.startMsg == 'passwordNotSent') {
        Portal.DialogController.toggleVisibility(false);
        Portal.DialogController.set('passwordNotSent', true);
        Portal.DialogController.set('dialogtype', Portal.DIALOG_TYPE_PASSWORD);
      }
    }
    
    // preload hack
    var img1 = new Image(); img1.src = Portal.Config.CLIENT_BASE + '/assets/splashscreen/ladedame.png';
    var img2 = new Image(); img2.src = Portal.Config.CLIENT_BASE + '/assets/splashscreen/mapcolor.jpg';
    var img3 = new Image(); img3.src = Portal.Config.CLIENT_BASE + '/assets/splashscreen/mapsw.jpg';
    
  },
});

Portal.DIALOG_STATE_HIDDEN  = 0;
Portal.DIALOG_STATE_VISIBLE = 1;

Portal.DIALOG_TYPE_SIGNUP   = 0;
Portal.DIALOG_TYPE_SIGNIN   = 1;
Portal.DIALOG_TYPE_PASSWORD = 2;

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
    var value = escape($.trim(email)) + ((expires==null) ? "" : "; expires="+expires.toUTCString());
    document.cookie= "wackadoo_email=" + value;
    this.set('email', email);
  }, 

});
