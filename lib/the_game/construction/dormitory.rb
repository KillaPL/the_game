class TheGame
  class Construction
    class Dormitory
      include HasPosition

      attr_reader :firewood_needed
      attr_accessor :minutes_left, :status, :fields

      def initialize(x, y)
        @x = x
        @y = y
        @status = :cleaning
        @firewood_needed = 60
      end

      def type
        :dormitory
      end

      def description
        if @status == :plan or @status == :building
          "Dormitory construction"
        else
          "Dormitory"
        end
      end

      def terrain_clear?
        fields.all?(&:empty?)
      end

      def can_start_building?
        terrain_clear? and @status == :cleaning
      end

      def start_building!
        @status = :plan
      end

      def tile_for_cleaning(job_type)
        if job_type == :gatherer
          fields.find do |tile|
            tile.content.is_a? Nature::BerriesBush
          end
        elsif job_type == :woodcutting
          fields.find do |tile|
            tile.content.is_a? Nature::Tree
          end
        elsif job_type == :haul
          fields.find do |tile|
            tile.content.is_a? Nature::LogPile
          end
        end
      end

      def needs_cleaning?(job_type)
        if job_type == :gatherer
          fields.any? do |tile|
            tile.content.is_a? Nature::BerriesBush
          end
        elsif job_type == :woodcutting
          fields.any? do |tile|
            tile.content.is_a? Nature::Tree
          end
        elsif job_type == :haul
          fields.any? do |tile|
            tile.content.is_a? Nature::LogPile
          end
        end
      end

      def need_wood?
        @firewood_needed > 0
      end

      def need?(item_type)
        if item_type == :firewood
          need_wood?
        end
      end

      def sleep_area
        if @status == :done
          # inside the shack
          position(x+1, y+2, self)
        else
          nil
        end
      end

      def ready_to_build?
        @firewood_needed == 0 and @status == :building
      end

      def add(item)
        if item.type == :firewood
          @firewood_needed -= 1
          if @firewood_needed == 0
            @status = :building
            @minutes_left = 120
          end
        end
      end

      def energy_per_minute_when_sleeping
        # this will be ok for a sleep in sort-of-good conditions
        # 3 * 0.00104167

        # sleeping on floor is way less refreshing
        2.6 * 0.00104167
      end

      def tiles_coords
        [
          [0, 0], [0, 1], [0, 2], [0, 3],
          [1, 0], [1, 1], [1, 2], [1, 3],
          [2, 0], [2, 1], [2, 2], [2, 3],
          [3, 0], [3, 1], [3, 2], [3, 3],
        ]
      end
    end
  end
end
