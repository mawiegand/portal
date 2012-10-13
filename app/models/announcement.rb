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
  
  def increase_likes
    self.likes_counter += 1
    self.save
  end
  
  def decrease_likes
    self.likes_counter -= 1
    self.save
  end
  
  def get_original_id
    return self.original_id unless self.original_id.nil?
    return self.id
  end

  def get_global
    if self.original_id.nil?
      return Announcement.visible.where('id = ? or original_id = ?', self.id, self.id)
    else
      return Announcement.visible.where('id = ? or id = ?', self.id, self.original_id)
    end
  end

  def get_global_views
    global_views = 0
    
    self.get_global.each do |announcement|
      global_views += announcement.views_counter
    end
    
    return global_views
  end

  def get_global_likes
    global_likes = 0

    self.get_global.each do |announcement|
      global_likes += announcement.likes_counter
    end

    return global_likes
  end
end
