
Portal.DialogController = Ember.Object.create({  
  visibility: Portal.DIALOG_STATE_HIDDEN,
  credentials: Portal.PasswordCredentials.create(),
  bartype: Portal.DIALOG_TYPE_SIGNUP,
  dialogtype: Portal.DIALOG_TYPE_SIGNUP,
  
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
  
  
});