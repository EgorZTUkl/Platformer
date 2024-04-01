require 'gosu'

class GameWindow < Gosu::Window
  def initialize
    super 1920, 1080, fullscreen: true
    self.caption = "Endless Runner"
    @background_image = Gosu::Image.new("background.png", tileable: true)
    @player = Player.new
    @platforms, @bombs, @enemies = [], [], []
    @speed, @score = 5, 0
    @font = Gosu::Font.new(64)
  end

  def update
    @player.move_left if button_down? Gosu::KB_LEFT
    @player.move_right if button_down? Gosu::KB_RIGHT
    @player.jump if button_down? Gosu::KB_SPACE
    @player.update

    spawn_elements
    move_elements
    check_collisions

    @score += 1
    @speed += 0.05  # Збільшення швидкості
  end

  def draw
    @background_image.draw(0, 0, 0)
    @player.draw
    [@platforms, @bombs, @enemies].each { |elements| elements.each(&:draw) }
    @font.draw("Score: #{@score}", 10, 10, 1, 1.0, 1.0, Gosu::Color::WHITE)
  end

  def spawn_elements
    spawn_platforms if @platforms.empty? || @platforms.last.right < width - 300
    @bombs << Bomb.new(width, height - rand(200..300)) if rand(100) < 1
    @enemies << Enemy.new(width, height - rand(200..300)) if rand(200) < 1
  end

  def spawn_platforms
    gap_size = rand(100..400)  # Збільшення відстані між платформами
    @platforms << Platform.new(width, height - gap_size, gap_size)
  end

  def move_elements
    [@platforms, @bombs, @enemies].each { |elements| elements.each { |element| element.move(-@speed) } }
    [@platforms, @bombs, @enemies].each { |elements| elements.reject! { |element| element.right < 0 } }
  end

  def check_collisions
    @platforms.each do |platform|
      if @player.intersects?(platform)
        @player.land(platform.top)
        game_over if @player.dead?
        break
      end
    end

    [@bombs, @enemies].each do |elements|
      elements.each do |element|
        if @player.intersects?(element)
          @player.hit
          elements.delete(element)
          break
        end
      end
    end

    game_over if @player.dead?
  end

  def game_over
    Gosu::Window.open(800, 600, resizable: false) do
      font = Gosu::Font.new(64)
      font.draw_text("Game Over", 250, 250, 1, 1, 1, Gosu::Color::WHITE)
      font.draw_text("Your final score: #{@score}", 150, 350, 1, 1, 1, Gosu::Color::WHITE)
    end
    close
  end
end

class GameObject
  attr_reader :x, :y, :width, :height

  def initialize(x, y, width, height, image_file)
    @x, @y, @width, @height = x, y, width, height
    @image = Gosu::Image.new(image_file)
  end

  def move(velocity)
    @x += velocity
  end

  def draw
    @image.draw(@x, @y, 1)
  end

  def right
    @x + @width
  end
end

class Player < GameObject
  def initialize
    super(50, 500, 50, 50, "player.png")
    @vel_y, @jump_power, @gravity, @health = 0, 20, 1, 3
    @walking_frames = Gosu::Image.load_tiles("walking_animation.png", 50, 50)
    @current_frame = 0
    @frame_delay = 5
    @frame_counter = 0
  end

  def update
    @y += @vel_y
    @vel_y += @gravity

    die if @y > 1080
    respawn if dead?

    @frame_counter += 1
    if @frame_counter % @frame_delay == 0
      @current_frame = (@current_frame + 1) % @walking_frames.size
    end
  end

  def draw
    @walking_frames[@current_frame].draw(@x, @y, 1)
  end

  def die
    @health = 0
    @score = 0
  end

  def move_left
    @x -= 5 if @x > 0
  end

  def move_right
    @x += 5 if @x < 1920 - @width
  end

  def jump
    @vel_y = -@jump_power if @y >= 500
  end

  def land(land_height)
    @y, @vel_y = land_height - @height, 0
  end

  def hit
    @health -= 1
    respawn if @health <= 0
  end

  def intersects?(other_object)
    @x < other_object.right && @x + @width > other_object.x &&
      @y < other_object.y + other_object.height && @y + @height > other_object.y
  end

  def respawn
    @x, @y, @vel_y, @health, @speed, @score = 50, 500, 0, 3, 5, 0
  end

  def dead?
    @health <= 0
  end
end


class Platform < GameObject
  def initialize(x, y, gap_size)
    super(x, y - gap_size, 300, gap_size * 2, "platform.png")
  end

  def top
    @y
  end
end

class Bomb < GameObject
  def initialize(x, y)
    super(x, y, 30, 30, "bomb.png")
  end
end

class Enemy < GameObject
  def initialize(x, y)
    super(x, y, 50, 50, "enemy.png")
    @vel_y = rand(-10..10)
  end

  def move(velocity)
    super(velocity)
    @y += @vel_y
    @vel_y *= -1 if @y <= 0 || @y >= 1080 - @height
  end
end

GameWindow.new.show