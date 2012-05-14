#= require_self
#= require_tree ./models
#= require_tree ./controllers
#= require_tree ./views
#= require_tree ./helpers
#= require_tree ./templates


Portal = Ember.Application.create({
  ready: function() {
    var detailsVisible = false;
    var mainbarMinHeight = 0;
    var origMargin = 0;
    var origPadding = 0;
    
    $('#togglebar').click(function() {
      Portal.DialogController.toggleBarType();
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
      
        $('#menubar').slideUp();
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
    

    Portal.BarView.create({
      typeBinding: 'Portal.DialogController.bartype',
    }).appendTo('#loginbar');

    Portal.ToggleView = Ember.View.create({
      templateName: 'toggle-view',
      controllerBinding: 'Portal.DialogController',
    }).appendTo('#togglebar');
  },
});

Portal.DIALOG_STATE_HIDDEN  = 0;
Portal.DIALOG_STATE_VISIBLE = 1;
Portal.DIALOG_TYPE_SIGNUP  = 0;
Portal.DIALOG_TYPE_SIGNIN  = 1;





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




Portal.SignupBarView = Ember.View.extend({
  templateName: 'signup-form',
  
  didInsertElement: function() {
    this._super();
    this.$('input:first').focus();
  },  
});

Portal.SigninBarView = Ember.View.extend({
  templateName: 'signin-form',
  
  didInsertElement: function() {
    this._super();
    this.$('input:first').focus();
  },
});

Portal.SigninDialog = Ember.View.create({
  templateName: 'signin-dialog',
});

Portal.DialogController = Ember.Object.create({  
  visibility: Portal.DIALOG_STATE_HIDDEN,
  credentials: Portal.PasswordCredentials.create(),
  bartype: Portal.DIALOG_TYPE_SIGNUP,
  dialogtype: Portal.DIALOG_TYPE_SIGNIN,
  
  /** returns the overal context of the presented dialog;
   * that is, whether we presently assume the user wanting
   * to sing in or sign up. if the main-dialog is not presented,
   * the context is the type of the presented login-bar.
   * if the main dialog is presented, it's the type of the
   * main dialog. */ 
  context: function() {
    if (this.get('visibility') === Portal.DIALOG_STATE_HIDDEN) {
      return this.get('bartype');
    }
    else {
      return this.get('dialogtype');
    }
  }.property('visibility', 'bartype', 'dialogtype'),
  

  hideDialog: function() {
    this.set('state', Portal.DIALOG_STATE_HIDDEN);
    Portal.SigninDialog.remove();
    $('#figures').fadeIn();
    $('#loginbar .form-fields-group').fadeIn();    
  },
  
  showDialog: function() {
    this.set('state', Portal.DIALOG_STATE_VISIBLE);
    $('#figures').fadeOut();
    $('#loginbar .form-fields-group').fadeOut(function() {
      Portal.SigninDialog.appendTo($("#mainbar"));
    });    
  },


  toggleVisibility: function() {
    var state = this.get('state');
    if (state === Portal.DIALOG_STATE_HIDDEN) {
      this.showDialog();
    }
    else {
      this.hideDialog();
    }    
  },
  
  toggleBarType: function() {
    if (this.get('bartype') == Portal.DIALOG_TYPE_SIGNUP) {
      this.set('bartype', Portal.DIALOG_TYPE_SIGNIN);
    }
    else {
      this.set('bartype', Portal.DIALOG_TYPE_SIGNUP);
    }
    console.log(this.get('bartype'));
  },
  
  signin: function() {
    var self = this;
    var credentials = this.get('credentials');
    
    if (credentials.validate()) {
      
      var params = [
        { name: 'username',
          value: credentials.email },
        { name: 'password',
          value: credentials.password },
        { name: 'client_id',
          value: 'XYZ' },
        { name: 'scope',
          value: '5dentity wackadoo' },
        { name: 'grant_type',
          value: 'password' }
      ];
    
      $.ajax({
        type: 'POST',
        url: Portal.Config.identityProviderBase + '/oauth2/access_token',
        data: params,
        success: function(data, textStatus, jqXHR) {
          switch(jqXHR.status) {
          case 200:
            if (data['access_token']) {
              window.name = data.access_token;
              window.location = Portal.Config.gameserverURL;
            }
            break;
          default:
            msgObj = $.parseJSON(jqXHR.responseText);
            alert(msgObj.error_description);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          switch(jqXHR.status) {
            case 400:
            default:
              errObj = $.parseJSON(jqXHR.responseText);
              alert(errObj.error_description);
          }                          
        }
      });      
      
    }    
  },
  
  signup: function() {
    var self = this;
    var credentials = this.get('credentials');
    
    if (credentials.validate()) {
      
      var params = [
        { name: 'username',
          value: credentials.email },
        { name: 'password',
          value: credentials.password },
        { name: 'client_id',
          value: 'XYZ' },
        { name: 'scope',
          value: '5dentity wackadoo' },
        { name: 'grant_type',
          value: 'password' }
      ];
    
      $.ajax({
        type: 'POST',
        url: Portal.Config.identityProviderBase + '/oauth2/access_token',
        data: params,
        success: function(data, textStatus, jqXHR) {
          switch(jqXHR.status) {
          case 200:
            if (data['access_token']) {
              alert(data.access_token)
            }
            break;
          default:
            msgObj = $.parseJSON(jqXHR.responseText);
            alert(msgObj.error_description);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          switch(jqXHR.status) {
            case 400:
            default:
              errObj = $.parseJSON(jqXHR.responseText);
              alert(errObj.error_description);
          }                          
        }
      });      
      
    }    
  },
  
  
});


Portal.BarView = Ember.View.extend({
  templateName: 'bar-view',
  visible: true,
  type: Portal.DIALOG_TYPE_SIGNIN,
});


Portal.Config = {
  identityProviderBase: 'https://localhost/identity_provider/',
  gameserverURL: 'https://localhost/client/map.html'
};
