
/** represents an instance of the game; that is a particular round of wack-a-doo.
 * does also hold information about the servers the client should connect to. */
Portal.GameInstance = Ember.Object.extend({
  
  isDefaultGame: function() {
    return this.get('default_game?') !== undefined && this.get('default_game?') === true;
  }.property('default_game?').cacheable(),
  
  hasPlayerJoined: function() {
    return this.get('has_player_joined?') !== undefined && this.get('has_player_joined?') === true;
  }.property('has_player_joined?').cacheable(),
  

  clientBaseUrl: function() {
    var hostname  = this.getPath('serverConfig.html.hostname');
    var protocol  = this.getPath('serverConfig.html.protocol');
    var port      = this.getPath('serverConfig.html.port') || null;
    var namespace = this.getPath('serverConfig.html.namespace') || "";
    
    return protocol + hostname + (port ? ":"+port : "") + "/" + namespace;
  }.property('serverConfig.html.hostname', 'serverConfig.html.protocol', 'serverConfig.html.port', 'serverConfig.html.namespace')


  isOnline: function() {
    return this.getPath("serverConfig.html.online") == true;
  }.property('serverConfig.html.online').cacheable(),


  playable: function() {
    var startedAt = this.get('startedAt');
    var endedAt = this.get('endedAt')
    
    var startDate = startedAt ?  Date.parseISODate(startedAt) : null;
    var endData = endedAt ?  Date.parseISODate(endedAt) : null;
    
    return startDate && new Date().getTime() > startDate.getTime() && (!endDate || endDate.getTime() > new Date().getTime());
  }.property('startedAt', 'endedAt').cacheable(),
  
  
  canBeJoined: function() {
    return this.get('signupEnabled') == true && this.get('isOnline') == true && this.get('playable') == true;
  }.property('signupEnabled', 'isOnline', 'playable').cacheable(),
  
});


/** fetches and manages the list of available games. */
Portal.GameListManager = Ember.Object.extend({
  
  defaultGame: null,
  gameList: null,
  
  gameForSignup: function() {
    if (this.get('defaultGame')) {
      return this.get('defaultGame');
    }
    
    var gameList = this.get('gameList') || [];
    for (var i=0; i < gameList.length; ++i) {
      var game = gameList[i];
      if (game.get('canBeJoined')) {
        return game;
      }
    }
    
    return null;
  },
  
  
  
  updateGameList: function(accessToken, callback) {

    var self = this;

    $.ajax({
      
      type: 'GET',
      url: Portal.Config.IDENTITY_PROVIDER_BASE + (window.localePathFrag || "") + '/game/game_instances',
      data: null,
      
      beforeSend: function(xhr) {
        if (accessToken) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        }
      },
      
      success: function(data, textStatus, jqXHR) {
        switch(jqXHR.status) {
          case 200:
            var list = new Array();
            
            for (var i=0; i < data.length; ++i) {
              var game = Portal.GameInstance.create(data[i]);
              
              if (game.get('isDefaultGame') == true) {
                self.set('defaultGame', game);
              }
              else {
                list.push(game);
              }
              
            }
            
            self.set('gameList', list);
            
            alert("Default: " + JSON.stringify(self.get('defaultGame'), null, 4) + "\nList:" + JSON.stringify(self.get('gameList'), null, 4));
            break;
          default:
        }
        
        if (callback) {
          callback(true, jqXHR);
        }
      },
      
      error: function(jqXHR, textStatus, errorThrown) {
        alert("Error!");
        if (callback) {
          callback(false, jqXHR);
        }
      }
    }); 
    
  },
  
});