#!/usr/bin/env ruby
#
# The above line selects the correct interpreter (ruby 1.9.x) on our servers.
#


# the following line includes the whole Rails Environment including all
# configurations and models. (Assuming the script is placed in /script)
# This takes a while at the startup of the script (seconds up to a minute in
# development environtment) but is exactly what you want.
require File.expand_path(File.join(File.dirname(__FILE__), '..', 'config', 'environment'))

url = File.read("#{Rails.root}/config/update_url.conf")

response = HTTParty.get(url, :headers => { 'Accept' => 'application/json', 'If-Modified-Since' => Announcement.maximum(:updated_at).httpdate })
httpstatus = response.code

if httpstatus == 200
  response.parsed_response.each do |item|
    if Announcement.exists?(item["id"])
      announce = Announcement.find(item["id"]) if Time.parse(item["updated_at"]) >= 7.days.ago
    elsif item["public"]
      announce = Announcement.new
    end
    
    if announce != nil
      announce.id = item["id"]
      announce.locale = item["locale"]
      announce.expires = item["expires"].to_datetime unless item["expires"].nil?
      announce.image_url = "team/#{item['author_name'].downcase}.jpg"
      announce.title = item["heading"]
      announce.author = item["author_name"]
      announce.content = item["body"]
      announce.created_at = item["created_at"]
      announce.updated_at = item["updated_at"]
      
      announce.save
    end
  end
elsif httpstatus == 304
  puts "Nothing to update! Http-Status: #{httpstatus}"
else
  Rails.logger.debug "An error occured! Http-Status: #{httpstatus}"
end
