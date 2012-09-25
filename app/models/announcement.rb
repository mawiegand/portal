class Announcement < ActiveRecord::Base
  default_scope :order => "created_at DESC"
  scope :visible, :conditions => "expires IS NULL or expires > '#{Time.now.utc}'"

  scope :next, lambda {|created_at| where("created_at < ? and locale = ?", created_at, I18n.locale).order("created_at DESC") }
  scope :previous, lambda {|created_at| where("created_at > ? and locale = ?", created_at, I18n.locale).order("created_at ASC") }

  def next
    Announcement.next(self.created_at).visible.first
  end
  
  def previous
    Announcement.previous(self.created_at).visible.last
  end

end
