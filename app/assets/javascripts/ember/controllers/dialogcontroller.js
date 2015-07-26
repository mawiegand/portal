/** Controls all logic and dialogs on the title page. Also is responsible to
 * switch between the two modes of that page: title (title image and large 
 * login dialog) and details (detailed information about the game). */
Portal.DialogControllerClass = Ember.Object.extend(function() {
  var mainbarMinHeight = 0;
  var origMargin = 0;
  var origPadding = 0;
  
  return {  
    visibility: Portal.DIALOG_STATE_HIDDEN, ///< visibility of the dialog view. In case it's hidden, the title image will be shown instead.
    credentials: Portal.PasswordCredentials.create(),  ///< holding user-entered credentials
    registrationStatus: Portal.RegistrationStatus.create(),  ///< holding the current registration status fetched from identity provider
    bartype: Portal.DIALOG_TYPE_SIGNUP,     ///< state of the input fields in the bar-view; either sign in or sign up
    dialogtype: Portal.DIALOG_TYPE_SIGNUP,  ///< state of the input fields in the dialog-view; either sign in or sign up
    detailsVisible: false,                  ///< indicates, whether the browser presently presents the title screen or the details screen.
    animating: false,                       ///< true in case a switch from main to details screen (or vice versa) has been initiated and is underway (hasn't finished animating).
    lastError: null,                        ///< object holding the last error, either as received from the server or occured locally in the client. Null, if there is no "present" error.
    showWaitingListNotice: null,
    passwordTokenSent: false,
    passwordTokenNotSent: false,
    passwordSent: false,
    passwordNotSent: false,

    isLoading: false,
    isFbLoading: false,

    slogans: ['first', 'second', 'third', 'forth', 'fifth', 'sixth', 'seventh'],
    presentSlogan: 0,
    
    init: function() {
      this.fetchRegistrationStatus();
      setInterval((function(self) {
        return function() {
          self.fetchRegistrationStatus()
        };
      }(this)), 20000);
      
      if (Portal.Config.DISPLAY_SLOGAN) {
        setInterval((function(self) {
          return function() {
            self.switchSlogan();
          }
        }(this)), 10000);
      }
      else {
        $(".slogan").hide();
      }
      
      if (this.get('signinContext')) {
        this.hideBetaSubline();
      }      
    },
    
    switchSlogan: function() {
      if (this.get('visibility') === Portal.DIALOG_STATE_VISIBLE) {
        return ; // not this time; it's not visible
      }
      var slogans = this.get('slogans');
      var present = this.get('presentSlogan');
      var next    = (present+1)%slogans.length;
      
      var nslogan = slogans[next];
      var pslogan = slogans[present];

      $('#slogan-'+pslogan).fadeOut(function() {
        slogans.forEach(function(item) {
          $('#slogan-'+item).hide();
        });
        $('#slogan-'+nslogan).fadeIn();
      });
      
      this.set('presentSlogan', next);
    },
    
    betaSublineVisibilityObserver: function() {
      var signin = this.get("signinContext");
      if (signin) {
        this.hideBetaSubline();
      }
      else {
        this.showBetaSubline();
      }
    }.observes('signinContext'),
    
    hideBetaSubline: function() {
      $('#beta-notice .subline').hide();
    },

    showBetaSubline: function() {
      $('#beta-notice .subline').show();
    },

    
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
        this.get('credentials').set('password', '');
      }
    }.observes('lastError'),
    
    /** Reset the error. Should be called when user initiates a new
     * sgin in / sign up attempt or changes the state of the UI. */
    resetError: function() {
      this.set('lastError', null);
      this.set('passwordTokenSent', false);
      this.set('passwordTokenNotSent', false);
      this.set('passwordSent', false);
      this.set('passwordNotSent', false);
    },
  
    signinContext: function() {
      if (this.get('visibility') === Portal.DIALOG_STATE_HIDDEN) {
        return this.get('bartype') == Portal.DIALOG_TYPE_SIGNIN;
      }
      else {
        return this.get('dialogtype') == Portal.DIALOG_TYPE_SIGNIN;
      }
    }.property('visibility', 'bartype', 'dialogtype'),
  
    signupContext: function() {
      if (this.get('visibility') === Portal.DIALOG_STATE_HIDDEN) {
        return this.get('bartype') == Portal.DIALOG_TYPE_SIGNUP;
      }
      else {
        return this.get('dialogtype') == Portal.DIALOG_TYPE_SIGNUP;
      }
    }.property('visibility', 'bartype', 'dialogtype'),
  
    passwordContext: function() {
      if (this.get('visibility') === Portal.DIALOG_STATE_HIDDEN) {
        return this.get('bartype') == Portal.DIALOG_TYPE_PASSWORD;
      }
      else {
        return this.get('dialogtype') == Portal.DIALOG_TYPE_PASSWORD;
      }
    }.property('visibility', 'dialogtype'),
  
    /** toggles the state of the UI from sign in to sign up and vice versa.
     * Also displays the dialog-view if not presently visible. */
    toggleViewClicked: function() {
            
      if (this.get('visibility') === Portal.DIALOG_STATE_HIDDEN) {
        this.toggleVisibility();
      }
      
      if (this.get('dialogtype') === Portal.DIALOG_TYPE_SIGNIN) {
        this.set('dialogtype', Portal.DIALOG_TYPE_SIGNUP);
        this.set('bartype', Portal.DIALOG_TYPE_SIGNUP);
      }
      else {
        this.set('dialogtype', Portal.DIALOG_TYPE_SIGNIN);
        this.set('bartype', Portal.DIALOG_TYPE_SIGNIN);
      }
      this.resetError();

        //log("BARTYPE === SIGNIN", this.get('bartype'), this.get('dialogtype'),
        //            Ember.getPath("Portal.DialogController.credentials.email"), Ember.getPath("Portal.DialogController.credentials.password"))


      if (this.get('bartype') === Portal.DIALOG_TYPE_SIGNIN) { // reset email
        //this.get('credentials').set('email', "gucki");
        //log("BARTYPE === SIGNIN", this.get('bartype'), this.get('dialogtype'),
        //            Ember.getPath("Portal.DialogController.credentials.email"), Ember.getPath("Portal.DialogController.credentials.password"))
      }
    },
    
    resetPasswordClicked: function() {
      if (this.get('visibility') === Portal.DIALOG_STATE_HIDDEN) {
        this.toggleVisibility();
      }
      this.set('dialogtype', Portal.DIALOG_TYPE_PASSWORD);
      this.resetError();
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
        $('#top-controls').fadeOut();
    
        $('#menubar').slideUp(function() {
          if (Portal.DialogController.get('visibility') === Portal.DIALOG_STATE_VISIBLE) {
            Portal.DialogController.toggleVisibility(false);
          };
          $('#arrow').removeClass('arrow-down');
          $('#arrow').addClass('arrow-up');
          self.set('animating', false);
        });
        $('#loginbar').animate({'margin-bottom': '-100px', 'padding-top': '10px'});
        $('#logo-small').fadeOut();
        $('#teaser-text').fadeOut();
    
        Sample.pageStart(2); // page-2: info page (clicked switch bar)
        
        this.set('detailsVisible', true);
      }
      else {
        $('#menubar').slideDown();
        $('#mainbar').slideDown(function() {
          $('#detailsbar').hide(); 
          $('#switchbar-bottom').hide();
          $('#mainbar').css('min-height', mainbarMinHeight);
          $('#logo-small').fadeIn();
          $('#teaser-text').fadeIn();
          $('#arrow').removeClass('arrow-up');
          $('#arrow').addClass('arrow-down');
          $('#top-controls').fadeIn();
          $('#togglebar').fadeIn(function() {
            self.set('animating', false);
          });
        });
        $('#loginbar').animate({'margin-bottom': origMargin, 'padding-top': origPadding});

        Sample.pageStart(1); // page-1: landing page (clicked switch bar again)

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
      if (animated ) {
        $('#figures').fadeOut(function() {
          Portal.DialogView.appendTo($("#mainbar"));
        }); 
      }
      else {
        $('#figures').hide();
        Portal.DialogView.appendTo($("#mainbar"));      
      }   
    },
    
    cancel: function() {
      if (this.get('detailsVisible') === true) {
        this.switchBarClicked();
      }
      else if (this.get('visibility') === Portal.DIALOG_STATE_VISIBLE) {
        this.hideDialog();
      }
      else {
        $('input:focus').blur(); // lose focus
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
      this.set('showWaitingListNotice', false); // remove waiting list notice
      if (this.get('dialogtype') == Portal.DIALOG_TYPE_SIGNUP) {
        this.set('dialogtype', Portal.DIALOG_TYPE_SIGNIN);
      }
      else {
        this.set('dialogtype', Portal.DIALOG_TYPE_SIGNUP);
      }
    },
    
    /** the user was put on the waiting list; display a corresponding message. */
    handlePutOnWaitingList: function() {
      if (this.get('detailsVisible')) {
        this.switchBarClicked();
      }
      if (this.get('visibility') === Portal.DIALOG_STATE_HIDDEN) {
        this.toggleVisibility();
      }       
      this.set('dialogtype', Portal.DIALOG_TYPE_SIGNUP);
      this.set('bartype', Portal.DIALOG_TYPE_SIGNIN);
      this.set('showWaitingListNotice', true);
    },


    signinFacebook: function() {
      //log('FACEBOOK: now call login');

      var self = this;

      this.set('isFbLoading', true);

      FB.login(function(response) {
        //log('FACEBOOK: login response', response);
        if (response.authResponse) {
          var authResponse = response.authResponse;

          FB.api('/me', function(response) {    // check, it's really connected
            if (!response || response.error) {
              // TODO: do something on login errors?
            }
            else {
              var fbPlayerId    = authResponse.userID;
              var fbAccessToken = authResponse.accessToken;

              //log('FACEBOOK: everything seems, fine, sending information to server. Me:', response);
                            
              // TODO: 
//              var credentials = this.get('credentials');
//              firstSignin = firstSignin || false;

              self.resetError();

              if (window.JSON === undefined) {
                window.location = Portal.Config.SERVER_ROOT + "/browser.html";
              }

              self.obtainFbAccessToken(fbAccessToken, fbPlayerId, function(access_token, expiration) {
                window.name = JSON.stringify({
                  accessToken:        access_token, // this is not the access token from line 340!!!
                  fbPlayerId:         fbPlayerId,
                  expiration:         expiration, 
                  locale:             window.currentLocale,
                  retention:          window.retention,
                  playerInvitation:   (window.playerInvitation !== undefined && window.playerInvitation !== null ? window.playerInvitation : null),
                  allianceInvitation: (window.allianceInvitation !== undefined && window.allianceInvitation !== null ? window.allianceInvitation : null),
                  client_id:          'WACKADOO-FBCANVAS',
                  referer:            (Portal.Cookie.get('referer') != null ? Portal.Cookie.get('referer') : window.referer),
                  requestUrl:         Portal.Cookie.get('requestUrl'), 
                  installToken:       Sample.installToken(),
                  sessionToken:       Sample.sessionToken()
                });

                Portal.Cookie.deleteReferer();
                
                Sample.setFacebookId(fbPlayerId);
                Sample.signIn();
                Sample.pageEnd();
                
                setTimeout(function() {
                  window.location = Portal.Config.CLIENT_BASE + '?t=' + (Math.round(Math.random().toString() * 100000000));
                }, 200);
              });
            }   
          }); 
        }
      }, {scope: 'email,publish_actions'});
    },
  
    signin: function(firstSignin, password) {
      var credentials = this.get('credentials');
      firstSignin = firstSignin || false;
      password = password || credentials.get('password');

      this.resetError();
      
      if (window.JSON === undefined) {
        window.location = Portal.Config.SERVER_ROOT + "/browser.html";
      }
      
      this.obtainAccessToken($.trim(credentials.get('email')), password, function(access_token, expiration) {
        Portal.Cookie.saveEmail(credentials.get('email'), 7);
        
        window.name = JSON.stringify({
          accessToken:        access_token,
          expiration:         expiration, 
          locale:             window.currentLocale,
          retention:          window.retention,
          playerInvitation:   (window.playerInvitation !== undefined && window.playerInvitation !== null ? window.playerInvitation : null),
          allianceInvitation: (window.allianceInvitation !== undefined && window.allianceInvitation !== null ? window.allianceInvitation : null),
          client_id:          Portal.Config.CLIENT_ID,
          referer:            (Portal.Cookie.get('referer') != null ? Portal.Cookie.get('referer') : window.referer),
          requestUrl:         Portal.Cookie.get('requestUrl'), 
          installToken:       Sample.installToken(),
          sessionToken:       Sample.sessionToken()
        });

        Portal.Cookie.deleteReferer();
        
        Sample.signIn();
        Sample.pageEnd();
        
        setTimeout(function() {
          window.location = Portal.Config.CLIENT_BASE + '?t=' + (Math.round(Math.random().toString() * 100000000)) + (firstSignin ? "&signup=1" : "");
        }, 200);
        
      });
    },
  
    signup: function() {
      var self = this;
      var credentials = this.get('credentials');
      
      this.resetError();
    
      if (credentials.validate() && credentials.termsAccepted()) {
        
        var email = $.trim(credentials.get('email'));
        var password = credentials.get('password');
      
        var params = [
          {name: 'nickname_base',         value: 'WackyUser'},
          {name: 'email',                 value: email},
          {name: 'password',              value: password },
          {name: 'password_confirmation', value: password },
          {name: 'client_id',             value: Portal.Config.CLIENT_ID},
          {name: 'client_password',       value: Portal.Config.CLIENT_PASSWORD},
        ];
        
        if (typeof window.refid !== "undefined")
        {
          params.push({name: 'ref_id', value: window.refid || ""});
          params.push({name: 'sub_id', value: window.subid || ""});
        }
        
        if (window.invitation) {
          params.push({name: 'invitation', value: window.invitation});
        }
    
        this.set('isLoading', true);
    
        $.ajax({
          type: 'POST',
          url: Portal.Config.IDENTITY_PROVIDER_BASE + (window.localePathFrag || "") + '/identities/',
          data: params,
          beforeSend: function(xhr) {
            var referer = Portal.Cookie.get('referer') != null ? Portal.Cookie.get('referer') : window.referer;
            if (referer !== undefined && referer !== null) {
              xhr.setRequestHeader('X-Alt-Referer', referer);
            }
            var requestUrl = Portal.Cookie.get('requestUrl');
            if (requestUrl !== undefined && requestUrl !== null) {
              xhr.setRequestHeader('X-Alt-Request', requestUrl);
            }
          },
          success: function(data, textStatus, jqXHR) {
            
            switch(jqXHR.status) {
            case 200:
            case 201:  // created
              //log(jqXHR, data, textStatus);
              var user = $.parseJSON(jqXHR.responseText)
              
              if (user.identifier) {
                Sample.setEmail(email);
                Sample.registration(user.identifier);
                
                var signup_mode = self.getPath('registrationStatus.signup_mode');
                if (signup_mode === 2 && window.invitation === undefined) {    // invitation only
                  self.set('isLoading', false);            
                  self.handlePutOnWaitingList();
                }
                else if (self.getPath('registrationStatus.canSignin')) {
                  self.signin(true, password);
                }
                else {  // cannot do anything else (sign in presently disabled), just inform user has been signed up.
                  self.set('isLoading', false);            
                  self.set('lastError', {
                    type: 'signup',
                    statusCode: jqXHR.status,
                    notAnError: true, 
                    msg: 'Sign Up successful. Please check your emails.',
                  });   
                }
              }
              else {
                self.set('isLoading', false);            
                self.set('lastError', {
                  type: 'signup',
                  msg: 'Server could not create a new unique user.',
                });        
              }
              
              break;
            default:
              self.set('isLoading', false);            
              var msgObj = $.parseJSON(jqXHR.responseText);
              //log('ERORR during sign up: ' + msgObj.error_description);
              self.set('lastError', {
                type: 'signup',
                statusCode: jqXHR.status,
                msg: msgObj.error_description,
              });   
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            self.set('isLoading', false);
            var msgObj = $.parseJSON(jqXHR.responseText);
            //log('ERORR during sign up: ' + msgObj.error_description);
            
            switch(jqXHR.status) {
            case 409: // CONFLICT               
            case 400:
            case 500:
            default:
              self.set('lastError', {
                type: 'signup',
                statusCode: jqXHR.status,
                msg: msgObj.error_description,
              });   
            }                          
          }
        });      
      
      }
      else if (credentials.validate()) { // did not validate
        self.set('lastError', {
          type: 'signup',
          msg: 'Du musst die AGB akzeptieren, um dich zu registrieren.',
        });
      }     
      else { // did not validate
        self.set('lastError', {
          type: 'signup',
          msg: 'Gib eine gültige E-Mailadresse und ein Passwort mit mindestens sechs Zeichen an.',
        });
      }     
    },
    
    
    obtainFbAccessToken: function(fbAccessToken, fbPlayerId, onSuccess, onError) {
      var self = this;

      var params = [
        { name: 'fb_access_token',
          value: fbAccessToken },
        { name: 'fb_player_id',
          value: fbPlayerId },
        { name: 'client_id',             
          value: 'WACKADOO-FBCANVAS'},  // Portal.Config.CLIENT_ID},
        { name: 'client_password',
          value: '2638-AF67-260D-17AA-FA02'},
        { name: 'scope',
          value: Portal.Config.REQUESTED_SCOPES},
        { name: 'grant_type',
          value: 'fb-player-id' }
      ];

      if (window.invitation) {
        params.push({name: 'invitation', value: window.invitation});
      }
      
      if (typeof window.refid !== "undefined")
      {
        params.push({name: 'ref_id', value: window.refid || ""});
        params.push({name: 'sub_id', value: window.subid || ""});
      }

      this.set('isFbLoading', true);
  
      $.ajax({
        type: 'POST',
        url: Portal.Config.IDENTITY_PROVIDER_BASE + (window.localePathFrag || "") + '/oauth2/fb_access_token',
        beforeSend: function(xhr) {
          if (window.referer !== undefined && window.referer !== null) {
            xhr.setRequestHeader('X-Alt-Referer', window.referer);
          }
        },
        data: params,
        success: function(data, textStatus, jqXHR) {
          switch(jqXHR.status) {
          case 200:
            if (data['user_identifer']) {
              Sample.setUserId(data['user_identifer']);
            }
            if (onSuccess && data['access_token']) {
              onSuccess(data.access_token, data.expires_in);
            }
            else if (! data['access_token']){
              self.set('isFbLoading', false);

              self.set('lastError', {
                type: 'signin',
                statusCode: jqXHR.status,
                msg: 'Access token missing.',
              });     
              if (onError) {
                onError(jqXHR, textStatus,'Access token missing.');
              }        
            }
            break;
          default:
            self.set('isFbLoading', false);

            var msgObj = $.parseJSON(jqXHR.responseText);
            
            self.set('lastError', {
              type: 'signin',
              statusCode: jqXHR.status,
              msg: msgObj.error_description,
            });
            
            //log('ERORR during sign in: ' + msgObj.error_description);
            
            if (onError) {
              onError(jqXHR, textStatus, 'Unexpected server response.');
            }
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          self.set('isFbLoading', false);

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
            //log('ERORR during sign in: ' + msgObj.error_description);
            if (onError) {
              onError(jqXHR, textStatus, errorThrown);
            }
          }                          
        }
      }); 
    },

    obtainAccessToken: function(username, password, onSuccess, onError) {
      var self = this;
      
      var params = [
        { name: 'username',
          value: username },
        { name: 'password',
          value: password },
        { name: 'client_id',             
          value: Portal.Config.CLIENT_ID}, 
        { name: 'client_password',       
          value: Portal.Config.CLIENT_PASSWORD},
        { name: 'scope',
          value: Portal.Config.REQUESTED_SCOPES},
        { name: 'grant_type',
          value: 'password' }
      ];

      if (window.invitation) {
        params.push({name: 'invitation', value: window.invitation});
      }
      
      if (typeof window.refid !== "undefined")
      {
        params.push({name: 'ref_id', value: window.refid || ""});
        params.push({name: 'sub_id', value: window.subid || ""});
      }

      this.set('isLoading', true);
  
      $.ajax({
        type: 'POST',
        url: Portal.Config.IDENTITY_PROVIDER_BASE + (window.localePathFrag || "") + '/oauth2/access_token',
        beforeSend: function(xhr) {
          if (window.referer !== undefined && window.referer !== null) {
            xhr.setRequestHeader('X-Alt-Referer', window.referer);
          }
        },
        data: params,
        success: function(data, textStatus, jqXHR) {
          switch(jqXHR.status) {
          case 200:
            if (data['user_identifer']) {
              Sample.setUserId(data['user_identifer']);
            }
            if (onSuccess && data['access_token']) {
              onSuccess(data.access_token, data.expires_in);
            }
            else if (! data['access_token']){
              self.set('isLoading', false);

              self.set('lastError', {
                type: 'signin',
                statusCode: jqXHR.status,
                msg: 'Access token missing.',
              });     
              if (onError) {
                onError(jqXHR, textStatus,'Access token missing.');
              }        
            }
            break;
          default:
            self.set('isLoading', false);

            var msgObj = $.parseJSON(jqXHR.responseText);
            
            self.set('lastError', {
              type: 'signin',
              statusCode: jqXHR.status,
              msg: msgObj.error_description,
            });
            
            //log('ERORR during sign in: ' + msgObj.error_description);
            
            if (onError) {
              onError(jqXHR, textStatus, 'Unexpected server response.');
            }
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          self.set('isLoading', false);

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
            //log('ERORR during sign in: ' + msgObj.error_description);
            if (onError) {
              onError(jqXHR, textStatus, errorThrown);
            }
          }                          
        }
      }); 
    },
    
    fetchRegistrationStatus: function() {

      var self = this;

      var params = [
        {name: 'client_id',             value: Portal.Config.CLIENT_ID},
        {name: 'client_password',       value: Portal.Config.CLIENT_PASSWORD},
      ];

      $.ajax({
        type: 'GET',
        url: Portal.Config.IDENTITY_PROVIDER_BASE + (window.localePathFrag || "") + '/clients/' + Portal.Config.CLIENT_ID,
        data: params,
        beforeSend: function(xhr) {
          if (window.referer !== undefined && window.referer !== null) {
            xhr.setRequestHeader('X-Alt-Referer', window.referer);
          }
        },
        success: function(data, textStatus, jqXHR) {
          switch(jqXHR.status) {
            case 200:
              var status = self.get('registrationStatus');
              status.set('signin_mode', data['signin_mode']);
              status.set('signup_mode', data['signup_mode']);
              break;
            default:
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          var status = self.get('registrationStatus');
          status.set('signin_mode', 0);
          status.set('signup_mode', 0);
        }
      }); 
    },    

    createPasswordResetToken: function() {

      var identifier = this.getPath('credentials.email');

      if (identifier && identifier != '') {
        var self = this;
  
        var params = [
          {name: 'client_id',             value: Portal.Config.CLIENT_ID},
          {name: 'client_password',       value: Portal.Config.CLIENT_PASSWORD},
          {name: 'identifier',            value: $.trim(identifier)}  
        ];
  
        this.set('isLoading', true);
  
        $.ajax({
          type: 'GET',
          url: Portal.Config.IDENTITY_PROVIDER_BASE + (window.localePathFrag || "") + '/send_password_token',
          data: params,
          success: function(data, textStatus, jqXHR) {
            self.set('isLoading', false);
            switch(jqXHR.status) {
              case 200:
                self.set('passwordTokenSent', true);
                break;
              default:
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            self.set('isLoading', false);
            self.set('passwordTokenNotSent', true);
          }
        });
      }
    },    
  };
}());
