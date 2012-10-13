class AddLikesCounterToAnnouncements < ActiveRecord::Migration
  def change
    add_column :announcements, :likes_counter, :integer, :default => 0
  end
end
