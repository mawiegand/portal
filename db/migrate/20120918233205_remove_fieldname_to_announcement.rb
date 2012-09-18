class RemoveFieldnameToAnnouncement < ActiveRecord::Migration
  def up
    remove_column :announcements, :date
  end

  def down
    add_column :announcements, :date, :timestamp
  end
end
