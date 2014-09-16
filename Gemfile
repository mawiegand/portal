source 'http://rubygems.org'
ruby "1.9.3"

gem 'rails', '3.1.12'

# Bundle edge Rails instead:
# gem 'rails',     :git => 'git://github.com/rails/rails.git'

gem 'sqlite3'
gem 'capistrano', '~> 2.14.0'
gem 'thin'

gem 'ember-rails'
gem 'ember-rest-rails'

gem 'httparty' , '0.10.2'

gem 'will_paginate', '~> 3.0.0'

gem 'therubyracer', '>= 0.11.2'          # missing javascript runtime
gem 'libv8'

group :production do
  gem 'pg'
end

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails',   '~> 3.1.5'
  gem 'coffee-rails', '~> 3.1.1'
  gem 'uglifier', '>= 1.0.3'
end

gem 'jquery-rails', '1.0.19'

# To use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

# Use unicorn as the web server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
# gem 'ruby-debug19', :require => 'ruby-debug'

group :test do
  # Pretty printed test output
  gem 'turn', '~> 0.8.3', :require => false
end
