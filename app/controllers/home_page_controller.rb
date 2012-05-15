class HomePageController < ApplicationController
  
  def show
    @title = I18n.t('home_page.welcome')
  end

end
