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
        $('#signin').fadeOut();
      
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
          $('#signin').fadeIn();
        });
        $('#loginbar').animate({'margin-bottom': origMargin, 'padding-top': origPadding});

        detailsVisible = false;
      }
    });
    

    Portal.SigninBarView.appendTo('#loginbar');
  },
});

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


Portal.SignupBarView = Ember.View.create({
  templateName: 'signup-form',
  credentials: Portal.PasswordCredentials.create(),
      
  submit: function(view) {
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

Portal.SigninBarView = Ember.View.create({
  templateName: 'signin-form',
  credentials: Portal.PasswordCredentials.create(),
      
  submit: function(view) {
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
      
});


Portal.Config = {
  identityProviderBase: 'https://localhost/identity_provider/',
  gameserverURL: 'https://localhost/client/map.html'
};
