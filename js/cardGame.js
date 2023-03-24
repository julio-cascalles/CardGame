var table;
var winner;

function Table(deckOptions,playersCount){
	var _this = this;
	table = this;
	_this.players = [];
	_this.onMessage = showSimpleMessage;
	_this.onBeginTurn;
	_this.onGameOver;
	_this.mode;
	var active = true;
	var playerIndex = null;
	var lastPlayer;
	for (var i = 0; i < playersCount; i++) {
		var new_player = new Player();
		new_player.init();
		if(lastPlayer){
			new_player.enemy = lastPlayer;
		}
		new_player.number = _this.players.push(new_player);		
		new_player.deck = new Deck(deckOptions,new_player);
		lastPlayer = new_player;
	};
	_this.setMode = function(new_mode){
		_this.mode = new_mode;
		if(_this.mode == 'tutorial') return;
		//---------------------
		for (var i = 0; i < _this.players.length; i++) {
			var player = _this.players[i];
			player.deck.init();
		};
		//---------------------
		_this.nextTurn();
	}
	_this.nextTurn = function(){
		if(!active){
			return; // O jogo já acabou
		}
		if(playerIndex == null){
			playerIndex = Math.floor(Math.random()*_this.players.length);
		}else{
			playerIndex = (playerIndex+1) % _this.players.length;
		}
		var player  = _this.getCurrentPlayer();
		player.selectedCard = null;
		player.addMana(player.maxMana);
		player.wakeUpAttackers();
		player.deck.giveCards(player.handSpaces);
		if(_this.onBeginTurn) _this.onBeginTurn(player);
		if(player.maxMana < 10) player.maxMana++;
	}
	_this.getCurrentPlayer = function(){
		return _this.players[playerIndex];
	}
	_this.setCurrentPlayer = function(_index){
		playerIndex = _index;
	}
	_this.setActive = function(state){
		if(state == active) return;
		//------------------------------
		active = state;
		if(active){
			reset();
		}else{
			evaluateWinner();
			if(_this.onGameOver) _this.onGameOver();
		}
		//------------------------------
	}
	_this.isActive = function(){
		return active;
	}
	function evaluateWinner() {
	    winner = table.players[0];
	    for (var i = 1; i < table.players.length; i++) {
	    	var player = table.players[i];
	    	if(player.deck.size > winner.deck.size){		
				winner = player;
			}else if(winner.deck.size > player.deck.size){
				continue;
			}else if(player.mana > winner.mana){
				winner = player;
			}else if(winner.mana > player.mana){
				continue;
			}else if(table.getCurrentPlayer() == player){
				winner = player;
			}
	    };
	}
	function reset() {
		for (var i = 0; i < _this.players.length; i++) {
			var player = _this.players[i];
			var deck   = player.deck;
			player.init();
			deck.init();
			for (var j = 0; j < deck.cards.length; j++) {
				var card = deck.cards[j];
				card.attack  = card.origin.attack;
				card.defense = card.origin.defense;
				card.element.style.zIndex = 0;
				card.updateValues({atackId:'ataque',defenseId:'resist'});
				card.setPlace('deck');
			};
		};
		playerIndex = null;
		table.nextTurn();
	}
}

