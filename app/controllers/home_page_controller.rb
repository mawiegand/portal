class HomePageController < ApplicationController
  require 'httparty'
  
  layout 'landing_page'
  
  def show
    @title               = I18n.t('home_page.welcome')
    @description         = I18n.t('home_page.meta_description') 
    
    @display_app_icon    = true
    
    @invitation          = params[:invitation]          if params[:invitation]
    @player_invitation   = params[:player_invitation]   if params[:player_invitation]
    @alliance_invitation = params[:alliance_invitation] if params[:alliance_invitation]
    @retention           = params[:retention]           if params[:retention]
    @referer             = request.referer              unless request.referer.blank?
    id                   = params[:id]              
    password_token       = params[:password_token]

    if !id.blank? && !password_token.blank?
      response = HTTParty.get(PORTAL_CONFIG['identity_provider_path'] + '/' + I18n.locale.to_s + '/send_password',
                   :query   => {:id              => id,
                                :password_token  => password_token,
                                :client_id       => PORTAL_CONFIG['client_id'],
                                :client_password => PORTAL_CONFIG['client_password'] },
                   :headers => { 'Accept' => 'application/json'})
      if response.code == 200
        @message = 'passwordSent'
      else
        @message = 'passwordNotSent'
      end             
    end
  end

end
