class AddOriginalIdToAnnouncements < ActiveRecord::Migration
  def change
    add_column :announcements, :original_id, :integer
  end
end
