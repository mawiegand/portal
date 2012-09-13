class Announcement < ActiveRecord::Base
  
  scope :next, lambda {|id| where("id > ?",id).order("id ASC") } # this is the default ordering for AR
  scope :previous, lambda {|id| where("id < ?",id).order("id DESC") }

  def next
    Announcement.next(self.id).first
  end
  
  def previous
    Announcement.previous(self.id).first
  end

end