function Card(options) {
	var _this = this;
	_this.attack        = options.attack;
	_this.defense       = options.defense;
	_this.isDefender    = options.isDefender;
	_this.canAttack     = options.canAttack;  // default = false
	_this.cost          = options.cost;
	_this.onDestroy     = options.onDestroy; // callBack
	_this.onChangePlace = options.onChangePlace;
	_this.onFight       = options.onFight;
	_this.image         = options.image;
	_this.name          = options.name;
	_this.place = "out"; // Status da carta e local onde ela está..
	_this.number;
	_this.element;
	_this.owner;
	_this.position;
	_this.powerUp = strToPowerUp(options.powers)
	_this.origin  = options;
	_this.frozenTime  = 0;
	_this.sources = [];
	_this.checkAlive = function(damage){
		if(_this.powerUp && _this.powerUp.shield){
			// Quando tem escudo, ignora o primeiro ataque sofrido:
			_this.removePower('sh');
			_this.powerUp.shield = false;
			return;
		}
		_this.defense -= damage;
		if(_this.defense <= 0){
			_this.place = 'out';
			_this.owner.tableSpaces.unshift(_this.position);
				//... Liberou espaço na mesa
			_this.owner.deck.size--;
			if(_this.owner.deck.size < 1){
				table.setActive(false);
			}
			if(_this.powerUp){
				// Quando morre, remove os efeitos da carta na mesa:
				_this.owner.applyPowers(_this,true);
			}
			_this.onDestroy(_this);
		}else{
			_this.updateValues({atackId:'ataque',defenseId:'resist'});
		}
	}
	_this.setPlace = function(new_place){
		if(_this.onChangePlace){
			_this.onChangePlace(_this,new_place);
		}
		_this.place = new_place;
	}
	_this.fightWith = function(opponent){
		if(!_this.canAttack || _this.attack == 0){
			table.onMessage('A carta não pode atacar');
			return false;
		}
		if( !opponent.isDefender && opponent.owner.hasDefenders() ){
			table.onMessage('É preciso atacar os defensores primeiro!');
			return false;
		}
		_this.element.style.zIndex = opponent.element.style.zIndex + 5;
		if(_this.onFight){
			var ok = _this.onFight(_this,opponent);
			if(!ok) return false; // Ataque cancelado
		}
		// --- Só pode atacar uma vez por turno...
		if(_this.powerUp){
			// ...ou duas (2) se tiver esse poder:
			_this.canAttack = _this.powerUp.doubleAttack;
			_this.powerUp.doubleAttack = false;
		}else
			_this.canAttack = false;
		_this.updateValues({atackId:'ataque'});
		//-------------------------------------------
		opponent.checkAlive(_this.attack);
		_this.checkAlive(opponent.attack);
		if(opponent.powerUp && opponent.powerUp.freeze){
			opponent.removePower('fz');
			opponent.freeze = false;
			//  Foi congelado...
			_this.frozenTime = 2;
			var frameId = 'frame'+_this.getSulfix();
			document.getElementById(frameId).style.backgroundColor = '#8FA4B4'
		}
		return true;
	}
	_this.createElement = function() {
		// --- Cria um elemento DOM no HTML: ----
		var str_html = 
			 '<div id="frame%%" class="frame">'
			+'	<div class="margem sup">'
			+'		<div class="circulo left">'
			+'			<p id="custo%%" class="texto_num">C</p>'
			+'		</div>'
			+'      <div id="atrib%%" class="atrib">'
			+'		</div>'
			+'	</div>'
			+'	<div class="margem inf">'
			+'		<div class="circulo left">'
			+'			<p id="ataque%%" class="texto_num">A</p>'
			+'		</div>'
			+'		<div class="circulo right">'
			+'			<p id="resist%%" class="texto_num">R</p>'
			+'		</div>'
			+'	</div>'
			+'</div>';
		str_html = str_html.replaceAll( '%%', _this.getSulfix() );
		_this.element = document.createElement('div');
		_this.element.id = 'card'+_this.getSulfix();
		_this.element.className = 'card';
		_this.element.innerHTML = str_html;
		document.body.appendChild(_this.element);
		/*--- Atribui os valores: ------------------*/
		_this.updateValues({costId:'custo',atackId:'ataque',defenseId:'resist'});
		//------- Power-Ups da carta --------
		if(_this.origin.powers){
			var atribID = 'atrib'+_this.getSulfix(); 
			document.getElementById(atribID)
			 .innerHTML = _this.origin.powers;
		}
		/*---- Coloca a ilustração na carta: ------ */
		var frameId = 'frame'+_this.getSulfix();
		document.getElementById(frameId)
		 .style.backgroundImage='url('+_this.image+')';
	}
	_this.getSulfix = function() {
		return _this.owner.number+'_'+_this.number;
	}
	_this.updateValues = function(options){
		var textField;
		if(options.costId){
			options.costId    += _this.getSulfix();
			textField = document.getElementById(options.costId);
			textField.innerHTML    = _this.cost.toString();
		}
		if(options.atackId){
			options.atackId   += _this.getSulfix();
			textField = document.getElementById(options.atackId);
			if(_this.canAttack){
				textField.style.color = '#30B295';
			}else{
				textField.removeAttribute("style");
			}
			textField.innerHTML   = _this.attack.toString();
		}
		if(options.defenseId){
			options.defenseId += _this.getSulfix();
			textField = document.getElementById(options.defenseId);
			if(_this.isDefender){
				textField.style.color = '#B80F45';
			}
			textField.innerHTML = _this.defense.toString();
		}
		
	}
	_this.setBackSide = function(img){
		var frameId = 'frame'+_this.getSulfix();
		if(img){
			_this.element.style.backgroundImage='url('+img+')';
			document.getElementById(frameId).style.display = 'none';
			_this.element.onclick = null;
			_this.element.style.cursor = 'default';
		}else{
			_this.element.style.backgroundImage='';
			document.getElementById(frameId).style.display = 'block';
			/*------------------------------*/
			if(table.mode != 'demo'){
						_this.element.onclick = _this.myClick;
						_this.element.style.cursor = 'pointer';
			}
			/*------------------------------*/
		}
	}
	_this.myClick = function(){
		if( !table.isActive() ){
			return; // O jogo já acabou
		}
		switch(_this.place){
			case 'hand':
				_this.owner.pickCard(_this);
				break;
			case 'table':
				if(table.getCurrentPlayer() == _this.owner.enemy){
					var card2 = _this.owner.enemy.selectedCard;
					if(card2) card2.fightWith(_this);
				}else{
					_this.owner.selectedCard = _this;
				}
				break;
		}
	}
	_this.removePower = function(power){
		var atrib_id = 'atrib'+_this.getSulfix();
		var element = document.getElementById(atrib_id);
		var str = element.innerHTML;
		var arr = str.split(',');
		var idx = arr.indexOf(power);
		if(idx == -1) 
			return;
		arr.splice(idx,1);
		element.innerHTML = arr.join();
	}
}

