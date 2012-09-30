class AddEditedAtToAnnouncements < ActiveRecord::Migration
  def change
    add_column :announcements, :edited_at, :datetime
  end
end
