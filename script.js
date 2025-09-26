// Home Row Typing Game - JavaScript Logic
// This file contains all the game mechanics, scoring, and interactive features

class TypingGame {
    constructor() {
        // Game state
        this.isPlaying = false;
        this.score = 0;
        this.level = 1;
        this.timeLeft = 60;
        this.correctCount = 0;
        this.totalCount = 0;
        this.currentTarget = '';
        this.gameTimer = null;
        this.letterTimer = null;
        this.mode = 'beginner';
        this.wordsCompleted = 0;
        this.gameStartTime = null;
        this.typedWordBuffer = '';
        this.sentenceText = '';
        this.sentenceWords = [];
        this.currentWordIndex = 0;
        this.beginnerPitchStep = 0;
        this.memeGifUrls = [
            'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
            'https://media.giphy.com/media/3orieYJw7v8K2S1O76/giphy.gif',
            'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
            'https://media.giphy.com/media/26n6WywJyh39n1pBu/giphy.gif',
            'https://media.giphy.com/media/3o7aCPg2n4k5p0Z2Fq/giphy.gif'
        ];
        
        // Home row keys (the keys we want players to practice)
        this.homeRowKeys = ['a', 's', 'd', 'f', ' ', 'j', 'k', 'l', ';'];
        this.beginnerKeySets = {
            1: ['d', 'f', ' ', 'j', 'k'],
            2: ['d', 'f', ' ', 'j', 'k', 's', 'l'],
            3: ['d', 'f', ' ', 'j', 'k', 's', 'l', 'a', ';'],
            4: ['a', 's', 'd', 'f', ' ', 'j', 'k', 'l', ';']
        };

        // Word bank for advanced mode (short to longer words)
        // Word pools for sentence generation (tiered complexity)
        this.wordPools = {
            nounsSimple: ['cat','dog','kid','sun','rain','wind','bird','rock','tree','fish','hand','day','night','game','time','code'],
            nounsCommon: ['student','runner','artist','teacher','friend','family','planet','ocean','forest','river','garden','market','city','leader','writer','player'],
            nounsAdvanced: ['galaxy','rhythm','energy','motion','concept','pattern','system','keyboard','network','harmony','strategy','memory','journey','practice','mastery','curiosity'],
            verbsSimple: ['run','jump','play','walk','read','write','sing','smile','learn','move','code','type','help','build','think','look'],
            verbsCommon: ['explore','create','discover','imagine','improve','collect','analyze','balance','connect','measure','arrange','design'],
            verbsAdvanced: ['synchronize','orchestrate','illuminate','accelerate','contemplate','articulate','coordinate','evaluate','transform','visualize'],
            adjsSimple: ['small','big','red','blue','fast','slow','happy','bright','kind','calm','brave','quick'],
            adjsCommon: ['curious','clever','friendly','gentle','quiet','bold','creative','steady','nimble','proud','patient'],
            adjsAdvanced: ['brilliant','elegant','intricate','dynamic','resilient','vivid','harmonic','strategic','mystic','luminous'],
            adverbsSimple: ['quickly','slowly','quietly','boldly','softly','calmly','nicely','well','truly'],
            adverbsCommon: ['carefully','easily','brightly','smoothly','gently','bravely','openly','deeply','clearly'],
            adverbsAdvanced: ['efficiently','precisely','gracefully','deliberately','intensely','seamlessly','cohesively','meticulously'],
            places: ['home','school','park','forest','city','river','ocean','garden','market','library','studio','kitchen'],
            preps: ['in','on','under','near','around','through','across','beyond','inside','between'],
            times: ['today','tonight','this morning','this afternoon','at dawn','at dusk','each day','every week']
        };
        
        // DOM elements
        this.elements = {
            startBtn: document.getElementById('startBtn'),
            restartBtn: document.getElementById('restartBtn'),
            openDashboardBtn: document.getElementById('openDashboardBtn'),
            viewLeaderboardBtn: document.getElementById('viewLeaderboardBtn'),
            instructions: document.getElementById('instructions'),
            gameScreen: document.getElementById('gameScreen'),
            gameOver: document.getElementById('gameOver'),
            targetLetter: document.getElementById('targetLetter'),
            score: document.getElementById('score'),
            level: document.getElementById('level'),
            timer: document.getElementById('timer'),
            progressFill: document.getElementById('progressFill'),
            feedback: document.getElementById('feedback'),
            finalScore: document.getElementById('finalScore'),
            finalLevel: document.getElementById('finalLevel'),
            accuracy: document.getElementById('accuracy'),
            wpm: document.getElementById('wpm'),
            wpmStat: document.getElementById('wpmStat'),
            finalWpm: document.getElementById('finalWpm'),
            finalWpmStat: document.getElementById('finalWpmStat'),
            modeBeginner: document.getElementById('modeBeginner'),
            modeMedium: document.getElementById('modeMedium'),
            modeAdvanced: document.getElementById('modeAdvanced'),
            // Modals
            nameModal: document.getElementById('nameModal'),
            playerNameInput: document.getElementById('playerNameInput'),
            saveNameBtn: document.getElementById('saveNameBtn'),
            cancelNameBtn: document.getElementById('cancelNameBtn'),
            closeNameModal: document.getElementById('closeNameModal'),
            dashboardModal: document.getElementById('dashboardModal'),
            closeDashboard: document.getElementById('closeDashboard'),
            tabBeginner: document.getElementById('tabBeginner'),
            tabAdvanced: document.getElementById('tabAdvanced'),
            beginnerBoardBody: document.getElementById('beginnerBoardBody'),
            advancedBoardBody: document.getElementById('advancedBoardBody'),
            changeNameBtn: document.getElementById('changeNameBtn'),
            // Confirm name modal
            confirmNameModal: document.getElementById('confirmNameModal'),
            closeConfirmName: document.getElementById('closeConfirmName'),
            confirmNameProceedBtn: document.getElementById('confirmNameProceedBtn'),
            confirmNameNewPlayerBtn: document.getElementById('confirmNameNewPlayerBtn')
        };
        
        // Initialize the game
        this.init();
    }
    
