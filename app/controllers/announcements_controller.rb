class AnnouncementsController < ApplicationController
  
  layout 'standard'
  
  # GET /announcements
  # GET /announcements.json
  def index
    @announcements = Announcement.visible.where(locale: I18n.locale || 'en').paginate(:page => params[:page], :per_page => 10)
    
    @announcements.first.increase_views   unless  @announcements.empty?

    logger.debug @announcement.inspect

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @announcements }
    end
  end

  # GET /announcements/1
  # GET /announcements/1.json
  def show
    @announcement = Announcement.visible.find(params[:id])
    
    @announcement.increase_views

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @announcement }
    end
  end
  
  def like
    @announcement = Announcement.find(params[:id])

    session[:likes] = [] if session[:likes].nil?

    unless session[:likes].include?(@announcement.get_original_id)
      @announcement.increase_likes 
      session[:likes] << @announcement.get_original_id
    end
    
    redirect_to :back
  end

  def dislike
    @announcement = Announcement.find(params[:id])

    session[:likes] = [] if session[:likes].nil?

    if session[:likes].include?(@announcement.get_original_id)
      @announcement.decrease_likes 
      session[:likes].delete(@announcement.get_original_id)
    end
    
    redirect_to :back
  end

  # GET /announcements/new
  # GET /announcements/new.json
  def new
    @announcement = Announcement.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @announcement }
    end
  end

  # GET /announcements/1/edit
  def edit
    @announcement = Announcement.find(params[:id])
  end

  # POST /announcements
  # POST /announcements.json
  def create
    @announcement = Announcement.new(params[:announcement])

    respond_to do |format|
      if @announcement.save
        format.html { redirect_to @announcement, notice: 'Announcement was successfully created.' }
        format.json { render json: @announcement, status: :created, location: @announcement }
      else
        format.html { render action: "new" }
        format.json { render json: @announcement.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /announcements/1
  # PUT /announcements/1.json
  def update
    @announcement = Announcement.find(params[:id])

    respond_to do |format|
      if @announcement.update_attributes(params[:announcement])
        format.html { redirect_to @announcement, notice: 'Announcement was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @announcement.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /announcements/1
  # DELETE /announcements/1.json
  def destroy
    @announcement = Announcement.find(params[:id])
    @announcement.destroy

    respond_to do |format|
      format.html { redirect_to announcements_url }
      format.json { head :ok }
    end
  end
end
