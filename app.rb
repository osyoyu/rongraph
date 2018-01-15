require 'sinatra/base'
require 'json'
require 'csv'

class RonGraph < Sinatra::Base
  helpers do
    def environment
      ENV.fetch('RACK_ENV', 'development')
    end

    def csv
      Thread.current[:csv] ||= File.open("data/#{environment}.csv", "a+")
    end

    def auth
      halt 403 unless request.env['HTTP_AUTHENTICATION'] == "Bearer #{(ENV.fetch('RON_TOKEN', 's3cr3t_t0k3n'))}"
    end
  end

  before do
    content_type :json
  end

  get '/api/wordcount/all' do
    csv_data = CSV.read("data/#{environment}.csv")
    history = csv_data.map do |data|
      {
        timestamp: data[0],
        wordcount: data[1],
      }
    end

    {history: history}.to_json
  end

  post '/api/wordcount/update', provides: :json do
    auth

    params = JSON.parse(request.body.read)
    wordcount = params['wordcount']

    csv.puts("#{Time.now.to_i},#{wordcount.to_i}")
    csv.flush

    {status: 'ok'}.to_json
  end
end