    init() {
        // Set up event listeners
        this.elements.startBtn.addEventListener('click', () => this.handleStartClicked());
        this.elements.restartBtn.addEventListener('click', () => this.restartGame());
        if (this.elements.openDashboardBtn) this.elements.openDashboardBtn.addEventListener('click', () => this.openDashboard());
        if (this.elements.viewLeaderboardBtn) this.elements.viewLeaderboardBtn.addEventListener('click', () => this.openDashboard());
        
        if (this.elements.modeBeginner && this.elements.modeAdvanced) {
            this.elements.modeBeginner.addEventListener('change', () => this.setMode('beginner'));
            if (this.elements.modeMedium) this.elements.modeMedium.addEventListener('change', () => this.setMode('medium'));
            this.elements.modeAdvanced.addEventListener('change', () => this.setMode('advanced'));
        }
        
        // Listen for keyboard input
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Initialize keyboard visual feedback
        this.initKeyboardVisual();
        this.ensurePlayerName();
        
        console.log('🎮 Typing Game initialized! Ready to play.');
    }

    handleStartClicked() {
        const stored = localStorage.getItem('hrtm_player_name');
        if (stored && stored.trim().length > 0) {
            this.openConfirmNameModal(stored.trim());
        } else {
            this.openNameModal(() => this.startGame());
        }
    }

    setMode(mode) {
        this.mode = mode;
        // Toggle WPM visibility (Medium and Advanced show WPM)
        if (this.elements.wpmStat) {
            this.elements.wpmStat.style.display = (this.mode === 'advanced' || this.mode === 'medium') ? 'flex' : 'none';
        }
        // Reset target display style
        if (this.mode === 'advanced' || this.mode === 'medium') {
            this.elements.targetLetter.classList.remove('target-letter');
            this.elements.targetLetter.classList.add('target-word');
        } else {
            this.elements.targetLetter.classList.remove('target-word');
            this.elements.targetLetter.classList.add('target-letter');
        }
    }
    
    startGame() {
        console.log('🚀 Starting new game...');
        
        // Reset game state
        this.isPlaying = true;
        this.score = 0;
        this.level = 1;
        this.timeLeft = (this.mode === 'advanced') ? 10 : (this.mode === 'medium' ? 20 : 60);
        this.correctCount = 0;
        this.totalCount = 0;
        this.wordsCompleted = 0;
        this.sentencesCompleted = 0;
        this.typedWordBuffer = '';
        this.gameStartTime = Date.now();
        this.sentenceText = '';
        this.sentenceWords = [];
        this.currentWordIndex = 0;
        this.beginnerPitchStep = 0;
        // Ensure any prior low-time classes are cleared
        document.body.classList.remove('time-warning', 'time-danger', 'time-flash');
        this.pendingTimeBonus = 0; // advanced: accumulate per word, grant on level-up
        
        // Update UI
        this.updateUI();
        this.showGameScreen();
        this.generateNewTarget();
        this.startTimers();
        
        // Play start sound
        this.playSound('start');
    }
    
    restartGame() {
        console.log('🔄 Restarting game...');
        this.showInstructions();
        this.resetKeyboardVisual();
    }
    
    showInstructions() {
        this.elements.instructions.style.display = 'block';
        this.elements.gameScreen.style.display = 'none';
        this.elements.gameOver.style.display = 'none';
    }
    
    showGameScreen() {
        this.elements.instructions.style.display = 'none';
        this.elements.gameScreen.style.display = 'block';
        this.elements.gameOver.style.display = 'none';
    }
    
