class AddExpiresToAnnouncements < ActiveRecord::Migration
  def change
    add_column :announcements, :expires, :timestamp
  end
end
