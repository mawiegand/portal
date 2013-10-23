
var AWE = window.AWE || {};

AWE.Facebook = (function(module) {
  
  var fetchMeAndConnect = function(authResponse, onSuccess, onFailure) {
    FB.api('/me', function(response) {    // check, it's really connected
      if (!response || response.error) {  
        if (onFailure) {
          onFailure(AWE.Net.BAD_REQUEST);
        }
      }
      else {
        var fbPlayerId    = authResponse.userID;
        var fbAccessToken = authResponse.accessToken;

        log('FACEBOOK: everything seems, fine, sending information to server. Me:', response)
        // TODO: connect to game server to play :-)
        // 
        // - fbaccesstoken to fb_access_token controller to receive game token
        // - connect to game
      }
    });
  }
  
  var loginAndConnect = function(onSuccess, onFailure) {
    log('FACEBOOK: now call login');
    FB.login(function(response) {
      log('FACEBOOK: login response', response);
      if (response.authResponse) {
        fetchMeAndConnect(response.authResponse, onSuccess, onFailure);
      }
      else {
        if (onFailure) {
          onFailure('loginBreak');
        }
      }
    }, module.defaultScope);
  }
    
  return module;

}(AWE.Facebook || {}));
