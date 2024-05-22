var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game',
    playerSpeed: 500,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var game = new Phaser.Game(config);
var badGuy;
var jumpSound;
var gunSound;
var jumps = 2;
var restartButton;
var score = 0;
var worldWidht = 9600
var badGuys = [];
var deadSound;
var collectCoinSound;
var winsound;
var life=5;
var lifeText
var resistDuration = 5000;
var immune = false;
var winText
var lastShootTime = 0;
var shootCooldown = 500;

function preload() {
    this.load.image('fon+', 'assets/fon+.png');
    this.load.image('But1', 'assets/Button_1.png');
    this.load.image('ground1', 'assets/1.png');
    this.load.image('ground2', 'assets/2.png');
    this.load.image('ground3', 'assets/3pl.png');
    this.load.image('ground_1', 'assets/13.png');
    this.load.image('ground_2', 'assets/14.png');
    this.load.image('ground_3', 'assets/15.png');
    this.load.image('undeground_1', 'assets/4.png');
    this.load.image('undeground_2', 'assets/5.png');
    this.load.image('ks_1', 'assets/kyst1.png');
    this.load.image('ks_2', 'assets/kyst2.png');
    this.load.image('d_1', 'assets/dub1.png');
    this.load.image('d_2', 'assets/dub2.png');
    this.load.image('d_3', 'assets/dub3.png');
    this.load.image('s_1', 'assets/stone.png');
    this.load.image('sky', 'assets/fon.jpg');
    this.load.image('ground', 'assets/platform1.png');
    this.load.image('star', 'assets/pngwing.com.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude1.png', { frameWidth: 32, frameHeight: 48 });
    this.load.audio('jumpSound', 'assets/pryjok-mario.mp3');
    this.load.audio('dead', 'assets/dead.mp3');
    this.load.audio('money', 'assets/money.mp3');
    this.load.audio('win', 'assets/win.mp3');
    this.load.spritesheet('dude_angry', 'assets/dude_angry.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('win1', 'assets/win1.webp');
    this.load.image('helth', 'assets/helth.png');
    this.load.image('defuse', 'assets/fire.png');
    this.load.audio('gunSound', 'assets/gun.mp3');

}
function create() {
    //
    this.add.tileSprite(0, 0, worldWidht, 1080, "fon+").setOrigin(0, 0);
    platforms = this.physics.add.staticGroup();
    //
    for (var x = 114; x < worldWidht; x = x + 75) {
        console.log(x)
        platforms.create(x, 932, 'ground2').setDisplaySize(75, 79).refreshBody();
    }
    for (var r = 114; r < worldWidht; r = r + 75) {
        console.log(r)
        platforms.create(r, 1009, 'undeground_2').setDisplaySize(75, 79).refreshBody();
    }
    ; kyst = this.physics.add.staticGroup();

    platforms.create(40, 932, 'ground1').setDisplaySize(75, 79).refreshBody();
    platforms.create(40, 1009, 'undeground_1').setDisplaySize(75, 79).refreshBody();
    player = this.physics.add.sprite(100, 450, 'dude').setDepth(5);
    player.setBounce(0.2);
    player.setCollideWorldBounds(false);
    //платформа кусти,дерева,камні
    for (var y = 0; y < worldWidht; y = y + 1920) {
        console.log(y)
        kyst.create(1100 + y, 874, 'ks_1').setScale(1).refreshBody().setDepth(Phaser.Math.Between(1, 10));
        kyst.create(1700 + y, 874, 'ks_2').setScale(1).refreshBody().setDepth(Phaser.Math.Between(1, 10));
        kyst.create(450 + y, 879, 's_1').setScale(1).refreshBody().setDepth(Phaser.Math.Between(1, 10));
        kyst.create(1470 + y, 880, 'd_3').setScale(1).refreshBody().setDepth(Phaser.Math.Between(1, 10));
        kyst.create(600 + y, 801, 'd_1').setScale(1).refreshBody().setDepth(Phaser.Math.Between(1, 10));
        kyst.create(2000 + y, 810, 'd_2').setScale(1).refreshBody().setDepth(Phaser.Math.Between(1, 10));
        //
        platforms.create(1674 + 78 + 78 + y, 754, 'ground_3').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        platforms.create(1674 + 78 + y, 754, 'ground_2').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        platforms.create(1674 + y, 754, 'ground_1').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        kyst.create(1750 + y, 645, 'd_2').setScale(1).refreshBody().setDepth(Phaser.Math.Between(1, 10));
        kyst.create(1670 + y, 713, 's_1').setScale(1).refreshBody().setDepth(Phaser.Math.Between(1, 10));
        //
        platforms.create(1196 + 78 + 78 + 78 + y, 614, 'ground_3').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        platforms.create(1196 + 78 + 78 + y, 614, 'ground_2').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        platforms.create(1196 + 78 + y, 614, 'ground_2').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        platforms.create(1196 + y, 614, 'ground_1').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        kyst.create(1300 + y, 568, 'ks_1').setScale(1).refreshBody().setDepth(Phaser.Math.Between(1, 10));
        //
        platforms.create(798 + 78 + 78 + 78 + y, 714, 'ground_3').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        platforms.create(798 + 78 + 78 + y, 714, 'ground_2').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        platforms.create(798 + 78 + y, 714, 'ground_2').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        platforms.create(798 + y, 714, 'ground_1').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        kyst.create(850 + y, 673, 's_1').setScale(1).refreshBody().setDepth(Phaser.Math.Between(1, 10));
        //
        platforms.create(422 + 78 + 78 + 78 + 78 + y, 534, 'ground_3').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        platforms.create(422 + 78 + 78 + 78 + y, 534, 'ground_2').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        platforms.create(422 + 78 + 78 + y, 534, 'ground_2').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        platforms.create(422 + 78 + y, 534, 'ground_2').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        platforms.create(422 + y, 534, 'ground_1').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        kyst.create(600 + y, 488, 'ks_1').setScale(1).refreshBody().setDepth(Phaser.Math.Between(1, 10));
        kyst.create(470 + y, 494, 'd_3').setScale(1).refreshBody().setDepth(Phaser.Math.Between(1, 10));
        //
        platforms.create(222 + 78 + y, 384, 'ground_3').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        platforms.create(222 + y, 384, 'ground_1').setScale(1).refreshBody().setDisplaySize(78, 55).refreshBody();
        kyst.create(250 + y, 275, 'd_2').setScale(1).refreshBody().setDepth(Phaser.Math.Between(1, 10));
        //
    }

    win = this.physics.add.group();
    win.create(9525, 600, 'win1').setDisplaySize(70, 70);

    lifeText = this.add.text(400, 100, showlife(), { fontSize: '32px', fill: '#000' }).setScrollFactor(0);

    lifeBar = document.createElement('div');
    lifeBar.style.position = 10,10;
    lifeBar.style.top = '0';
    lifeBar.style.left = '0';
    lifeBar.innerHTML = showlife();
    //document.body.appendChild(lifeBar);

    this.cameras.main.setBounds(0, 0, worldWidht, 1080);
    this.physics.world.setBounds(0, 0, worldWidht, 1080);
    this.cameras.main.startFollow(player);

    restartButton = this.add.image(100, 120, 'But1')
        .setDepth(20)
        .setInteractive()
        .setScrollFactor(0)
        .on('pointerdown', function () {
            restartGame();
        });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();
    stars = this.physics.add.group({
        key: 'star',
        repeat: 135,
        setXY: { x: 180, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    bombs = this.physics.add.group();

    scoreText = this.add.text(200, 100, 'score: 0', { fontSize: '32px', fill: '#000' }).setScrollFactor(0);

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.add.collider(player, badGuys, hitBomb, null, this);
    jumpSound = this.sound.add('jumpSound');
    gunSound = this.sound.add('gunSound');
    deadSound = this.sound.add('dead');
    collectCoinSound = this.sound.add('money');
    winsound = this.sound.add('win')
    this.physics.add.collider(win, platforms);
    this.physics.add.collider(player, win, win_all, null, this);
    badGuy = this.physics.add.sprite(1140, 11450, 'dude_angry').setDepth(4);
    //badGuy = this.physics.add.group();
    badGuy.setBounce(0.2);
    badGuy.setCollideWorldBounds(true);
    badGuy.setGravityY(0);
    this.physics.add.collider(badGuy, platforms);
    this.physics.add.collider(player, badGuy, hitBomb, null, this);

    this.anims.create({
        key: 'badGuyLeft',
        frames: this.anims.generateFrameNumbers('dude_angry', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'badGuyTurn',
        frames: [{ key: 'dude_angry', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'badGuyRight',
        frames: this.anims.generateFrameNumbers('dude_angry', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    for (let i = 0; i < worldWidht / 1920; i++) {

        let badGuy = this.physics.add.sprite(1140 + i * 1920, 450, 'dude_angry').setDepth(8);
        badGuy.setBounce(0.2);
        badGuy.setCollideWorldBounds(true);
        badGuy.setGravityY(0);
        this.physics.add.collider(badGuy, platforms);
        this.physics.add.collider(player, badGuy, hitBomb, null, this);

        badGuys.push(badGuy);
    }
    defuse = this.physics.add.staticGroup();

}

function update() {
    if (gameOver) {
        return;
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
        jumpSound.play();
        jumps--;
    }
    if (cursors.up.isUp && player.body.touching.down) {
        jumps = 2;
    }
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    player.x = Phaser.Math.Clamp(player.x, 0, worldWidht - player.width);
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
        jumpSound.play();
    }
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    if (Math.random() < 0.02) {
        badGuy.setVelocityX(Phaser.Math.Between(-200, 200));
    }
    this.physics.world.collide(player, badGuy, function () {
        endGame(false);
    });
    if (badGuy.body.velocity.x > 0) {
        badGuy.anims.play('badGuyRight', true);
    } else if (badGuy.body.velocity.x < 0) {
        badGuy.anims.play('badGuyLeft', true);
    } else {
        badGuy.anims.play('badGuyTurn');
    }
    if (stars.countActive(true) === 0) {
        endGame(true);
    }
    for (let i = 0; i < badGuys.length; i++) {
        if (Math.random() < 0.02) {
            badGuys[i].setVelocityX(Phaser.Math.Between(-200, 200));
        }
        this.physics.world.collide(player, badGuys[i], function () {
            endGame(false);
        });
        if (badGuys[i].body.velocity.x > 0) {
            badGuys[i].anims.play('badGuyRight', true);
        } else if (badGuys[i].body.velocity.x < 0) {
            badGuys[i].anims.play('badGuyLeft', true);
        } else {
            badGuys[i].anims.play('badGuyTurn');
        }
    }
    lifeBar.innerHTML = showlife();


    if (cursors.down.isDown && this.time.now > lastShootTime + shootCooldown) {
        shoot(this);
        lastShootTime = this.time.now;
    }
}
function shoot(scene) {
    if (scene.time.now > lastShootTime + shootCooldown) {
        var x = player.x;
        var y = player.y + 5;
        var defuse = scene.physics.add.sprite(x, y, 'defuse').setDisplaySize(30, 10)
            .setDepth(5);
        gunSound.play();
        if (cursors.left.isDown) {
            defuse.setVelocityX(-1000);
            defuse.setFlipX(true);
        } else {
            defuse.setVelocityX(1000);
            defuse.setFlipX(false);
        }
        scene.physics.add.collider(badGuys, defuse, function (badGuys, defuse) {
            badGuys.disableBody(true, true);
            defuse.disableBody(true, true);
        }, null, scene);
        lastShootTime = scene.time.now;
    }
}
function endGame(isWin) {
    this.physics.pause();
    if (isWin) {
        winText = this.add.text(config.width / 2 - 100, config.height / 2 - 50, 'You Win!', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
    } else {
        player.setTint(0xff0000);
        player.anims.play('turn');
        winText = this.add.text(config.width / 2 - 100, config.height / 2 - 50, 'You Lose!', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
    }
    gameOver = true;
    restartButton.visible = true;
}

function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    collectCoinSound.play();
    var x = Phaser.Math.Between(0, config.width);
    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });
        for (var i = 0; i < 12; i++) {
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var newStar = stars.create(x, 0, 'star');
            newStar.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        }
        for (var i = 0; i < bombs.children.entries.length; i++) {
            bombs.children.entries[i].destroy();
        }
    }
}

function decreaseLife() {
    life--;
    lifeline.setText(showlife());
}

function hitBomb(player, bomb) {
    if (!immune) {
        life--;
        lifeText.setText(showlife());
        if (life === 0) {
            winText = this.add.text(config.width / 2 - 100, config.height / 2 - 50, 'You Lose!', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
            player.setTint(0xff0000);
            this.physics.pause();
            deadSound.play();
            //endGame(false);
            //this.physics.pause();
            //gameOver = true;
        } else {
            immune = true;
            this.time.delayedCall(resistDuration, function() {
                immune = false;
            }, [], this);
        }
    }
}

function win_all(player, win1) {
    this.physics.pause();
    player.setTint(0xFF00);
    player.anims.play('turn');
    gameOver = true;
    winsound.play();
    var winText = this.add.text(config.width / 2 - 100, config.height / 2 - 50, 'You win!', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
}

function showlife(){
    var lifeline='';
    for(var i = 0; i < life; i++){
        lifeline += '❤'
    }
    return lifeline;
}

function restartGame() {
    location.reload();
}
