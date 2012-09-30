role :web, "portal.wack-a-doo.de"                          # Your HTTP server, Apache/etc
role :app, "portal.wack-a-doo.de"                          # This may be the same as your `Web` server
role :db,  "portal.wack-a-doo.de", :primary => true        # This is where Rails migrations will run

set :deploy_env, 'production'