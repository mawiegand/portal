//= require_self
//= require_tree ./config
//= require_tree ./models
//= require_tree ./views
//= require_tree ./controllers
//= require_tree ./helpers
//= require_tree ./i18n

Portal = Ember.Application.create({
  ready: function() {
    
    Sample.pageStart(1); // page-1: langing page
    
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

    $('#langswitch').click(function() {
      Portal.DialogController.languageSwitchClicked();
    });
    
    $('#switchbar').click(function(e) {
      if (e.target.tagName !== "A") {
        Portal.DialogController.switchBarClicked();
      }
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

    /*Portal.BarView = Ember.View.create({
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
      
      passwordChangeType: function() {
        return Portal.DialogController.get('bartype') === Portal.DIALOG_TYPE_PASSWORD_CHANGE;
      }.property('Portal.DialogController.bartype').cacheable(),
      
      hiddenBinding: 'Portal.DialogController.visibility',

    }).appendTo('#loginbar');*/

    Portal.ToggleView = Ember.View.create({
      templateName: 'toggle-view',
      controllerBinding: 'Portal.DialogController',
    }).appendTo('#togglebar');
    
    Portal.DialogView = Ember.View.create({
      templateName: 'dialog',
      controllerBinding: 'Portal.DialogController',
    }).appendTo('#mainbar');

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
    
    if (Portal.Cookie.get('referer') == null && window.referer) {
      Portal.Cookie.setReferer(window.referer, window.location.href, 28);
    }
    else {
      Portal.Cookie.restoreReferer();
    }
    
    // preload hack
    var img1 = new Image(); img1.src = Portal.Config.CLIENT_BASE + '/assets/splashscreen/ladedame_neu.png';
    var img2 = new Image(); img2.src = Portal.Config.CLIENT_BASE + '/assets/splashscreen/crack_color.jpg';
    var img3 = new Image(); img3.src = Portal.Config.CLIENT_BASE + '/assets/splashscreen/crack_sw.jpg';
    
  },
});

Portal.DIALOG_STATE_HIDDEN  = 0;
Portal.DIALOG_STATE_VISIBLE = 1;

Portal.DIALOG_TYPE_SIGNUP   = 0;
Portal.DIALOG_TYPE_SIGNIN   = 1;
Portal.DIALOG_TYPE_PASSWORD = 2;
Portal.DIALOG_TYPE_PASSWORD_CHANGE = 3;

Portal.Cookie = Ember.Object.create({
  email: null,
  referer: null,
  urlParams: null,
  
  init: function() {
    this._super();
    this.set('email', this.restoreEmail());
    this.restoreReferer();
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
    document.cookie = "wackadoo_email=" + value;
    this.set('email', email);
  }, 

  restoreReferer: function() {
    var i,x,y, cookies=document.cookie.split(";");
    for (i=0; i< cookies.length; i++) {
      x=cookies[i].substr(0,cookies[i].indexOf("="));
      y=cookies[i].substr(cookies[i].indexOf("=")+1);
      x=x.replace(/^\s+|\s+$/g,"");
      if (x == 'wackadoo_referer') {
        var referer = unescape(y);
        this.set('referer', referer)
      }
      if (x == 'wackadoo_request_url') {
        var requestUrl = unescape(y);
        this.set('requestUrl', requestUrl)
      }
    }
  },
  
  setReferer: function(referer, requestUrl, days) {
    var expires = new Date();
    expires.setDate(expires.getDate() + days);
    
    var value = escape($.trim(referer)) + ((expires===null) ? "" : "; expires="+expires.toUTCString());
    document.cookie = "wackadoo_referer=" + value;
    this.set('referer', referer);
    
    if (requestUrl != null) {
      value = escape($.trim(requestUrl)) + ((expires===null) ? "" : "; expires="+expires.toUTCString());
      document.cookie = "wackadoo_request_url=" + value;
      this.set('requestUrl', requestUrl)
    }
  },
  
  deleteReferer: function() {
    var expires = new Date();
    expires.setDate(expires.getDate() - 1);
    
    document.cookie = "wackadoo_referer=null; expires="+expires.toUTCString();
    this.set('referer', null);
    
    document.cookie = "wackadoo_request_url=null; expires="+expires.toUTCString();
    this.set('requestUrl', null)
  } 
});

window.fbAsyncInit = function() {

  FB.init({
    appId      : '127037377498922',          // App ID from the app dashboard
    channelUrl : '//'+Portal.Config.SERVER_ROOT+'client/channel.html', // Channel file for x-domain comms
    status     : true,                       // Check Facebook Login status
    xfbml      : false                       // Don't look for social plugins on the page
  }); 

};

var sdkLocale = window.currentLocale || Portal.Config.DEFAULT_LOCALE || "en_US";
(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id; 
  js.src = "//connect.facebook.net/"+sdkLocale+"/all.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