    showGameOver() {
        this.elements.instructions.style.display = 'none';
        this.elements.gameScreen.style.display = 'none';
        this.elements.gameOver.style.display = 'block';
        
        // Calculate and display final stats
        const accuracy = this.totalCount > 0 ? Math.round((this.correctCount / this.totalCount) * 100) : 100;
        this.elements.finalScore.textContent = this.score;
        this.elements.finalLevel.textContent = this.level;
        this.elements.accuracy.textContent = accuracy + '%';
        if (this.mode === 'advanced') {
            const minutes = Math.max(1/60, (Date.now() - this.gameStartTime) / 60000);
            const wpm = Math.round(this.wordsCompleted / minutes);
            if (this.elements.finalWpm && this.elements.finalWpmStat) {
                this.elements.finalWpm.textContent = wpm;
                this.elements.finalWpmStat.style.display = 'flex';
            }
        } else {
            if (this.elements.finalWpmStat) this.elements.finalWpmStat.style.display = 'none';
        }
        
        // Play game over sound
        this.playSound('gameOver');
    }
    
    generateNewTarget() {
        if (this.mode === 'beginner') {
            const allowed = this.getBeginnerKeysForLevel(this.level);
            const randomIndex = Math.floor(Math.random() * allowed.length);
            this.currentTarget = allowed[randomIndex];

            // Update the display, show SPACE as word
            const displayText = this.currentTarget === ' ' ? 'SPACE' : this.currentTarget.toUpperCase();
            this.elements.targetLetter.textContent = displayText;

            // Visual flair
            this.elements.targetLetter.style.animation = 'none';
            setTimeout(() => {
                this.elements.targetLetter.style.animation = 'pulse 2s infinite';
            }, 10);
            console.log(`🎯 New target: ${displayText}`);
        } else {
            // Advanced/Medium mode: ensure sentence exists and set current word
            if (!this.sentenceWords || this.currentWordIndex >= this.sentenceWords.length) {
                this.startAdvancedSentence(this.level);
            } else {
                this.currentTarget = this.sentenceWords[this.currentWordIndex];
                this.updateAdvancedTargetDisplay();
            }
        }
    }
    
    handleKeyPress(event) {
        if (!this.isPlaying) return;
        const pressedKey = event.key.toLowerCase();

        if (this.mode === 'beginner') {
            this.totalCount++;
            if (pressedKey === this.currentTarget) {
                this.handleCorrectKey();
            } else {
                this.handleIncorrectKey();
            }
            this.updateKeyboardVisual(pressedKey, pressedKey === this.currentTarget);
        } else {
            // Advanced/Medium mode: word typing
            // Prevent default space scroll behavior
            if (pressedKey === ' ') event.preventDefault();

            // Handle backspace
            if (event.key === 'Backspace' || pressedKey === 'backspace') {
                this.typedWordBuffer = this.typedWordBuffer.slice(0, -1);
                this.updateAdvancedTargetDisplay();
                return;
            }

            // Word submission on space
            if (pressedKey === ' ') {
                if (this.typedWordBuffer.length > 0) {
                    if (this.normalizeWord(this.typedWordBuffer) === this.normalizeWord(this.currentTarget)) {
                        this.wordsCompleted++;
                        const wordPoints = (this.mode === 'medium') ? 2 : 1;
                        this.score += wordPoints * this.level * (5 + this.currentTarget.length);
                        if (this.mode === 'advanced') this.accrueAdvancedWordTime();
                        this.showFeedback('✅ Word!', 'correct');
                        this.playSound('word');
                        this.currentWordIndex++;
                        this.typedWordBuffer = '';
                        if (this.currentWordIndex >= this.sentenceWords.length) {
                            // Sentence complete
                            this.score += 10 * this.level;
                            this.showFeedback('🎉 Sentence complete!', 'correct');
                            this.sentencesCompleted++;
                            this.checkAdvancedLevelUp();
                            this.startAdvancedSentence(this.level);
                        } else {
                            this.currentTarget = this.sentenceWords[this.currentWordIndex];
                            this.updateAdvancedTargetDisplay();
                        }
                        this.updateUI();
                    } else {
                        this.showFeedback('❌ Wrong word', 'incorrect');
                        this.playSound('incorrect');
                        // Keep the same word; reset buffer
                        this.typedWordBuffer = '';
                        this.updateAdvancedTargetDisplay();
                    }
                }
                return;
            }

            // Word submission on comma (helps when sentence includes commas)
            if (pressedKey === ',') {
                if (this.typedWordBuffer.length > 0 && this.normalizeWord(this.typedWordBuffer) === this.normalizeWord(this.currentTarget)) {
                    this.wordsCompleted++;
                    const wordPoints2 = (this.mode === 'medium') ? 2 : 1;
                    this.score += wordPoints2 * this.level * (5 + this.currentTarget.length);
                    if (this.mode === 'advanced') this.accrueAdvancedWordTime();
                    this.showFeedback('✅ Word!', 'correct');
                    this.playSound('word');
                    this.currentWordIndex++;
                    this.typedWordBuffer = '';
                    if (this.currentWordIndex >= this.sentenceWords.length) {
                        this.score += 10 * this.level;
                        this.showFeedback('🎉 Sentence complete!', 'correct');
                        this.sentencesCompleted++;
                        this.checkAdvancedLevelUp();
                        this.startAdvancedSentence(this.level);
                    } else {
                        this.currentTarget = this.sentenceWords[this.currentWordIndex];
                        this.updateAdvancedTargetDisplay();
                    }
                    this.updateUI();
                }
                return;
            }

            // Accept letters only (a-z)
            if (/^[a-z]$/.test(pressedKey)) {
                this.typedWordBuffer += pressedKey;
                this.updateAdvancedTargetDisplay();
                // Auto-complete sentence on last word without requiring space
                if (this.normalizeWord(this.typedWordBuffer) === this.normalizeWord(this.currentTarget)) {
                    const isLastWord = (this.currentWordIndex === this.sentenceWords.length - 1);
                    if (isLastWord) {
                        this.wordsCompleted++;
                        const wordPoints3 = (this.mode === 'medium') ? 2 : 1;
                        this.score += wordPoints3 * this.level * (5 + this.currentTarget.length);
                        if (this.mode === 'advanced') this.accrueAdvancedWordTime();
                        this.showFeedback('✅ Word!', 'correct');
                        this.playSound('word');
                        this.currentWordIndex++;
                        this.typedWordBuffer = '';
                        // Sentence complete
                        this.score += 10 * this.level;
                        this.showFeedback('🎉 Sentence complete!', 'correct');
                        this.sentencesCompleted++;
                        this.checkAdvancedLevelUp();
                        this.startAdvancedSentence(this.level);
                        this.updateUI();
                        return;
                    }
                }
            }

            // Update keyboard visual with neutral feedback
            this.updateKeyboardVisual(pressedKey, false);
        }
    }
    
