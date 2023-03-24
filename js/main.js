var dica_num = 0;
var player1,player2; // usados no tutorial
var num_bots = 1;

function init(modo) {
    $('#menu').hide();
    //---------------------------
    switch(modo){
        case 'tutorial':
            $('#tutorial_Area').show();
            preparaDados(tutorialCards);
            ativaTutorial();
            break;
        case 'demo':
            num_bots = 2;
        case 'game':
            $('#tutorial_Area').hide();
            preparaDados(gameCards);
            player1.enemy = player2;
    }
    table.setMode(modo);
    $('#game_Area').show();
}

function ativaTutorial() {
        botaoTransparente(0.2);
        table.setCurrentPlayer(0);
        player1.deck.giveCards([3]);
        updateManaBar(player1);
        player1.tableSpaces = [5];
        mostraDica();
}

function reinicia(onlyTable) {
    location.reload();
}

function stepTutorial() {
    if(dica_num == 13){
        fadeText('Agora teste suas habilidades num JOGO real');
        setTimeout(reinicia,3000);
        return;
    }
    if( [3,5,8,9,11].indexOf(dica_num) > -1 )
        return;  // Força o jogador a jogar a carta pra ler a proxima dica...
    mostraDica();
    switch(dica_num){
        case 3:
            // Habilita a jogabilidade:
            player1.mana = 1;
            updateManaBar(player1);
            break;
        case 5:
        case 11:
            botaoTransparente(1);
            break;
        case 7:
            player1.wakeUpAttackers();
            break;
        case 8:
            setTimeout(mostraDica,2000);
            break; 
    }    
}

function encerraTurno() {
    // ---- onclick do botao "Fim de Turno":
    var player = table.getCurrentPlayer();
    if(player.number == 2 || num_bots == 2){
        return;
    }
    if(table.mode == 'tutorial'){
        if( [5,11].indexOf(dica_num) == -1 )
            return;
        var card = player2.deck.giveCards([3])[0];
        player2.mana = card.cost; // garante que vai ter mana pra jogar a carta
        player2.pickCard(card);
        if(dica_num == 12){
            player2.mana = 2;
            updateManaBar(player2);
        }
        botaoTransparente(0.2);
    }else
        table.nextTurn();
}

function preparaDados(dados) {
    // --- Coloca eventos dos cards: ----
    for (var i = 0; i < dados.length; i++) {
        dados[i].onDestroy     = cardDestruido;
        dados[i].onChangePlace = cardChangePlace;
        dados[i].onFight       = lutando;
    };
    table = new Table(dados,2);
    //---------------------------
    table.onBeginTurn = turnoJogador;
    table.onMessage   = showGameMessage;
    table.onGameOver  = fimDeJogo;
    //------------------
    player1 = table.players[0];
    player2 = table.players[1];
    //------------------
}

function cardDestruido(card) {
    //--- Faz o card "tremer" antes de morrer: ---
    var element_id = '#'+card.element.id;
    $(element_id)
        .animate({left:'-=5'},50)
        .animate({left:'+=5'},50)
        .animate({left:'-=5'},50)
        .animate({left:'+=5'},50)
        .animate({left:'-=5'},50)
        .animate({left:'+=5'},50)
        .animate({left:'-=5'},50)
        .animate({left:'+=5'},50).delay(700).fadeOut();
    //---------------------------------------------
}

function cardChangePlace(card,destination) {
	var player = card.owner;
    if(destination != 'table'){
        // Montando a pilha de cartas...
        var element_id = '#'+card.element.id;
        if(destination == 'deck'){
            var deckPos = [{x:870,y:570},{x:40,y:30}];
            var pos = deckPos[player.number-1];
            $(element_id)
                .removeClass('hand1 hand2 hand3 hand4 hand5')
                .show()
                .css({left:pos.x+card.number,top:pos.y+card.number});
            card.setBackSide('img/verso.png');
            return;
        }
        // Distribuindo as carta na mao do jogador:
        var handPos = [ {left:350,top:582},{left:400,top:635},{left:457,top:644},
                        {left:537,top:637},{left:597,top:606} ];
        var className = 'hand'+card.position;
        if(player.number == 2){
            handPos[card.position-1].top -= 550;
        }
        if(player.number == 1 || num_bots == 2){
            card.setBackSide();
        }
        $(element_id)
            .animate( handPos[card.position-1] )
            .addClass(className)
            ;
    }else if(card.place == 'hand'){
        // A carta estava na mao (e vai pra mesa):
        if(table.mode == 'tutorial'){ mostraDica() }
        moveCardToTable(card);
        updateManaBar(player);
    }
}

