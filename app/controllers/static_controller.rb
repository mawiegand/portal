class StaticController < ApplicationController
  layout 'standard'
  
  def legal
  end
  
  def annals
  end
  
  def results
    @game_id      = 1
    @round_number = params[:round_number] || 0
    
    @hostname = request.host
    
    response = HTTParty.get("https://#{@hostname}/identity_provider/resource/results.json?game_id=#{ @game_id }&round_number=#{ @round_number }")
    
    if (response.code != 200 && response.code != 304) || response.empty?
      render :text => 'Page not Found', :status => 404
    else
      @content = response || [];
    end
  end

end
