class TheGame
  class Map
    attr_accessor :grid
    attr_reader :events

    def initialize(grid)
      @grid = grid
      @events = []
    end

    def fetch(width, height)
      tile = @grid[width] && @grid[width][height]
      yield(tile) if block_given?
      tile
    end

    def find_closest_to(person)
      closest = find {|tile| yield(tile) }

      if closest
        each_tile do |tile|
          if yield(tile)
            if person.distance_to(tile) < person.distance_to(closest)
              closest = tile
            end
          end
        end
      end

      closest
    end

    def create_building_event(building)
      @events << Event.new(:building_created, building.x, building.y, building: building)
    end

    def update
      each_tile do |tile|
        event_or_nil = tile.update
        @events << event_or_nil unless event_or_nil.nil?
      end
    end

    def width
      @grid.first.length
    end

    def height
      @grid.length
    end

    def each_tile
      @grid.each do |row|
        row.each do |tile|
          yield(tile)
        end
      end
    end

    private

    def find
      each_tile do |tile|
        if yield(tile)
          return tile
        end
      end
      return nil
    end

  end
end
