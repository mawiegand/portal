class Announcement < ActiveRecord::Base
  default_scope :order => 'created_at DESC'
  scope :visible, :conditions => "expires IS NULL or expires > '#{Time.now.utc}'"

  scope :next, lambda {|created_at| where('created_at < ? and locale = ?', created_at, I18n.locale).order('created_at DESC') }
  scope :previous, lambda {|created_at| where('created_at > ? and locale = ?', created_at, I18n.locale).order('created_at ASC') }

  def next
    Announcement.next(self.created_at).visible.first
  end
  
  def previous
    Announcement.previous(self.created_at).visible.last
  end
  
  def increase_views
    self.views_counter += 1
	self.save
  end

  def get_global_views
    if self.original_id.nil?
	  global_announcements = Announcement.visible.where('id == ? or original_id == ?', self.id, self.id)
	else
	  global_announcements = Announcement.visible.where('id == ? or id == ?', self.id, self.original_id)
	end
    
	global_views = 0

	global_announcements.each do |announcement|
	  global_views += announcement.views_counter
	end

	return global_views
  end
end
