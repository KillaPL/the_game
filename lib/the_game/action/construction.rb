class TheGame
  class Action
    class Construction < Action
      def self.create(building)
        GoTo.create(building).then(new(building))
      end

      def initialize(building)
        @building = building
      end

      def type
        :building
      end

      def description
        "building #{@building.description}"
      end

      def done?(person)
        @building.minutes_left == 0
      end

      def perform(person, map, time_in_minutes)
        @building.minutes_left -= time_in_minutes

        if @building.minutes_left == 0
          @building.status = :done
        end
      end
    end
  end
end