    handleCorrectKey() {
        console.log('✅ Correct key pressed!');
        
        this.correctCount++;
        this.score += this.level * 10; // Higher levels give more points
        if (this.mode === 'beginner') {
            this.beginnerPitchStep++;
        }
        
        // Show positive feedback
        this.showFeedback('🎉 Perfect!', 'correct');
        
        // Create particle effect
        this.createParticleEffect();
        
        // Play success sound
        this.playSound('correct');
        
        // Check for level up
        this.checkLevelUp();
        
        // Generate new target
        setTimeout(() => {
            this.generateNewTarget();
            this.updateProgress();
        }, 300);
    }
    
    handleIncorrectKey() {
        console.log('❌ Incorrect key pressed!');
        
        // Show negative feedback
        this.showFeedback('😅 Try again!', 'incorrect');
        
        // Play error sound
        this.playSound('incorrect');
        
        // Generate new target after a short delay
        setTimeout(() => {
            this.generateNewTarget();
        }, 500);
    }
    
    showFeedback(message, type) {
        this.elements.feedback.textContent = message;
        this.elements.feedback.className = `feedback ${type}`;
        
        // Clear feedback after animation
        setTimeout(() => {
            this.elements.feedback.textContent = '';
            this.elements.feedback.className = 'feedback';
        }, 1000);
    }
    
