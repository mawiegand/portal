class ApplicationController < ActionController::Base
  protect_from_forgery
  
  before_filter :set_locale  # get the locale from the user parameters
  around_filter :time_action

  
  # This method adds the locale to all rails-generated path, e.g. root_path.
  # Based on I18n documentation in rails guides:
  # http://guides.rubyonrails.org/i18n.html  
  def default_url_options(options={})
    { :locale => I18n.locale }
  end
  
  
  protected
    
    def time_action
      started = Time.now
      yield
      elapsed = Time.now - started
      logger.debug("Executing #{controller_name}::#{action_name} took #{elapsed*1000}ms in real-time.")
    end
  
    # Set the locale according to the user specified locale or to the default
    # locale, if not specified or specified is not available.
    def set_locale
      I18n.locale = get_locale_from_params || get_locale_from_domain || I18n.default_locale
      I18n.locale
    end

    # Checks whether the user specified locale is available.
    def get_locale_from_params
      return nil unless params[:locale]
      I18n.available_locales.include?(params[:locale].to_sym) ? params[:locale] : nil
    end

    # Checks whether the user specified locale is available.
    def get_locale_from_domain
      new_locale = PORTAL_CONFIG['domains_with_locale'][request.host_with_port]
      I18n.available_locales.include?(new_locale.nil? ? nil : new_locale.to_sym) ? new_locale : nil
    end

end
