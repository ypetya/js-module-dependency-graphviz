
ROOT=File.absolute_path('.')

class ParseFile

  # multiline regex
  AMD = /define\(\[(.*?)\]/m
  DYNAMIC = /require\(\[?(.*?)\]?\)/m

  def initialize(file)
    @content = File.read(file)
    path = File.absolute_path(file)
    @moduleName = path.gsub("#{ROOT}/",'').gsub(/\.js$/,'')

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
      match = sanitizeModuleName(match)
      ret.concat(match.split(','))
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
        matches.map! do |m| 
          sanitizeModuleName m
        end
        ret.concat(matches)
      else
        remaining=''
      end
    end
    ret
  end

  def getRefs
    @static + @dynamic 
  end

  def sanitizeModuleName name
    name.gsub(/['"]/,'').gsub(/^\.\//,'').gsub(/\.js$/,'')
  end
  
end
