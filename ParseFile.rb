
class ParseFile

  # multiline regex
  AMD = /define\(\[(.*?)\]/m
  DYNAMIC = /require\(\[?(.*?)\]?\)/m

  def initialize(root, file)
    @root=root
    @content = File.read(file)
    @dirname=File.dirname(file)
    path = File.absolute_path(file)
    @moduleName = sanitizeModuleName( path )

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
      sanitizeModuleName m
    end
    ret
  end

  def collectDynamicReferences
    # we assume multiple "require" statements AFTER the "define" block
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
      sanitizeModuleName m
    end
    ret
  end

  def getRefs
    @static + @dynamic 
  end

  def sanitizeModuleName name
    name = name.gsub(/['"]/,'')
    if name =~ /^\./ then
      name = File.join(@dirname, name)
    end
    name.gsub(/^#{@root}\//,'').gsub(/\.js$/,'')
  end
  
end
