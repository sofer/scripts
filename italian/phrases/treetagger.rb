# http://rubydoc.info/gems/treetagger-ruby/0.1.0/frames
# treetagger. Nothing here yet

require 'treetagger-ruby'

# Instantiate a tagger instance with default values.
tagger = TreeTagger::Tagger.new

# Process an array of tokens.
tagger.process(%w{Ich gehe in die Schule})

# Flush the pipeline.
tagger.flush

# Get the processed data.
tagger.get_output