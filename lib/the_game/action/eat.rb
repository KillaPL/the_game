class TheGame
  class Action
    class Eat < Action
      def initialize(food)
        @food = food
        @minutes_spent_eating_left = @food.minutes_to_eat
      end

      def description
        "eating #{@food.type}"
      end

      def perform(person, map, time_in_minutes)
        @minutes_spent_eating_left -= time_in_minutes
        person.hunger += @food.hunger_per_minute_added * time_in_minutes

        if @minutes_spent_eating_left == 0
          person.do_stuff
        end
      end
    end
  end
end
