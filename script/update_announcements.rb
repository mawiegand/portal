#!/usr/bin/env ruby
#
# The above line selects the correct interpreter (ruby 1.9.x) on our servers.
#


# the following line includes the whole Rails Environment including all
# configurations and models. (Assuming the script is placed in /script)
# This takes a while at the startup of the script (seconds up to a minute in
# development environtment) but is exactly what you want.
require File.expand_path(File.join(File.dirname(__FILE__), '..', 'config', 'environment'))

response = HTTParty.get('https://wack-a-doo.de/game_server/fundamental/announcements/', :headers => { 'Accept' => 'application/json'})
response.code

response.parsed_response.each do |item|
  if Announcement.exists?(item["id"])
    announce = Announcement.find(item["id"])
  elsif item["published"]
    announce = Announcement.new
  end
  
  if announce != nil
    announce.id = item["id"]
    announce.title = item["heading"]
    announce.author = item["author_name"]
    announce.content = item["body"]
    announce.created_at = item["created_at"]
    announce.updated_at = item["updated_at"]
    
    announce.save
  end
end
