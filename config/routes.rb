Portal::Application.routes.draw do


  scope "(:locale)", :locale => /en|de/ do
  
    resources :announcements, :only => [ :index, :show] do
      get 'like', :on => :member
      get 'dislike', :on => :member
    end

    resources :home_page,     :only => [ :show ]

    match '/legal',                                    :to => 'static#legal'
    match '/annals',                                   :to => 'static#annals'
    match '/annals/results',                           :to => 'static#results', :as => 'annals_results'
    match '/special_offers',                           :to => 'static#special_offers'

    match :index,                                      :to => 'home_page#show'
    match '/invitations/:invitation',                  :to => 'home_page#show'
    match '/new_password/:id/:password_token',         :to => 'home_page#show'
    
    match '/return/:retention',                        :to => 'home_page#show'
    match '/invitations/:invitation',                  :to => 'home_page#show'
    match '/player_invitation/:player_invitation',     :to => 'home_page#show'
    match '/alliance_invitation/:alliance_invitation', :to => 'home_page#show'
    match '/new_password/:id/:password_token',         :to => 'home_page#show'

    # redirect for setting referer id directly in url http://wack-a-doo.de/r/1234
    match '/r/:r' => redirect { |p| "?r=#{p[:r]}" }
  end

  root :to => 'home_page#show'
  match :index, :to => 'home_page#show'
  match '/:locale' => 'home_page#show'
  
end
