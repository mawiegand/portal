Portal::Application.routes.draw do


  scope "(:locale)", :locale => /en|de/ do
  
    resources :announcements, :only => [ :index, :show] do
      get 'like', :on => :member
      get 'dislike', :on => :member
    end

    resources :home_page,     :only => [ :show ]

    match :index,                                      :to => 'home_page#show'
    match '/invitations/:invitation',                  :to => 'home_page#show'
    match '/new_password/:id/:password_token',         :to => 'home_page#show'
    
    match '/return/:retention',                        :to => 'home_page#show'
    match '/invitations/:invitation',                  :to => 'home_page#show'
    match '/player_invitation/:player_invitation',     :to => 'home_page#show'
    match '/alliance_invitation/:alliance_invitation', :to => 'home_page#show'
    match '/new_password/:id/:password_token',         :to => 'home_page#show'    
    
  end

  root :to => 'home_page#show'
  match :index, :to => 'home_page#show'
  match '/:locale' => 'home_page#show'
  
end