function Deck(arrayOptions,player) {
	var _this = this;
	_this.cards = [];
	_this.size;
	for (var i = 0; i < arrayOptions.length; i++) {
		var new_card = new Card(arrayOptions[i]);
		new_card.number = _this.cards.push(new_card);
		new_card.owner  = player;
		new_card.createElement();
		new_card.setPlace('deck');
	};
	_this.init = function(){
		_this.size = _this.cards.length;		
		_this.shuffle();
	}
	_this.giveCards = function(handSpaces){
		var new_hand = [];
		var cardsInDeck = _this.cardsInPlace('deck');
		var index = 0;
		// "handSpaces" são posições livres na mão do jogador
		while(handSpaces.length > 0) {
			if(index > cardsInDeck.length-1){
				table.onMessage('Acabaram as cartas!  :(');
				break;
			}
			var card = cardsInDeck[index];
			index++;
			card.position = handSpaces.shift();
			card.element.style.zIndex = card.position;
			card.setPlace('hand');
			new_hand.push(card);
		};
		return new_hand;
	}
	_this.shuffle = function(){
		for (var a = 0; a < _this.cards.length; a++) {
			var  b = Math.floor(Math.random()*_this.cards.length);
			var card1 = _this.cards[a];
			var card2 = _this.cards[b];
			_this.cards[a] = card2;
			_this.cards[b] = card1;
		}
	}
	_this.cardsInPlace = function(search){
		var group = [];
		for (var i = 0; i < _this.cards.length; i++) {
			var card = _this.cards[i];
			if(card.place == search){
				group.push(card);
			}
		};
		return group;
	}
}

