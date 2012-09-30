require "bundler/capistrano"

set :stages, %w(production staging)
set :default_stage, "staging"

require "capistrano/ext/multistage"

`ssh-add`

default_run_options[:pty] = true                  # problem with ubuntu
set :ssh_options, :forward_agent => true           # ssh forwarding
set :port, 5775

set :application, "portal"
set :repository,  "git@github.com:wackadoo/portal.git"

set :scm, :git

set :user, "deploy-po"
set :use_sudo, false

set :deploy_to, "/var/www/portal"
set :deploy_via, :remote_cache


desc "Print server name"
task :uname do
  run "uname -a"
end


namespace :deploy do
  
  task :precompile do
    run "cd #{release_path}; RAILS_ENV=#{stage} bundle exec rake assets:precompile"
  end  
  
  desc "Restart Thin"
  task :restart, :roles => :app, :except => { :no_release => true } do
    stop
    start
  end

  desc "Start Thin"
  task :start do
    run "cd #{current_path}; bundle exec thin -C config/thin_#{stage}.yml start"
  end

  desc "Stop Thin"
  task :stop do
    run "cd #{current_path}; bundle exec thin -C config/thin_#{stage}.yml stop"
  end
  
end