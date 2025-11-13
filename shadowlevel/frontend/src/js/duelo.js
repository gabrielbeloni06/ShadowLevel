document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const arena = document.querySelector('.duel-arena');
  const opponentImg = document.getElementById('opponent');
  const opponentHP = document.getElementById('opponent-hp');
  const opponentStance = document.getElementById('opponent-stance');
  const playerSuper = document.getElementById('player-super');
  const playerHP = document.getElementById('player-hp');
  const gameMessage = document.getElementById('game-message');
  const winScreen = document.getElementById('win-screen');
  const loseScreen = document.getElementById('lose-screen');
  const bgMusic = document.getElementById('bg-music');
  const prompts = {
    defesa: document.getElementById('prompt-defesa'),
    ataque: document.getElementById('prompt-ataque'),
    ruptura: document.getElementById('prompt-ruptura'),
    super: document.getElementById('prompt-super')
  };
  const config = {
    parryWindow: 400,
    telegraphTime: 1000, 
    postParryWindow: 800,
    stunDuration: 3000,
    playerDamage: 25,
  };

  let gameState = 'IDLE';
  let gameTimers = [];
  let musicStarted = false;

  let opponent = {
    hp: 100, maxHp: 100,
    stance: 100, maxStance: 100,
  };
  let player = {
    hp: 100, maxHp: 100,
    super: 0, maxSuper: 100,
  };
  const opponentSprites = {
    idle: '../img/duel/opponent_idle.png',
    telegraph: '../img/duel/opponent_telegraph.png',
    parried: '../img/duel/opponent_parried.png',
    broken: '../img/duel/opponent_broken.png',
    defeated: '../img/duel/opponent_defeated.png'
  };
  function gameLoop() {
    if (gameState !== 'IDLE') return;
    const nextAttackTime = Math.random() * 2000 + 1000;
    gameTimers.push(setTimeout(startOpponentAttack, nextAttackTime));
  }

  function startOpponentAttack() {
    if (gameState !== 'IDLE') return;

    gameState = 'TELEGRAPH';
    setOpponentSprite('telegraph');
    showPrompt('defesa', true);

    gameTimers.push(setTimeout(() => {
      gameState = 'PARRY_WINDOW';
      gameTimers.push(setTimeout(() => {
        if (gameState === 'PARRY_WINDOW') {
          handlePlayerDamage();
        }
      }, config.parryWindow));
    }, config.telegraphTime));
  }

  function handlePlayerInput(key) {
    if (!musicStarted && gameState !== 'GAME_OVER') {
      bgMusic.volume = 0.3;
      bgMusic.play().catch(e => console.warn("Audio play failed:", e));
      musicStarted = true;
    }

    if (key === 'w' && player.super >= player.maxSuper && gameState !== 'BUSY' && gameState !== 'GAME_OVER') {
      handleSuper();
      return;
    }

    switch (gameState) {
      case 'PARRY_WINDOW':
        if (key === 'a') {
          gameState = 'POST_PARRY';
          clearAllTimers();
          setOpponentSprite('parried');
          playFx('parry');
          
          showPrompt('defesa', false);
          showPrompt('ataque', true);
          showPrompt('ruptura', true);

          gameTimers.push(setTimeout(() => {
            if (gameState === 'POST_PARRY') resetToIdle();
          }, config.postParryWindow));
        }
        break;

      case 'POST_PARRY':
        if (key === 's') handleRiposte();
        else if (key === 'd') handleRupture();
        break;

      case 'STUNNED':
         if (key === 's') handleRiposte();
         else if (key === 'd') handleRupture();
        break;
    }
  }

  function handleRiposte() {
    gameState = 'BUSY';
    clearAllTimers();
    playFx('attack'); 

    opponent.hp = Math.max(0, opponent.hp - 10);
    player.super = Math.min(player.maxSuper, player.super + 25);
    
    updateUI();
    if (opponent.hp <= 0) {
      handleVictory();
    } else {
      gameTimers.push(setTimeout(resetToIdle, 600)); 
    }
  }

  function handleRupture() {
    gameState = 'BUSY';
    clearAllTimers();
    playFx('break');

    opponent.stance = Math.max(0, opponent.stance - 35);
    updateUI();

    if (opponent.stance <= 0) {
      handleStanceBreak();
    } else if (opponent.hp <= 0) {
      handleVictory();
    } else {
      gameTimers.push(setTimeout(resetToIdle, 800)); 
    }
  }
  
  function handleStanceBreak() {
    gameState = 'STUNNED';
    clearAllTimers();
    setOpponentSprite('broken');
    showMessage('POSTURA QUEBRADA!', 'break');

    if (player.super >= player.maxSuper) {
      showPrompt('super', true, 'ready');
    }
    
    gameTimers.push(setTimeout(() => {
      if (gameState === 'STUNNED') {
        opponent.stance = opponent.maxStance;
        updateUI();
        resetToIdle();
      }
    }, config.stunDuration));
  }
  
  function handleSuper() {
    gameState = 'BUSY';
    clearAllTimers();
    playFx('super'); 

    opponent.hp = Math.max(0, opponent.hp - 50);
    player.super = 0;
    
    gameTimers.push(setTimeout(() => {
      updateUI();
      if (opponent.hp <= 0) {
        handleVictory();
      } else {
        if (opponent.stance <= 0) opponent.stance = opponent.maxStance;
        updateUI();
        resetToIdle();
      }
    }, 2500));
  }
  function handlePlayerDamage() {
    gameState = 'BUSY';
    clearAllTimers();
    playFx('damage');
    showMessage('DANO!', 'damage');
    
    player.hp = Math.max(0, player.hp - config.playerDamage);
    updateUI();
    
    if (player.hp <= 0) {
      handleDefeat();
    } else {
      gameTimers.push(setTimeout(resetToIdle, 500));
    }
  }

  function handleVictory() {
    gameState = 'GAME_OVER';
    clearAllTimers();
    setOpponentSprite('defeated');
    showMessage('VITÓRIA', 'victory');
    body.className = 'state-win';
    winScreen.classList.add('active');
    bgMusic.pause();
    musicStarted = false;
  }

  function handleDefeat() {
    gameState = 'GAME_OVER';
    clearAllTimers();
    setOpponentSprite('defeated');
    body.className = 'state-lose';
    loseScreen.classList.add('active');
    bgMusic.pause();
    musicStarted = false;
  }

  function resetToIdle() {
    if (gameState === 'GAME_OVER') return; 

    gameState = 'IDLE';
    clearAllTimers();
    setOpponentSprite('idle');
    
    showPrompt('defesa', false);
    showPrompt('ataque', false);
    showPrompt('ruptura', false);
    body.className = 'state-battle';
    showPrompt('super', false, player.super >= player.maxSuper ? 'ready' : null);
    updateUI();
    
    gameLoop();
  }

  function updateUI() {
    opponentHP.style.width = `${(opponent.hp / opponent.maxHp) * 100}%`;
    opponentStance.style.width = `${(opponent.stance / opponent.maxStance) * 100}%`;
    playerSuper.style.width = `${(player.super / player.maxSuper) * 100}%`;
    playerHP.style.width = `${(player.hp / player.maxHp) * 100}%`;
    
    showPrompt('super', false, player.super >= player.maxSuper ? 'ready' : null);
    if(gameState === 'STUNNED' && player.super >= player.maxSuper) {
        showPrompt('super', true, 'ready');
    }
  }

  function setOpponentSprite(state) {
    if (opponentSprites[state]) {
      opponentImg.src = opponentSprites[state];
      opponentImg.className = state;
    }
  }

  function showPrompt(promptKey, isActive, stateClass = 'prompt') {
    const el = prompts[promptKey];
    if (isActive) {
      el.classList.add(stateClass);
    } else {
      el.classList.remove('prompt'); 
      el.classList.remove('ready'); 
      if(stateClass === 'ready') el.classList.add('ready');
    }
  }

  function showMessage(msg, className) {
    gameMessage.textContent = msg;
    gameMessage.className = `game-message ${className}`;
  }

  function clearAllTimers() {
    gameTimers.forEach(timer => clearTimeout(timer));
    gameTimers = [];
  }

  function playFx(effect) {
    if (gameState === 'GAME_OVER') return; 

    body.classList.remove('player-damaged', 'player-parry', 'player-super');
    arena.classList.remove('shake');
    
    if (window.duelEffects) {
      switch (effect) {
        case 'damage':
          body.classList.add('player-damaged');
          arena.classList.add('shake');
          break;
        case 'parry':
          body.classList.add('player-parry');
          window.duelEffects.doParryFx();
          break;
        case 'attack':
          window.duelEffects.doAttackFx();
          break;
        case 'break':
          arena.classList.add('shake');
          window.duelEffects.doBreakFx();
          break;
        case 'super':
          body.classList.add('player-super');
          window.duelEffects.doSuperFx();
          break;
      }
    }
  }

  window.addEventListener('keydown', (e) => {
    handlePlayerInput(e.key.toLowerCase());
  });

  console.log("Duelo Iniciado. Use A (Defesa), S (Ataque), D (Ruptura), W (Super).");
  body.className = 'state-battle';
  updateUI();
  gameLoop();
});