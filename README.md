# Sideline Subs

Substitution timer for youth soccer (built for U10 7v7, 22-minute halves). It buzzes your phone and watch when a sub is due, picks who comes off and who goes on so everyone gets about the same time, and keeps tournament totals so game 2 starts with the kids who played least.

No server, no account. Everything is saved on the phone. After the first load it works with no signal.

## Put it on your phone

The app is five static files in this repo. It is hosted with GitHub Pages: Settings → Pages → Deploy from branch → `main` / `(root)` → Save. After a minute or two the site is at `https://<your-username>.github.io/soccer-subs/`.

On the Pixel: open that address in Chrome, menu → **Install app** (or Add to Home screen). Open it once with signal so it caches. Then in the app, tap **Enable notifications**, and **Test alert**.

To update: change the files on `main`. The installed app picks up the new version the next time you open it with signal.

## Game day

1. Roster: add names, untick anyone who is absent.
2. Pick the formation (2-3-1 by default). The starting lineup is a pitch: tap a spot (GK, LD, RD, LM, CM, RM, ST) to choose who starts there, switch two starters, or take someone out. Kids not starting are listed below the pitch; tap one to give them a spot. If you want goalies to take turns, tap those kids under Goalies. The kid you put in the GK spot starts in goal and the others follow in the order you tapped. Tap **Auto-fill lineup** to start over with the least-played kids. Then tap **Go to game screen**.
3. The pitch shows who is in each position (GK, LD, RD, LM, CM, RM, ST). Before kickoff, tap a player to swap them with the bench or switch positions with another player. These happen right away. Tap **Kick off** at the whistle (or **Kick off** on the watch notification).
4. To sub, tap the player who is coming off, then tap the bench player who goes on. Bench kids are listed least played first and the top one is marked Suggested. Do this for as many kids as you want (1, 2, 3 or more). Each pair goes into the box at the bottom, "Waiting at the half line". Nothing changes yet: play time keeps counting for the kid on the field.
5. When the ref waves them on, tap **On** next to that pair (or **All on now**). That moment is when the outgoing kid's clock stops and the incoming kid's clock starts. On the watch, the **Subs on** button does the same for everything in the box.
6. At each sub time the phone buzzes 30 seconds ahead and again at the time, and the box fills itself with suggested swaps. Change any of them by tapping a player, or tap the X to drop one.
7. **Who is due** (under the bench) lists the most-played kids on the field paired with the least-played on the bench. Tap **Queue** to use one. A dot on each player shows orange for more than the team average and blue for less.
8. At 22:00 it alerts you. Tap **End 1st half**. The second-half lineup is already set (and positions carry over); adjust if you like and tap **Start 2nd half**.
9. After the game you get minutes per player. **Set up next game** keeps tournament totals.

Tap any player for more: switch positions, make them goalie, or mark them hurt (they leave when their replacement goes on and are left out of suggestions). **Undo last change** reverses the last sub. **Lock** makes the screen ignore touches (press and hold to unlock) so it can live in a pocket.

## How subs are chosen

Whoever has played the least comes on, whoever has played the most goes off. Ties go to the kid who has waited longest. Goalies rotate in the order you tapped them, at evenly spaced sub windows (two goalies swap at halftime, three swap about every 15 minutes). The box at the bottom tells you when the goalie changes and brings the new keeper on if they are on the bench. The kid in goal is never taken off except by a goalie change. "Kids swapped each time: Auto" simulates the whole game and picks the count with the smallest gap between most and least played. Setup shows the expected gap and suggests a different number of windows if that would be fairer. With no goalie tracked, the gap is never more than one sub window.

## Watch

The watch cannot run the app. It shows the phone's notifications, including the buttons **Kick off**, **Subs on** and **End half**. Tapping one on the watch tells the app, with the time of the tap.

Things to know:

- Keep the app open with the screen on. It asks the phone to stay awake while a game is running. If you press the power button, the clock stays accurate but alerts wait until you open the app again.
- Run **Test alert** at home with the watch on. If the watch does not buzz, check that notifications from Chrome (or the installed app) are allowed on the watch in the Pixel Watch app.
- Vibration and sound work only after you have tapped something in the app since it opened.
