
puts "hello world"
puts "hello world"
for i in 0..2
  puts "hello world"
end

class Character
  def initialize(name, species, age, gender)
    @name = name
    @species = species
    @age = age
    @gender = gender
    @text = 'asdfa'

    class << self
      #   attr_accessor :name
      attr_accessor(*[:name, :species, :age, :gender, :text])
    end

  end

  def hello()
    puts "Hello! My name is #{@name}. I'm a #{@age} years old #{@species}#{@gender}."
  end

end

neko = Character.new('Neko','cat',5,'boy')
neko.hello()

print "Write your name: "
neko.name = gets.chomp

puts neko.text
puts neko.name
neko.hello()
