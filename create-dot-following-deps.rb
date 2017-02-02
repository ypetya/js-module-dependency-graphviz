#!/usr/bin/env ruby

require File.join(File.dirname(__FILE__), 'ParseFile')

ROOT = File.absolute_path('.')
IGNORELIST = []
file = ARGV[0]
DISTANCE = (ARGV[1] || 5).to_i


VISITED=[]

# we are printing out AND return dependencies
# so the caller method can iterate through the output of this lambda
def retreiveDeps(file)
    references = []
    if !VISITED.include?(file) && File.exists?(file) then
      VISITED.push file
      dir=Dir.pwd
      Dir.chdir File.dirname(file)
      p=ParseFile.new(ROOT, File.basename(file), IGNORELIST)
      p.parse
      p.getRefs.uniq.each do |ref|
        puts "\t \"#{p.moduleName}\" -> \"#{ref}\""
        references.push ref
      end
      Dir.chdir dir
    end
    # the return statement in ruby style
    references
end

# FIXME : here replace the traveling by
# maintaining a cache of modules
# and jump from module to module
def travel(references, maxdepth, &block)
  return if maxdepth == 0
  more=[]
  references.each do |moduleName|
    more.concat(yield "#{moduleName}.js")
  end
   
  travel(more, maxdepth-1, &block )
end

puts "digraph G {"
  puts 'rankdir="LR"'
  travel( [ file.gsub(/\.js$/,'') ], DISTANCE ) do |file|
    retreiveDeps file
  end
puts "}"

