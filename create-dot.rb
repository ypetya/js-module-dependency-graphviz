#!env ruby
#
require File.join(File.dirname(__FILE__), 'ParseFile')

def printDeps(file)
    p=ParseFile.new(file)
    p.parse
    p.getRefs.uniq.each do |ref|
      puts "\t \"#{p.moduleName}\" -> \"#{ref}\""
    end
end

def travel(maxdepth, &block)
  return if maxdepth == 0
  Dir.glob('*.js') {|file| yield file }
  
  dirs = Dir.glob('*').select { |f| File.directory? f }
  dirs.each do |dir|
    next if dir =~ /mock/
    Dir.chdir dir
    travel( maxdepth-1, &block )
    Dir.chdir '..'
  end
end

puts "digraph G {"
  travel 3 do |file|
    printDeps file
  end
puts "}"


