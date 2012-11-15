require 'net/http'


def testurl(uri)
  uri = URI(uri)
  res = Net::HTTP.get_response(uri)
  if res.is_a?(Net::HTTPSuccess)
    puts "CHARSET: #{res.header['content-type']}"
    for k,v in res.header
      puts "#{k}: #{v}"
    end
    puts res.body
  end 
end

def testfile(file)
  puts File.read(file)
end


testurl('http://suggestqueries.google.com/complete/search?client=firefox&hl=it&ie=UTF-8&q=alla%20')
testurl('http://suggestqueries.google.com/complete/search?client=firefox&hl=it&oe=UTF-8&q=alla%20')
testurl('http://google.com/complete/search?output=toolbar&hl=it&q=alla%20&ie=UTF-8')
testfile('testin.js')

puts 'all done'