function Player() {
	var _this = this;
	_this.deck;
	_this.mana;
	_this.maxMana;
	_this.number;
	_this.selectedCard;
	_this.enemy;
	_this.handSpaces;
	_this.tableSpaces;
	_this.AISystem;
	_this.init = function(){
		_this.mana    = 0;
		_this.maxMana = 5;
		_this.handSpaces  = [1,2,3,4,5];
		_this.tableSpaces = [1,2,3,4,5];
	}
	_this.addMana = function(increment){
		_this.mana = Math.min( _this.mana + increment, 10 );
	}
	_this.wakeUpAttackers = function(){
		var tableCards = _this.deck.cardsInPlace('table');
		for (var i = 0; i < tableCards.length; i++) {
			var card = tableCards[i];
			//----- Descongela...   ------------------
			if(card.frozenTime > 0){ 
				card.frozenTime--;
				if(card.frozenTime > 0)
					continue;
				var frameId = 'frame'+card.getSulfix();
				document.getElementById(frameId).style.backgroundColor = '';
			}
			//--- Habilita as cartas para atacar: ---
			if(card.attack > 0){
				card.canAttack = true;
				card.updateValues({atackId:'ataque'});
			}
			//-------------------------------------------
		};
	}
	_this.hasDefenders = function(){
		var tableCards = _this.deck.cardsInPlace('table');
		for (var i = 0; i < tableCards.length; i++) {
			var card = tableCards[i];
			if(card.isDefender){
				return true;
			}
		};
		return false;
	}
	_this.pickCard = function(card){
		if(_this.mana < card.cost){
			table.onMessage("Sem recursos para comprar essa carta.");
			return false;
		}
		if(_this.tableSpaces.length == 0){
			table.onMessage('Não há mais espaço na mesa.');
			return false;
		}
		_this.mana -= card.cost;
		_this.handSpaces.push(card.position);  // Liberou um espaço na mão
		card.position = _this.tableSpaces.shift();
		_this.applyPowers(card);
		card.setPlace('table');
		return true;
	}
	_this.applyPowers = function(source,remove){
		var powerUp = source.powerUp;
		if(!powerUp)
			return;
		var cardsInTable = _this.deck.cardsInPlace('table');
		for (var i = 0; i < cardsInTable.length; i++) {
			var card = cardsInTable[i];
			if(remove){
				if( card.sources.indexOf(source) == -1 )
					continue; // Não está sob influência desse source...
				card.attack  -= powerUp.attack;
				card.checkAlive(powerUp.defense); // Se perdeu o "healer" que a mantinha viva, morre!
			}else if(powerUp.attack > 0 || powerUp.defense > 0){
				card.attack  += powerUp.attack;
				card.defense += powerUp.defense;
				card.sources.push(source);
				card.updateValues({atackId:'ataque',defenseId:'resist'});
			}
		};
		_this.addMana(powerUp.mana);
	}
}


//---- Inteligência Artificial (jogador controlado pelo computador) ------

function AISystem(_player){
	var _this = this;
	var timer;
	var cardList;
	var player  = _player;
	_this.makeMove = function(){
		cardList = player.deck.cardsInPlace('hand');
		timer = setInterval(discard,1000);
	}
	function discard(){
		if(cardList.length > 0){
			var card = cardList.shift();
			player.pickCard(card);
		}else{
			clearInterval(timer);
			// Depois de descartar tudo, inicia o ataque:
			cardList = player.deck.cardsInPlace('table');
			timer = setInterval(sendToAttack,700);
		}
	}
	function weakCards(a,b) {
		if(a.isDefender && !b.isDefender){
			return -1
		}else if(!a.isDefender && b.isDefender){
			return 1;
		}else if(a.defense < b.defense){
			return -1
		}else if(a.defense == b.defense && a.attack > b.attack){
			return -1;
		}else{	
			return 1
		};
	}
	function sendToAttack() {
		var targets = player.enemy.deck.cardsInPlace('table');
		targets.sort(weakCards);
		if(cardList.length > 0 && targets.length > 0){
			var card = cardList.shift();
			card.fightWith(targets[0]);
		}else{
			clearInterval(timer);
			table.nextTurn();
		}
	}
}

//-----------------------------------------------

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

function strToPowerUp(str){
	if(!str) return null;
	// ex.: "a+1,d+1,m+1,fz,da,sh"
    var powerUp = {
        attack:         0, // onChangePlace
        defense:        0, // onChangePlace
        mana:           0, // onChangePlace
        doubleAttack:   false,
        shield:         false,  // onFight
        freeze:         false   // onFight ... onDestroy
    };
    var atribList = str.split(',');
	for (var i = 0; i < atribList.length; i++) {
		str = atribList[i];
		switch( str.substr(0,2) ){
			case 'a+':
			  powerUp.attack  = parseInt( str[2] );
			  break;
			case 'd+':
			  powerUp.defense  = parseInt( str[2] );
			  break;
			case 'm+':
			  powerUp.mana  = parseInt( str[2] );
			  break;
			case 'fz':  // FreeZe
			  powerUp.freeze = true;
			  break;
			case 'da':  // Double Attack
			  powerUp.doubleAttack = true;
			  break;
			case 'sh':  // shield
			  powerUp.shield = true;
			  break;
		}
	};
	return powerUp;
}

function showSimpleMessage(msg) {
	console.log(msg);
}
