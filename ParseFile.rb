
class ParseFile

  # multiline regex
  AMD = /define\(\[(.*?)\]/m
  DYNAMIC = /require\(\[?(.*?)\]?\)/m

  def initialize(root, file, ignoreList)
    @root = root
    @content = File.read(file)
    @dirname=File.dirname(file)
    @ignoreList = ignoreList
    @moduleName = sanitize( "./#{file}" )
    @content.gsub!(/\s*/,'')
  end

  def moduleName
    @moduleName
  end

  def parse
    @static = collectStaticReferences
    @dynamic = collectDynamicReferences
  end

  def collectStaticReferences
    # we assume ONE module definition by "define" keyword at the beginning of a file
    ret= []
    AMD.match(@content) do |m|
      match=m[1]
      ret.concat(match.split(','))
    end
    ret.map! do |m| 
      sanitize m
    end
    ret
  end

  def collectDynamicReferences
    # we assume multiple "require" statements
    ret=[]
    
    remaining=@content
      
    while remaining.length > 0
      if matches = DYNAMIC.match(remaining) do |m| 
          remaining = m.post_match
          m[1].gsub(/['"]/,'').split(',')
        end
        ret.concat(matches)
      else
        remaining=''
      end
    end
    ret.map! do |m| 
      sanitize m
    end
    ret
  end

  def getRefs
    (@static + @dynamic).reject do |m| 
      @ignoreList.include? m
    end
  end

  def sanitize name
    name = name.gsub(/['"]/,'')
    if name =~ /^\./ then
      name = File.absolute_path( File.join(@dirname, name) )
    end
    name.gsub(/^#{@root}\//,'').gsub(/\.js$/,'')
  end
  
end
