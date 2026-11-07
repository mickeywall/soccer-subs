# Sideline Subs

Substitution timer for youth soccer (built for U10 7v7, 22-minute halves). It buzzes your phone and watch when a sub is due, picks who comes off and who goes on so everyone gets about the same time, and keeps tournament totals so game 2 starts with the kids who played least.

No server of its own and no account. Everything is saved on the phone, and after the first load it works with no signal. Live sharing with parents (below) is optional and off until you start it.

## Put it on your phone

The app is a handful of static files in this repo (`index.html`, `watch.html`, `share.js`, `sw.js`, the manifest and two icons). It is hosted with GitHub Pages: Settings → Pages → Deploy from branch → `main` / `(root)` → Save. After a minute or two the site is at `https://<your-username>.github.io/soccer-subs/`.

On the Pixel: open that address in Chrome, menu → **Install app** (or Add to Home screen). Open it once with signal so it caches. Then in the app, tap **Enable notifications**, and **Test alert**.

To update: change the files on `main`. The installed app picks up the new version the next time you open it with signal.

## Game day

1. Roster: add names, untick anyone who is absent.
2. Pick the formation (2-3-1 by default). The starting lineup is a pitch: tap a spot (GK, LB, RB, LM, CM, RM, ST) to choose who starts there, switch two starters, or take someone out. Kids not starting are listed below the pitch; tap one to give them a spot. If you want goalies to take turns, tap those kids under Goalies. The kid you put in the GK spot starts in goal and the others follow in the order you tapped. Tap **Auto-fill lineup** to start over with the least-played kids. Then tap **Go to game screen**.
3. The pitch shows who is in each position (GK, LB, RB, LM, CM, RM, ST). Before kickoff, tap a player to swap them with the bench or switch positions with another player. These happen right away. Tap **Kick off** at the whistle (or **Kick off** on the watch notification).
4. To sub, tap the player who is coming off, then tap the bench player who goes on. Bench kids are listed least played first and the top one is marked Suggested. Do this for as many kids as you want (1, 2, 3 or more). Each pair goes into the box at the bottom, shown with a red ▼ by the kid coming off and a green ▲ by the kid going on, "Waiting at the half line". Nothing changes yet: play time keeps counting for the kid on the field.
5. When the ref waves them on, tap **On** next to that pair (or **All on now**). That moment is when the outgoing kid's clock stops and the incoming kid's clock starts. On the watch, the **Subs on** button does the same for everything in the box.
6. At each sub time the phone buzzes 30 seconds ahead and again at the time, and the box fills itself with suggested swaps. Change any of them by tapping a player, or tap the X to drop one.
7. **Who is due** (under the bench) lists the most-played kids on the field paired with the least-played on the bench. Tap **Queue** to use one. A dot on each player shows orange for more than the team average and blue for less.
8. At 22:00 it buzzes and beeps, but the clock keeps running so stoppage time is counted (the bar says how far over you are, for example +0:45). Pause and **End half** sit side by side at the top; tap **End half** twice when the ref blows the whistle. The second-half lineup is already set (and positions carry over); adjust if you like and tap **Start 2nd half**. In the 2nd half the same button reads **End game**.
9. After the game you get minutes per player. **Set up next game** keeps tournament totals.

**Score and cards.** The score bar under the clock has **We scored** (pick who scored) and **Them +1**, and **Undo last goal** fixes a mistake. You can also tap a player and choose **Scored a goal**, **Yellow card** or **Red card**. A goal shows a ball and the minute next to the name, for example ⚽ 12′ (a 2nd-half goal at 3:10 reads 26′, and stoppage time reads 22+1′). Yellow cards show 🟨 and red cards 🟥. **A red card sends the kid off.** After you confirm, they leave the field at once, their clock stops, and nobody replaces them, so you play a man down for the rest of the game. Their position stays on the pitch as an empty "Man down" spot, a red **1 DOWN** tag shows in the clock bar, and they are never suggested to come back on. Normal subs still work one for one but the bench cannot refill the empty spot. To cover it, tap the empty spot and move a player across (their old spot becomes the empty one). If the goalie is sent off, the GK spot is empty until you move someone into goal. If you took the card back by mistake, tap the kid on the bench and choose Remove, and they return to their old position. A card for a kid already on the bench keeps them out but does not cost you a player. The full-time screen lists the final score, scorers and cards, and the results of each game are kept for the tournament. To remove a goal or card, tap the player and choose Remove.

