role :web, "gs07.wack-a-doo.de"                          # Your HTTP server, Apache/etc
role :app, "gs07.wack-a-doo.de"                          # This may be the same as your `Web` server
role :db,  "gs07.wack-a-doo.de", :primary => true        # This is where Rails migrations will run

set :rails_env, 'production'
set :branch,    'round7'
set :port, 5775                                            # until 5775 is working!
