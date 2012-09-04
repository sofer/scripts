# remove duplicate mp3 files from iTunes

require 'find'

dir = "/Volumes/music/iTunes"

Find.find(dir) do |path|
  if FileTest.directory?(path)
    next
  else
    if path =~ / \d\.\m4a$/
      p "Deleting " + path
      File.delete path
    end
  end
end
