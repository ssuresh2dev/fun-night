# Fun Night

Fun Night is an extension to the popular card game, One Night Ultimate Werewolf (https://en.wikipedia.org/wiki/Ultimate_Werewolf#One_Night_Ultimate_Werewolf).

It features *nine* never-seen-before roles than can be used along with the original One Night Ultimate Werewolf roles to create a unique gameplay experience for you and your loved ones.

## New Roles
- **Agent Of Chaos**: Switches cards with another player *P* and takes their role. The player that ends up with the Agent of Chaos card is on the opposite team from that which player *P* started out on.
- **Boy Nextdoor**: Plays for themselves. Wins if player to the left or right dies.
- **Devil's Advocate**: On the Village team. Knows all of the werewolves, but loses if voted against by all of them.
- **Dog Whisperer**: On the Village team. Knows one werewolf, but dies if that werewolf is killed. Is a werewolf if only one or no others.
- **Inexplicable**: On the Village team. Flips a coin, and if heads, becomes any of most other roles and performs their action.
- **Nutjob**: On the Village team. Can make a random guess of all werewolves before voting, but must reveal their card first. Correct guess wins automatically.
- **Podcaster**: On the Village team. Can privately inspect any other player's card during the day, but with strict majority approval only.
- **Rationalist**: On the Village team. Inspects a single other player's card after every possible role-switch, except the Inexplicable.
- **Stoner**: On the Village team. Shuffles two other player's cards, then inspects only one before placing back.

## Develop
- From the project directory, execute `npm run watch`
- In a new Terminal window, from the project directory:
  - run `heroku local` if you have a Heroku account, or
  - run `python3 run.py` if you don't have a Heroku account
- Go to `localhost:5000` in your browser to view and/or test the application in development.