**Game log.** The log under the bench is one timeline, newest first, of subs (▼ off, ▲ on), goals with the running score, and yellow and red cards, each with the game minute. Halftime subs show as HT. The full-time screen shows the same log. The notification text uses the same ▼ and ▲.

Tap any player for more: switch positions, make them goalie, or mark them hurt (they leave when their replacement goes on and are left out of suggestions). **Undo last change** reverses the last sub. **Lock** makes the screen ignore touches (press and hold to unlock) so it can live in a pocket.

## How subs are chosen

Whoever has played the least comes on, whoever has played the most goes off. Ties go to the kid who has waited longest. Goalies rotate in the order you tapped them, at evenly spaced sub windows (two goalies swap at halftime, three swap about every 15 minutes). The box at the bottom tells you when the goalie changes and brings the new keeper on if they are on the bench. The kid in goal is never taken off except by a goalie change. "Kids swapped each time: Auto" simulates the whole game and picks the count with the smallest gap between most and least played. Setup shows the expected gap and suggests a different number of windows if that would be fairer. With no goalie tracked, the gap is never more than one sub window.

## Watch

The watch cannot run the app. It shows the phone's notifications, including the buttons **Kick off**, **Subs on** and **End half**. Tapping one on the watch tells the app, with the time of the tap.

Things to know:

- Keep the app open with the screen on. It asks the phone to stay awake while a game is running. If you press the power button, the clock stays accurate but alerts wait until you open the app again.
- Run **Test alert** at home with the watch on. If the watch does not buzz, check that notifications from Chrome (or the installed app) are allowed on the watch in the Pixel Watch app.
- Vibration and sound work only after you have tapped something in the app since it opened.

## Live sharing

Parents can follow a game on their own phones, and one trusted person can send you score suggestions. You decide whether to use it.

**Set it up.** On the setup screen, open **Live sharing**, optionally type your team name and the opponent, and tap **Start sharing**. You get two links:

- **Watch link** (for parents). Read only. Shows the clock, score, who is playing where, the bench, and goals and cards. It does not show minutes played or sub suggestions.
- **Scorer link** (for one trusted person). Same view plus **We scored** and **They scored** buttons. Their taps arrive on your phone as **Score suggestions** with the minute they saw. Nothing changes until you tap **Accept**, and **Reject** drops it.

Send the links with **Share…** or **Copy**. The same links work for every game that day. **Make new links** replaces both (the old ones stop working) and **Stop sharing** tells watchers sharing has ended. During a game, the **Share live** button next to Undo shows the status.

**Who can change what.** Only your phone creates the game. Subs, lineups, positions and cards can never be changed from a link. Watch pages verify every update against a key that only your phone holds, and ignore anything else. A scorer link can only send score suggestions, and your phone ignores any suggestion that was not made with the scorer key.

**Privacy.** Updates are encrypted on your phone and then sent through a free public message relay (ntfy.sh by default). The relay only sees scrambled text. The keys live in the part of the link after the `#`, which browsers do not send to any server. Player names are sent exactly as you typed them in the roster, so use first names or initials if you prefer. Anyone who has a link can watch, so only send it to people you trust.

**Bad signal.** The app works as normal without a connection and tells you when the relay cannot be reached. It sends again when the connection returns. Watchers' clocks run on their own between updates, so very little is sent (roughly 60 messages in a game). The free relay limits how many messages one phone can send in a day; if it is limiting you the app says so, and the game itself is never affected. You can point the app at your own ntfy server under **Relay server** before you start sharing.
