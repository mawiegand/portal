
Portal.DialogController = Ember.Object.create(function() {
  var mainbarMinHeight = 0;
  var origMargin = 0;
  var origPadding = 0;
  
  return {  
    visibility: Portal.DIALOG_STATE_HIDDEN,
    credentials: Portal.PasswordCredentials.create(),
    bartype: Portal.DIALOG_TYPE_SIGNUP,
    dialogtype: Portal.DIALOG_TYPE_SIGNUP,
    detailsVisible: false,
    animating: false,
  
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
  
    toggleViewClicked: function() {
      if (this.get('visibility') === Portal.DIALOG_STATE_HIDDEN) {
        this.toggleVisibility();
      }
      this.toggleBarType();
      this.toggleDialogType();
    },
  
    /** this method heavily relies on jquery in order to realize the animation
     * effects. Changing CSS and hiding / showing might be transferred to 
     * ember views that bind to the detailsVisible property.  */
    switchBarClicked: function() {
      var self = this;
      
      if (this.get('animating')) {
        return ; // can not start a second switch before the first is finished
      }
      this.set('animating', true);
      
      if (!this.get('detailsVisible')) {      
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
          };
          self.set('animating', false);
        });
        $('#loginbar').animate({'margin-bottom': '-80px', 'padding-top': '10px'});
        $('#logo-small').fadeOut();
        $('#switchbar-teaser').fadeOut();
    
        this.set('detailsVisible', true);
      }
      else {
        $('#menubar').slideDown();
        $('#mainbar').slideDown(function() {
          $('#detailsbar').hide(); 
          $('#switchbar-bottom').hide();
          $('#mainbar').css('min-height', mainbarMinHeight);
          $('#logo-small').fadeIn();
          $('#switchbar-teaser').fadeIn()
          $('#togglebar').fadeIn(function() {
            self.set('animating', false);
          });
        });
        $('#loginbar').animate({'margin-bottom': origMargin, 'padding-top': origPadding});

        this.set('detailsVisible', false);
      }
    },

    hideDialog: function(animated) {
      animated = animated === undefined ? true : animated;
    
      this.set('visibility', Portal.DIALOG_STATE_HIDDEN);
      Portal.DialogView.remove();
      if (animated) {
        $('#figures').fadeIn();
      }
      else {
        $('#figures').show();      
      }
    },
  
    showDialog: function(animated) {
      animated = animated === undefined ? true : animated;

      this.set('visibility', Portal.DIALOG_STATE_VISIBLE);
      if (animated) {
        $('#figures').fadeOut(function() {
          Portal.DialogView.appendTo($("#mainbar"));
        }); 
      }
      else {
        $('#figures').hide();
        Portal.DialogView.appendTo($("#mainbar"));      
      }   
    },

    toggleVisibility: function(animated) {
      animated = animated === undefined ? true : animated;

      var state = this.get('visibility');
      if (state === Portal.DIALOG_STATE_HIDDEN) {
        this.showDialog(animated);
      }
      else {
        this.hideDialog(animated);
      }    
    },
  
    toggleBarType: function() {
      if (this.get('bartype') == Portal.DIALOG_TYPE_SIGNUP) {
        this.set('bartype', Portal.DIALOG_TYPE_SIGNIN);
      }
      else {
        this.set('bartype', Portal.DIALOG_TYPE_SIGNUP);
      }
    },
  
    toggleDialogType: function() {
      if (this.get('dialogtype') == Portal.DIALOG_TYPE_SIGNUP) {
        this.set('dialogtype', Portal.DIALOG_TYPE_SIGNIN);
      }
      else {
        this.set('dialogtype', Portal.DIALOG_TYPE_SIGNUP);
      }
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
  };
}());