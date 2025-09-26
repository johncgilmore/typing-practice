# Beginner Mode Gamification Review

## Research snapshot: lessons from leading gamified learning tools
Modern learning apps such as Duolingo, TypingClub, and CodeCombat pair tightly scoped practice loops with persistent motivators. They scaffold difficulty in micro-steps, celebrate wins with streaks or XP, surface visible progress paths, and frame learning around quests or characters that keep beginners emotionally engaged even when drills are repetitive. Each session starts with clarity about the goal, shows mastery growth in real time, and rewards consistency over raw speed.

## Current beginner mode overview
The current beginner mode randomly surfaces one of the unlocked home-row keys for players to press, drawing targets from `beginnerKeySets` that expand every ten correct presses (levels 1–4).【F:script.js†L233-L271】【F:script.js†L432-L466】【F:script.js†L635-L640】 Players have 60 seconds to collect points, gain ten points per correct key scaled by level, and see a progress bar that fills within each ten-key cycle before resetting.【F:script.js†L158-L188】【F:script.js†L378-L466】 Feedback consists of a celebratory or corrective toast, color changes on the on-screen keyboard, and occasional particle and sound effects.【F:script.js†L387-L418】【F:script.js†L508-L542】 Scores and accuracy are saved to a local leaderboard after each run, but progression beyond the session is not stored.【F:script.js†L485-L797】 

## Ideal beginner experience
Based on the reference products, the beginner path should feel like a guided tutorial arc with explicit phases (e.g., "Ring 1: DFJK"), short missions, and persistent recognition. Players should always know what they are unlocking next, why they are practicing the current subset, and how today’s effort advances them toward a badge or storyline milestone. The loop should emphasize accuracy first, then controlled speed, and it should offer gentle recovery options (e.g., hearts/lives) instead of a strict countdown only. Narratives, streaks, and bite-sized quests can frame the drills as achievements rather than raw repetition.

## Gap analysis
Right now the expansion of allowed keys happens invisibly; the UI never tells the player which set they are in or what comes next, so the sense of mastery by stages is missing despite the `beginnerKeySets` structure.【F:script.js†L233-L271】【F:script.js†L635-L640】 Leveling only increases score multipliers and resets the ten-key progress bar, but there is no badge, streak, or mission summary to convert the moment into a meaningful milestone.【F:script.js†L378-L466】 The 60-second timer pushes urgency over technique, contrasting with leading apps that let beginners drill until they feel ready before timing challenges.【F:script.js†L158-L188】 Finally, the leaderboard provides long-term comparison but not personal progression, so new typists lack a reason to return daily beyond chasing a higher score.【F:script.js†L485-L807】

## Five fast wins for stronger gamification
Introduce a visible "Key Ring" tracker beside the target letter that shows the current key set and highlights the next key unlock, so each level-up feels like collecting a new piece of equipment rather than an invisible difficulty bump. This only requires reading `getBeginnerKeysForLevel` and updating the DOM when `checkLevelUp` fires.【F:script.js†L432-L466】【F:script.js†L635-L640】

Add a streak counter that increments when the player finishes a round with at least 80% accuracy and stores it in `localStorage`, granting a small bonus time boost at the start of future runs. This mirrors Duolingo’s daily streak hook while reusing the existing storage helpers around `saveScore`.【F:script.js†L485-L807】

Swap the single 60-second countdown for three "hearts" that are lost on incorrect keys; when hearts remain, the timer pauses for a short breathing animation. Reusing `handleIncorrectKey` to decrement hearts emphasizes accuracy-first practice before the timer pressure returns.【F:script.js†L264-L418】

Surface micro-missions such as "Hit 5 perfect keys in a row" or "Clear Ring 2 without misses" using the existing `correctCount` and `beginnerPitchStep`, rewarding completion with particle bursts and bonus score multipliers. This leans on state that is already tracked each key press.【F:script.js†L378-L418】

After each session, append a personal progression card to the leaderboard modal summarizing best level reached, keys unlocked, and current streak to give returning players a reason to replay tomorrow. The modal infrastructure is already in place via `openDashboard` and `renderBoards`, so the card can be rendered conditionally without structural changes.【F:script.js†L705-L807】
