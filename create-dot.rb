#!/usr/bin/env ruby

require File.join(File.dirname(__FILE__), 'ParseFile')

ROOT = File.absolute_path('.')
IGNORELIST= [ 'jquery', 'underscore', 'require', 'lodash' ];

def printDeps(file)
    p=ParseFile.new(ROOT, file, IGNORELIST)
    p.parse
    p.getRefs.uniq.each do |ref|
      puts "\t \"#{p.moduleName}\" -> \"#{ref}\""
    end
end

def travel(maxdepth, &block)
  return if maxdepth == 0
  Dir.glob('*.js') do |file| 
    next if File.directory? file
    yield file 
  end
  dirs = Dir.glob('*').select { |f| File.directory? f }
  dirs.each do |dir|
    next if dir =~ /mock/
    Dir.chdir dir
    travel( maxdepth-1, &block )
    Dir.chdir '..'
  end
end

puts "digraph G {"
  puts 'rankdir="LR"'
  travel 100 do |file|
    printDeps file
  end
puts "}"


