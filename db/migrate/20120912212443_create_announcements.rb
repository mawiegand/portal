class CreateAnnouncements < ActiveRecord::Migration
  def change
    create_table :announcements do |t|
      t.string :title
      t.string :author
      t.timestamp :date
      t.string :image_url
      t.text :content

      t.timestamps
    end
  end
end