    checkLevelUp() {
        const newLevel = Math.floor(this.correctCount / 10) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.showFeedback(`🚀 Level ${this.level}!`, 'correct');
            this.playSound('levelUp');
            if (this.mode === 'beginner') {
                this.beginnerPitchStep = 0;
            }
            this.triggerLevelUpVfx();
        }
    }

    checkAdvancedLevelUp() {
        // Level is based on sentences completed in advanced mode
        const newLevel = this.sentencesCompleted + 1; // start at 1, +1 per sentence
        if (newLevel > this.level) {
            this.level = newLevel;
            this.showFeedback(`🚀 Level ${this.level}!`, 'correct');
            this.playSound('levelUp');
            this.triggerLevelUpVfx();
            // Award pending time bonus with animation in advanced mode
            if (this.mode === 'advanced' && this.pendingTimeBonus && this.pendingTimeBonus > 0) {
                this.animateAndGrantTimeBonus(this.pendingTimeBonus);
                this.pendingTimeBonus = 0;
            }
            return true;
        }
        return false;
    }
    
    updateProgress() {
        const progress = (this.correctCount % 10) * 10;
        this.elements.progressFill.style.width = progress + '%';
    }
    
    startTimers() {
        // Game timer (countdown) — finer ticks for advanced
        const tickMs = this.mode === 'advanced' ? 100 : 1000;
        const decrement = tickMs / 1000;
        if (this.gameTimer) clearInterval(this.gameTimer);
        this.gameTimer = setInterval(() => {
            this.timeLeft = Math.max(0, this.timeLeft - decrement);
            this.elements.timer.textContent = Math.max(0, Math.ceil(this.timeLeft));
            if (this.mode === 'advanced' || this.mode === 'medium') {
                this.updateWpm();
            }
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, tickMs);
    }
    
    endGame() {
        console.log('🏁 Game ended!');
        
        this.isPlaying = false;
        clearInterval(this.gameTimer);
        this.saveScore();
        
        // Show game over screen
        setTimeout(() => {
            this.showGameOver();
            // Auto-open leaderboard after round
            this.openDashboard();
        }, 500);
    }
    
    updateUI() {
        this.elements.score.textContent = this.score;
        this.elements.level.textContent = this.level;
        this.elements.timer.textContent = Math.max(0, Math.ceil(this.timeLeft));
        this.elements.progressFill.style.width = '0%';
        if (this.mode === 'advanced' || this.mode === 'medium') this.updateWpm();
    }
    
    initKeyboardVisual() {
        // Add click handlers to keyboard keys for visual feedback
        const keyboardKeys = document.querySelectorAll('.keyboard-key');
        keyboardKeys.forEach(key => {
            key.addEventListener('click', () => {
                const keyValue = key.dataset.key;
                this.updateKeyboardVisual(keyValue, false);
            });
        });
    }
    
    updateKeyboardVisual(pressedKey, isCorrect) {
        // Reset all keys
        const keyboardKeys = document.querySelectorAll('.keyboard-key');
        keyboardKeys.forEach(key => {
            key.classList.remove('active', 'correct', 'incorrect');
        });
        
        // Find and highlight the pressed key
        const targetKey = document.querySelector(`[data-key="${pressedKey}"]`);
        if (targetKey) {
            targetKey.classList.add('active');
            
            if (isCorrect) {
                targetKey.classList.add('correct');
            } else {
                targetKey.classList.add('incorrect');
            }
            
            // Remove active class after animation
            setTimeout(() => {
                targetKey.classList.remove('active');
            }, 200);
        }
    }
    
    resetKeyboardVisual() {
        const keyboardKeys = document.querySelectorAll('.keyboard-key');
        keyboardKeys.forEach(key => {
            key.classList.remove('active', 'correct', 'incorrect');
        });
    }

    updateAdvancedTargetDisplay() {
        // Display the full sentence with current word highlighted and typed progress
        const wordsHtml = this.sentenceWords.map((word, idx) => {
            if (idx < this.currentWordIndex) {
                return `<span class="word completed">${word}</span>`;
            }
            if (idx === this.currentWordIndex) {
                const typed = this.typedWordBuffer;
                const remaining = word.slice(typed.length);
                return `<span class="word active"><span class="typed">${typed}</span><span class="remaining">${remaining}</span></span>`;
            }
            return `<span class="word upcoming">${word}</span>`;
        }).join(' ');
        this.elements.targetLetter.innerHTML = `<span class="sentence">${wordsHtml}</span>`;
    }

    startAdvancedSentence(level) {
        this.sentenceText = this.generateSentenceForLevel(level);
        this.sentenceWords = this.sentenceText.split(' ');
        this.currentWordIndex = 0;
        this.currentTarget = this.sentenceWords[0];
        this.typedWordBuffer = '';
        this.updateAdvancedTargetDisplay();
        console.log(`📝 New sentence (L${level}): ${this.sentenceText}`);
        // spawn fun memes on sentence advance (not in Medium mode)
        if (this.mode !== 'medium') this.spawnMemeGifs();
    }

    pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
    normalizeWord(s) { return (s || '').toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, ''); }

    generateSentenceForLevel(level) {
        const t = Math.min(5, Math.ceil(level / 2)); // tier 1..5
        const P = this.wordPools;

        const noun = (tier) => this.pick(tier >= 3 ? (tier >= 5 ? P.nounsAdvanced : P.nounsCommon) : P.nounsSimple);
        const adj = (tier) => this.pick(tier >= 3 ? (tier >= 5 ? P.adjsAdvanced : P.adjsCommon) : P.adjsSimple);
        const verb = (tier) => this.pick(tier >= 3 ? (tier >= 5 ? P.verbsAdvanced : P.verbsCommon) : P.verbsSimple);
        const adv = (tier) => this.pick(tier >= 3 ? (tier >= 5 ? P.adverbsAdvanced : P.adverbsCommon) : P.adverbsSimple);
        const place = () => this.pick(P.places);
        const prep = () => this.pick(P.preps);
        const time = () => this.pick(P.times);

        const clauseSimple = () => `the ${adj(t)} ${noun(t)} ${verb(t)} ${adv(t)}`;
        const clauseObj = () => `${this.pick(['we','they','I'])} ${verb(t)} the ${adj(t)} ${noun(t)}`;
        const clausePrep = () => `the ${adj(t)} ${noun(t)} ${verb(t)} ${prep()} the ${place()}`;
        const clauseTime = () => `${this.pick(['we','they'])} ${verb(t)} ${adv(t)} ${time()}`;

        const tier1 = () => this.capitalize(this.pick([
            `${clauseSimple()}`,
            `${clauseObj()}`,
            `the ${noun(t)} ${verb(t)}`,
            `${this.pick(['we','they'])} ${verb(t)} ${adv(t)}`
        ]));

        const tier2 = () => this.capitalize(this.pick([
            `${clauseSimple()} ${prep()} the ${place()}`,
            `${clauseObj()} ${prep()} the ${place()}`,
            `${clauseTime()}`
        ]));

        const tier3 = () => this.capitalize(this.pick([
            `${clauseSimple()}, and ${clauseObj()}`,
            `${clausePrep()}, and ${clauseTime()}`,
            `${clauseObj()} while ${clauseSimple()}`
        ]));

        const tier4 = () => this.capitalize(this.pick([
            `when the ${noun(t)} ${verb(t)} ${adv(t)}, the ${noun(t)} ${verb(t)} ${prep()} the ${place()}`,
            `${clauseObj()} because the ${noun(t)} ${verb(t)} ${adv(t)}`,
            `${clausePrep()}, but ${clauseObj()}`
        ]));

        const tier5 = () => this.capitalize(this.pick([
            `although the ${noun(t)} is ${adj(t)}, we ${verb(t)} ${adv(t)} ${prep()} the ${place()} ${time()}`,
            `${clauseSimple()}, and then ${clauseObj()} ${prep()} the ${place()}`,
            `${clauseTime()}, so the ${noun(t)} ${verb(t)} ${adv(t)}`
        ]));

        const generators = [tier1, tier2, tier3, tier4, tier5];
        return generators[t - 1]();
    }

    getBeginnerKeysForLevel(level) {
        if (level >= 4) return this.beginnerKeySets[4];
        if (level >= 3) return this.beginnerKeySets[3];
        if (level >= 2) return this.beginnerKeySets[2];
        return this.beginnerKeySets[1];
    }

    getAdvancedWordForLevel(level) {
        // Increase length with level
        const minLen = Math.min(3 + Math.floor((level - 1) / 1), 8);
        const maxLen = Math.min(minLen + 2, 10);
        const candidates = this.wordBank.filter(w => w.length >= minLen && w.length <= maxLen);
        if (candidates.length === 0) return this.wordBank[Math.floor(Math.random() * this.wordBank.length)];
        const idx = Math.floor(Math.random() * candidates.length);
        return candidates[idx];
    }

    updateWpm() {
        if (!this.gameStartTime) return;
        const minutes = Math.max(1/60, (Date.now() - this.gameStartTime) / 60000);
        const wpm = Math.round(this.wordsCompleted / minutes);
        if (this.elements.wpm) this.elements.wpm.textContent = wpm;
    }

    accrueAdvancedWordTime() {
        // Level 1: +1.00s per word; Level L: +1.00 * 0.98^(L-1)
        const bonus = Math.pow(0.98, Math.max(0, this.level - 1));
        this.pendingTimeBonus = (this.pendingTimeBonus || 0) + bonus;
        this.updatePendingBonusHint();
    }

    updatePendingBonusHint() {
        // Optional: could display a small accumulating hint near timer
        // Kept minimal to avoid clutter; available for future use
    }

    animateAndGrantTimeBonus(amount) {
        // Create a floating token near keyboard area and animate to the timer
        const overlay = document.getElementById('vfxOverlay');
        if (!overlay) { this.timeLeft += amount; return; }
        const token = document.createElement('div');
        token.className = 'time-bonus';
        token.textContent = `+${amount.toFixed(2)}s`;
        overlay.appendChild(token);

        // Start position: center-bottom (approx keyboard area)
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight * 0.78;
        token.style.transform = `translate(${startX}px, ${startY}px)`;

        // End position: timer element location
        const timerEl = this.elements.timer;
        const rect = timerEl ? timerEl.getBoundingClientRect() : { left: window.innerWidth - 60, top: 40 };
        const endX = rect.left + rect.width / 2;
        const endY = rect.top;

        // Animate via JS
        setTimeout(() => {
            token.style.transition = 'transform 800ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 800ms ease';
            token.style.transform = `translate(${endX}px, ${endY}px)`;
            token.style.opacity = '0.2';
        }, 20);

        setTimeout(() => {
            token.remove();
            this.timeLeft += amount;
            this.elements.timer.textContent = Math.max(0, Math.ceil(this.timeLeft));
        }, 850);
    }

    // ===== Leaderboard & Name Handling =====
    ensurePlayerName() {
        const name = localStorage.getItem('hrtm_player_name');
        if (!name) {
            this.openNameModal();
        }
    }

    openNameModal(onSavedCb) {
        if (!this.elements.nameModal) return;
        this.elements.nameModal.style.display = 'flex';
        if (this.elements.playerNameInput) this.elements.playerNameInput.value = localStorage.getItem('hrtm_player_name') || '';
        const close = () => { this.elements.nameModal.style.display = 'none'; };
        if (this.elements.saveNameBtn) this.elements.saveNameBtn.onclick = () => {
            const val = (this.elements.playerNameInput?.value || '').trim();
            if (val.length > 0) {
                localStorage.setItem('hrtm_player_name', val);
                close();
                if (typeof onSavedCb === 'function') onSavedCb();
            }
        };
        if (this.elements.cancelNameBtn) this.elements.cancelNameBtn.onclick = close;
        if (this.elements.closeNameModal) this.elements.closeNameModal.onclick = close;
    }

    openConfirmNameModal(name) {
        if (!this.elements.confirmNameModal) return;
        this.elements.confirmNameModal.style.display = 'flex';
        if (this.elements.confirmNameProceedBtn) this.elements.confirmNameProceedBtn.textContent = `${name} — click to confirm your name`;
        const close = () => { this.elements.confirmNameModal.style.display = 'none'; };
        if (this.elements.closeConfirmName) this.elements.closeConfirmName.onclick = close;
        if (this.elements.confirmNameProceedBtn) this.elements.confirmNameProceedBtn.onclick = () => { close(); this.startGame(); };
        if (this.elements.confirmNameNewPlayerBtn) this.elements.confirmNameNewPlayerBtn.onclick = () => { close(); this.openNameModal(() => this.startGame()); };
    }

    openDashboard() {
        if (!this.elements.dashboardModal) return;
        this.elements.dashboardModal.style.display = 'flex';
        if (this.elements.closeDashboard) this.elements.closeDashboard.onclick = () => { this.elements.dashboardModal.style.display = 'none'; };
        if (this.elements.changeNameBtn) this.elements.changeNameBtn.onclick = () => this.openNameModal();
        if (this.elements.tabBeginner && this.elements.tabAdvanced) {
            this.elements.tabBeginner.onclick = () => this.switchBoard('beginner');
            this.elements.tabAdvanced.onclick = () => this.switchBoard('advanced');
        }
        this.renderBoards();
    }

    switchBoard(which) {
        const tabB = this.elements.tabBeginner, tabA = this.elements.tabAdvanced;
        const boardB = document.getElementById('beginnerBoard');
        const boardA = document.getElementById('advancedBoard');
        if (!tabB || !tabA || !boardB || !boardA) return;
        if (which === 'advanced') {
            tabA.classList.add('active');
            tabB.classList.remove('active');
            boardA.classList.add('active');
            boardB.classList.remove('active');
        } else {
            tabB.classList.add('active');
            tabA.classList.remove('active');
            boardB.classList.add('active');
            boardA.classList.remove('active');
        }
    }

    getBoardKey() { return this.mode === 'advanced' ? 'hrtm_board_advanced' : 'hrtm_board_beginner'; }
    getBoardKeyByMode(mode) { return mode === 'advanced' ? 'hrtm_board_advanced' : 'hrtm_board_beginner'; }

    saveScore() {
        const name = localStorage.getItem('hrtm_player_name') || 'Player';
        const accuracy = this.totalCount > 0 ? Math.round((this.correctCount / this.totalCount) * 100) : 100;
        const entry = {
            name,
            score: this.score,
            level: this.level,
            accuracy,
            wpm: this.mode === 'advanced' ? (this.elements.wpm ? Number(this.elements.wpm.textContent) : 0) : undefined,
            mode: this.mode,
            date: new Date().toLocaleString()
        };
        const key = this.getBoardKey();
        const arr = JSON.parse(localStorage.getItem(key) || '[]');
        arr.push(entry);
        // sort desc by score primarily; for advanced, tie-break by wpm
        arr.sort((a,b) => {
            if (b.score !== a.score) return b.score - a.score;
            if (this.mode === 'advanced') return (b.wpm||0) - (a.wpm||0);
            return b.level - a.level;
        });
        // keep top 20
        const trimmed = arr.slice(0, 20);
        localStorage.setItem(key, JSON.stringify(trimmed));
    }

    renderBoards() {
        const bKey = this.getBoardKeyByMode('beginner');
        const aKey = this.getBoardKeyByMode('advanced');
        const bArr = JSON.parse(localStorage.getItem(bKey) || '[]');
        const aArr = JSON.parse(localStorage.getItem(aKey) || '[]');
        if (this.elements.beginnerBoardBody) this.elements.beginnerBoardBody.innerHTML = this.renderBoardRows(bArr, 'beginner');
        if (this.elements.advancedBoardBody) this.elements.advancedBoardBody.innerHTML = this.renderBoardRows(aArr, 'advanced');
    }

    renderBoardRows(arr, mode) {
        return arr.map((e, i) => {
            const cells = [
                `<td>${i+1}</td>`,
                `<td>${this.escapeHtml(e.name)}</td>`,
                `<td>${e.score}</td>`,
                `<td>${e.level}</td>`,
                mode === 'advanced' ? `<td>${e.wpm||0}</td>` : '',
                `<td>${e.accuracy}%</td>`,
                `<td>${this.escapeHtml(e.date)}</td>`
            ].filter(Boolean).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
    }

    escapeHtml(s) { return (s||'').replace(/[&<>"]+/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
    
    // ===== Level-up VFX (non-blocking) =====
    triggerLevelUpVfx() {
        const overlay = document.getElementById('vfxOverlay');
        if (!overlay) return;
        // Sweep bar from left to right
        const sweep = document.createElement('div');
        sweep.className = 'vfx-sweep';
        overlay.appendChild(sweep);
        setTimeout(() => { sweep.remove(); }, 1000);

        // Edge confetti bursts (top and bottom edges)
        const colors = ['#ffd700', '#ff6b6b', '#4fd1c5', '#667eea', '#38a169'];
        const makeConfetti = (y) => {
            for (let i = 0; i < 30; i++) {
                const piece = document.createElement('div');
                piece.className = 'vfx-confetti';
                piece.style.left = Math.random() * 100 + 'vw';
                piece.style.top = y + 'px';
                piece.style.background = colors[Math.floor(Math.random() * colors.length)];
                piece.style.transform = `rotate(${Math.random()*360}deg)`;
                overlay.appendChild(piece);
                setTimeout(() => piece.remove(), 1300);
            }
        };
        makeConfetti(0);
        makeConfetti(window.innerHeight - 10);
        // also launch side memes on level up (not in Medium mode)
        if (this.mode !== 'medium') this.spawnMemeGifs();
    }

    spawnMemeGifs() {
        const overlay = document.getElementById('vfxOverlay');
        if (!overlay || !this.memeGifUrls || this.memeGifUrls.length === 0) return;
        const count = 2; // one on each side
        for (let i = 0; i < count; i++) {
            const img = document.createElement('img');
            img.className = 'meme-float ' + (i % 2 === 0 ? 'left' : 'right');
            img.src = this.memeGifUrls[Math.floor(Math.random() * this.memeGifUrls.length)];
            img.alt = 'meme';
            img.style.top = (60 + Math.random() * 20) + 'vh';
            overlay.appendChild(img);
            setTimeout(() => img.remove(), 6500);
        }
    }
    
    createParticleEffect() {
        // Create floating particles for visual feedback
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position around the target letter
            const rect = this.elements.targetLetter.getBoundingClientRect();
            particle.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 100) + 'px';
            particle.style.top = (rect.top + rect.height / 2 + (Math.random() - 0.5) * 100) + 'px';
            
            document.body.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
    
    playSound(type) {
        // Create audio context for sound effects
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        // Different sounds for different events
        switch (type) {
            case 'correct':
                // Beginner: per-key rising pitch within level (resets each level); Advanced: fixed
                {
                    if (this.mode === 'beginner') {
                        const step = Math.min(20, this.beginnerPitchStep || 0);
                        const baseLow = 450;
                        const inc = 25;
                        const startFreq = baseLow + step * inc;
                        const endFreq = startFreq + 180;
                        oscillator.frequency.setValueAtTime(startFreq, ctx.currentTime);
                        oscillator.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.1);
                    } else {
                        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
                        oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
                    }
                }
                gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.2);
                break;
                
            case 'incorrect':
                oscillator.frequency.setValueAtTime(200, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.3);
                break;
                
            case 'levelUp':
                {
                    const s1 = this.mode === 'beginner' ? 500 + this.level * 40 : 400;
                    const s2 = this.mode === 'beginner' ? 800 + this.level * 50 : 800;
                    const s3 = this.mode === 'beginner' ? 1100 + this.level * 60 : 1200;
                    oscillator.frequency.setValueAtTime(s1, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(s2, ctx.currentTime + 0.1);
                    oscillator.frequency.exponentialRampToValueAtTime(s3, ctx.currentTime + 0.2);
                }
                gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.3);
                break;
                
            case 'start':
                oscillator.frequency.setValueAtTime(600, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.2);
                break;
                
            case 'gameOver':
                oscillator.frequency.setValueAtTime(300, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.5);
                break;
            case 'word':
                oscillator.frequency.setValueAtTime(500, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);
                gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.22);
                break;
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Home Row Typing Master - Loading...');
    new TypingGame();
});

// Add some fun console messages
console.log(`
🎮 Welcome to Home Row Typing Master! 
🎯 Master the ASDF JKL; keys
🚀 Ready to become a typing champion?
`);

// Add keyboard shortcuts for development
document.addEventListener('keydown', (e) => {
    // Press 'R' to restart game (for testing)
    if (e.key === 'r' && e.ctrlKey) {
        location.reload();
    }
});
