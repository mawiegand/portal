class HomePageController < ApplicationController
  require 'httparty'
  
  def show
    @title = I18n.t('home_page.welcome')
    
    @invitation     = params[:invitation]      if params[:invitation]
    
    id             = params[:id]              
    password_token = params[:password_token]

    if !id.blank? && !password_token.blank?
      response = HTTParty.get(PORTAL_CONFIG['identity_provider_base_url'] + '/send_password', 
                   :query   => {:id              => id,
                                :password_token  => password_token,
                                :client_id       => PORTAL_CONFIG['client_id'],
                                :client_password => PORTAL_CONFIG['client_password'] },
                   :headers => { 'Accept' => 'application/json'})
      if response.code == 200
        @message = 'Wir haben dir ein neues Passwort an deine Mail-Adresse geschickt. Du kannst dich damit wieder einloggen.' 
      else
        @message = 'Das Passwort Token wurde nicht gefunden'
      end             
    end
  end

end
