/** Controls all logic and dialogs on the title page. Also is responsible to
 * switch between the two modes of that page: title (title image and large 
 * login dialog) and details (detailed information about the game). */
Portal.DialogController = Ember.Object.create(function() {
  var mainbarMinHeight = 0;
  var origMargin = 0;
  var origPadding = 0;
  
  return {  
    visibility: Portal.DIALOG_STATE_HIDDEN, ///< visibility of the dialog view. In case it's hidden, the title image will be shown instead.
    credentials: Portal.PasswordCredentials.create(),  ///< holding user-entered credentials
    bartype: Portal.DIALOG_TYPE_SIGNUP,     ///< state of the input fields in the bar-view; either sign in or sign up
    dialogtype: Portal.DIALOG_TYPE_SIGNUP,  ///< state of the input fields in the dialog-view; either sign in or sign up
    detailsVisible: false,                  ///< indicates, whether the browser presently presents the title screen or the details screen.
    animating: false,                       ///< true in case a switch from main to details screen (or vice versa) has been initiated and is underway (hasn't finished animating).
    lastError: null,                        ///< object holding the last error, either as received from the server or occured locally in the client. Null, if there is no "present" error.
    
    /** Observes the error an shows the dialog-view, if necessary. */
    lastErrorObserver: function() {
      var error = this.get('lastError');
      if (error && this.get('detailsVisible')) {
        this.switchBarClicked();
      }
      if (error && this.get('visibility') === Portal.DIALOG_STATE_HIDDEN) {
        this.toggleVisibility();
      }
      if (error) { // reset password field -> most frequent error
        this.get('credentials').set('password', null);
      }
    }.observes('lastError'),
    
    /** Reset the error. Should be called when user initiates a new
     * sgin in / sign up attempt or changes the state of the UI. */
    resetError: function() {
      this.set('lastError', null);
    },
  
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
  
    /** toggles the state of the UI from sign in to sign up and vice versa.
     * Also displays the dialog-view if not presently visible. */
    toggleViewClicked: function() {
      if (this.get('visibility') === Portal.DIALOG_STATE_HIDDEN) {
        this.toggleVisibility();
      }
      this.toggleBarType();
      this.toggleDialogType();
      this.resetError();
      if (this.get('bartype') === Portal.DIALOG_TYPE_SIGNUP) { // reset email
        this.get('credentials').set('email', null);
      }
    },
  
    /** this method heavily relies on jquery in order to realize the animation
     * effects. Changing CSS and hiding / showing might be transferred to 
     * ember views that bind to the detailsVisible property.  */
    switchBarClicked: function() {
      var self = this;
      
      this.resetError();
      
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
      var credentials = this.get('credentials');

      this.resetError();
      
      this.obtainAccessToken(credentials.email, credentials.password, function(access_token) {
        window.name = access_token;
        window.location = Portal.Config.gameserverURL;       
      });
    },
  
    signup: function() {
      var self = this;
      var credentials = this.get('credentials');
      
      this.resetError();
    
      if (credentials.validate()) {
      
        var params = [
          { name: 'nickname_base',
            value: 'WackyUser' },
          { name: 'email',
            value: credentials.email },
          { name: 'password',
            value: credentials.password },
          { name: 'password_confirmation',
            value: credentials.password },
          { name: 'client_id',
            value: 'WACKADOOHTML5' },
          { name: 'client_password',
            value: 'wacky' },
        ];
    
        $.ajax({
          type: 'POST',
          url: Portal.Config.identityProviderBase + '/identities/',
          data: params,
          success: function(data, textStatus, jqXHR) {
            switch(jqXHR.status) {
            case 201:  // created
              console.log(jqXHR, data, textStatus);
              var user = $.parseJSON(jqXHR.responseText)
              
              if (user.identifier) {
                self.obtainAccessToken(user.identifier, credentials.password, function(access_token) {
                  window.name = access_token;
                  window.location = Portal.Config.gameserverURL;       
                });                
              }
              else {
                self.set('lastError', {
                  type: 'signup',
                  msg: 'Server could not create a new unique user.',
                });        
              }
              
              break;
            default:
              var msgObj = $.parseJSON(jqXHR.responseText);
              console.log('ERORR during sign up: ' + msgObj.error_description);
              self.set('lastError', {
                type: 'signup',
                statusCode: jqXHR.status,
                msg: msgObj.error_description,
              });   
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            switch(jqXHR.status) {
            case 400:
            case 500:
            default:
              var msgObj = $.parseJSON(jqXHR.responseText);
              console.log('ERORR during sign up: ' + msgObj.error_description);
              self.set('lastError', {
                type: 'signup',
                statusCode: jqXHR.status,
                msg: msgObj.error_description,
              });   
            }                          
          }
        });      
      
      }
      else { // did not validate
        self.set('lastError', {
          type: 'signin',
          msg: 'Please provide a valid email and a password of at least 4 characters.',
        });
      }     
    },
    
    obtainAccessToken: function(username, password, onSuccess, onError) {
      var self = this;
      
      var params = [
        { name: 'username',
          value: username },
        { name: 'password',
          value: password },
        { name: 'client_id',
          value: 'WACKADOOHTML5' },
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
            if (onSuccess && data['access_token']) {
              Portal.Cookie.saveEmail(username, 7);
              onSuccess(data.access_token);
            }
            else if (! data['access_token']){
              self.set('lastError', {
                type: 'signin',
                statusCode: jqXHR.status,
                msg: 'Access token missing.',
              });             
            }
            break;
          default:
            var msgObj = $.parseJSON(jqXHR.responseText);
            
            self.set('lastError', {
              type: 'signin',
              statusCode: jqXHR.status,
              msg: msgObj.error_description,
            });
            
            console.log('ERORR during sign in: ' + msgObj.error_description);
            
            if (onError) {
              onError(jqXHR, textStatus, 'Unexpected server response.');
            }
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          switch(jqXHR.status) {
          case 400:
          case 500:
          default:
            var msgObj = $.parseJSON(jqXHR.responseText);
            self.set('lastError', {
              type: 'signin',
              statusCode: jqXHR.status,
              msg: msgObj.error_description,
            });
            console.log('ERORR during sign in: ' + msgObj.error_description);
            if (onError) {
              onError(jqXHR, textStatus, errorThrown);
            }
          }                          
        }
      }); 
    },
  };
}());