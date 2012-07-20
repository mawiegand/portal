class HomePageController < ApplicationController
  
  def show
    @title = I18n.t('home_page.welcome')
    @invitation = params[:invitation]      if params[:invitation]
  end

end