function cardToPos(card){
    var pos = {left:150,top:400}
    pos.left += card.position*110;
    if(card.owner.number == 2){
        pos.top -= 150;
    }
    return pos;
}

function moveCardToTable(card) {
    var target       = cardToPos(card);
    var element_id   = '#'+card.element.id;
    //---------------------------    
    if(card.owner.number == 2){
        card.setBackSide();
    }
    $(element_id)
        .removeClass('hand1 hand2 hand3 hand4 hand5')
        .animate(target,'slow');
    //---------------------------
}

function updateManaBar(player) {
    var barra_id = '#barra'+player.number;
    var str_html = '';
    var properties;
    //----- Atualiza a barra de mana do jogador: ----
    for (var i = 1; i <= player.mana; i++) {
        if(i == 1){
            properties = 'margin-left: 20px';
        }else{
            properties = 'margin-left: -15px';
        }
        str_html += '<img class="mana" style="'+properties+'" src="img/mana.png">';
    };
    $(barra_id).html(str_html);
}

function botaoTransparente(nivel_opacidade) {
    $('#bt_Fim').css('opacity',nivel_opacidade);
}

function turnoJogador(player) {
    if(player.number == 2 || num_bots == 2){
        if(num_bots == 2){
            var str = 'Jogador '+player.number;
            fadeText(str);
            console.log(str+' ----------------------');
        }
        botaoTransparente(0.3);
        if(table.mode == 'tutorial'){
            mostraDica();
            return;
        }
        if(!player.AISystem){
            // Cria inteligencia Artificial no jogador 2:
            player.AISystem = new AISystem(player);
        }
        player.AISystem.makeMove();
    }else{
        botaoTransparente(1);
        fadeText('Sua vez!');
    }
    updateManaBar(player);
}

function showGameMessage(msg) {
    var player = table.getCurrentPlayer();
    if(player.number == 2 || num_bots == 2){
        console.log(msg);
    }else{
        fadeText(msg);
    }
}

function fadeText(msg){
    var DELAY_TIME = 1500;
    if(msg.length > 30){
        DELAY_TIME += 1500;
    }else if(msg.length > 15){
        DELAY_TIME += 500;
    }
    //--------------------------------
    $('#txt_msg')
        .click(stopFade)
        .html(msg)
        .fadeToggle()
        .fadeToggle()
        .fadeToggle()
        .delay(DELAY_TIME)
        .fadeOut()
        ;
    //--------------------------------
}

function stopFade(){
   $('#txt_msg').stop().hide().unbind( "click" ); 
}

function lutando(card1,card2) {
    if(table.mode == 'tutorial' && dica_num == 7){
        return false;
    }
    console.log(card1.name+' lutando com '+card2.name);
    var id_fighter = '#'+card1.element.id;
    var lastPos = cardToPos(card1);
    //---------------------------------------
    var element_id2 = '#'+card2.element.id;
    posX = parseInt( $(element_id2).css('left') );
    posY = parseInt( $(element_id2).css('top') ) ;
    //---------------------------------------
    $(id_fighter)
        .animate({left:posX,top:posY},'fast','easeOutBounce')
        .animate(lastPos,'slow');
    if(table.mode == 'tutorial' && dica_num == 9) mostraDica();
    //---------------------------------------
    return true;
}

function mostraDica() {
    if(dica_num != 8){
        if(dica_num == 9)
            $('.dica').hide()
        else
            $('#dica'+dica_num).hide();
    }
    dica_num++;
    //-----------------------------------
    console.log('dica_num = '+dica_num);
    //-----------------------------------
    $('#dica'+dica_num).show().click(stepTutorial);
}

function fimDeJogo() {
    fadeText('::: FIM DE JOGO ::::');
    setTimeout(mostraVencedor,3000);
}

function mostraVencedor() {
    var nomesJogadores;
    if(num_bots == 2){
        nomesJogadores = ['jogador 1','jogador 2']
    }else{
        nomesJogadores = ['Você','computador']
    }
    fadeText('Vencedor: '+nomesJogadores[winner.number-1]);
    $('#bt_Reinicia').show();
    $('#game_Area').hide();
}