var gameCards = [
    {
    	attack        : 4,
    	defense       : 3,
    	isDefender    : false,
    	canAttack     : false,
    	image         : "img/cards/agustinia.png",
        name          : 'Agustinia',
    	cost          : 7
    },
    {
    	attack        : 3,
    	defense       : 6,
    	isDefender    : true,
    	canAttack     : false,
    	image         : "img/cards/anquilossauro.png",
        name          : 'Anquilossauro',
    	cost          : 8
    },
    {
    	attack        : 1,
    	defense       : 2,
    	isDefender    : false,
    	canAttack     : true,
    	image         : "img/cards/arqueopterix.png",
        powers        : "m+2",
        name          : 'Arqueopterix',
    	cost          : 1
    },
    {
    	attack        : 3,
    	defense       : 5,
    	isDefender    : false,
    	canAttack     : false,
    	image         : "img/cards/braquiosaurus.png",
        name          : 'Braquiosaurus',
    	cost          : 8
    },
    {
    	attack        : 7,
    	defense       : 5,
    	isDefender    : false,
    	canAttack     : false,
    	image         : "img/cards/carnotauro.png",
        name          : 'Carnotauro',
    	cost          : 9
    },
    {
    	attack        : 1,
    	defense       : 1,
    	isDefender    : false,
    	canAttack     : true,
    	image         : "img/cards/compsognato.png",
        name          : 'Compsognato',
        powers        : "sh,m+1",
    	cost          : 1
    },
    {
    	attack        : 2,
    	defense       : 3,
    	isDefender    : true,
    	canAttack     : false,
    	image         : "img/cards/concavenator.png",
        name          : 'Concavenator',
        powers        : "a+1,sh",
    	cost          : 2
    },
    {
    	attack        : 3,
    	defense       : 2,
    	isDefender    : false,
    	canAttack     : false,
    	image         : "img/cards/dilofossauro.png",
        name          : 'Dilofossauro',
    	cost          : 3
    },
    {
    	attack        : 2,
    	defense       : 6,
    	isDefender    : true,
    	canAttack     : false,
    	image         : "img/cards/dimetrodon.png",
        name          : 'Dimetrodon',
    	cost          : 8
    },
    {
    	attack        : 2,
    	defense       : 3,
    	isDefender    : true,
    	canAttack     : true,
    	image         : "img/cards/diplocaulus.png",
        name          : 'Diplocaulus',
        powers        : "m+4,a+1,da",
    	cost          : 5
    },
    {
    	attack        : 5,
    	defense       : 4,
    	isDefender    : false,
    	canAttack     : false,
    	image         : "img/cards/espinossauro.png",
        name          : 'Espinossauro',
    	cost          : 7
    },
    {
    	attack        : 0,
    	defense       : 9,
    	isDefender    : true,
    	canAttack     : false,
    	image         : "img/cards/estegossauro.png",
        name          : 'Estegossauro',
        powers        : "fz",
    	cost          : 6
    },
    {
    	attack        : 4,
    	defense       : 4,
    	isDefender    : false,
    	canAttack     : false,
    	image         : "img/cards/estiracossauro.png",
        name          : 'Estiracossauro',
    	cost          : 4
    },
    {
    	attack        : 3,
    	defense       : 2,
    	isDefender    : false,
    	canAttack     : true,
    	image         : "img/cards/gallimimus.png",
        name          : 'Gallimimus',
    	cost          : 2
    },
    {
    	attack        : 6,
    	defense       : 1,
    	isDefender    : false,
    	canAttack     : false,
    	image         : "img/cards/kuehnossauro.png",
        name          : 'Kuehnossauro',
    	cost          : 3
    },
    {
    	attack        : 1,
    	defense       : 3,
    	isDefender    : false,
    	canAttack     : false,
    	image         : "img/cards/logisquama.png",
        name          : 'Logisquama',
        powers        : "a+3,d+2,da",
    	cost          : 0
    },
    {
    	attack        : 4,
    	defense       : 0,
    	isDefender    : false,
    	canAttack     : true,
    	image         : "img/cards/mosassauro.png",
        name          : 'Mosassauro',
    	cost          : 4
    },
    {
    	attack        : 3,
    	defense       : 3,
    	isDefender    : true,
    	canAttack     : false,
    	image         : "img/cards/oviraptor.png",
        name          : 'Oviraptor',
    	cost          : 4
    },
    {
    	attack        : 1,
    	defense       : 2,
    	isDefender    : false,
    	canAttack     : false,
    	image         : "img/cards/paquicefalossauro.png",
        name          : 'Paquicefalossauro',
        powers        : "a+2,d+1,da,sh",
    	cost          : 2
    },
    {
    	attack        : 2,
    	defense       : 1,
    	isDefender    : false,
    	canAttack     : false,
    	image         : "img/cards/parassaurolofo.png",
        name          : 'Parassaurolofo',
        powers        : "d+3,fz,m+5",
    	cost          : 1
    },
    {
    	attack        : 1,
    	defense       : 3,
    	isDefender    : false,
    	canAttack     : false,
    	image         : "img/cards/plesiossauro.png",
        name          : 'Plesiossauro',
        powers        : "a+2,d+1,da",
    	cost          : 2
    },
    {
    	attack        : 1,
    	defense       : 2,
    	isDefender    : true,
    	canAttack     : false,
    	image         : "img/cards/psitacosaur.png",
        name          : 'Psitacosaur',
        powers        : "sh,fz",
    	cost          : 1
    },
    {
    	attack        : 2,
    	defense       : 2,
    	isDefender    : false,
    	canAttack     : true,
    	image         : "img/cards/pterosaur.png",
        name          : 'Pterosaur',
        powers        : "sh,da",
    	cost          : 2
    },
    {
    	attack        : 5,
    	defense       : 3,
    	isDefender    : true,
    	canAttack     : true,
    	image         : "img/cards/t-rex.png",
        name          : 'T-rex',
    	cost          : 9
    }
];

var tutorialCards = [
    {
        attack        : 1,
        defense       : 2,
        isDefender    : true,
        canAttack     : false,
        image         : "img/cards/psitacosaur.png",
        name          : 'Psitacosaur',
        cost          : 1
    },
    {
        attack        : 1,
        defense       : 1,
        isDefender    : false,
        canAttack     : true,
        image         : "img/cards/compsognato.png",
        name          : 'Compsognato',
        cost          : 1
    },
    {
        attack        : 1,
        defense       : 3,
        isDefender    : false,
        canAttack     : false,
        image         : "img/cards/logisquama.png",
        name          : 'Logisquama',
        cost          : 0
    },
    {
        attack        : 1,
        defense       : 2,
        isDefender    : false,
        canAttack     : false,
        image         : "img/cards/paquicefalossauro.png",
        name          : 'Paquicefalossauro',
        cost          : 2
    },
    {
        attack        : 3,
        defense       : 2,
        isDefender    : false,
        canAttack     : true,
        image         : "img/cards/gallimimus.png",
        name          : 'Gallimimus',
        cost          : 2
    }
];
