class AddViewsCounterToAnnouncements < ActiveRecord::Migration
  def change
    add_column :announcements, :views_counter, :integer, :default => 0
  end
end
