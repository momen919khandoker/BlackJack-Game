
let blackjackGame={
    'you':{'span':'#your-score','div':'#your-div','score':0},
    'dealer':{'span':'#dealer-score','div':'#dealer-div','score':0},
    'cards':['2.png','3.png','4.png','5.png','6.png','7.png','8.png','9.png','10.png','J.png','K.png','Q.png','A.png'],
    'cardsMap':{'2.png':2,'3.png':3,'4.png':4,'5.png':5,'6.png':6,'7.png':7,'8.png':8,'9.png':9,'10.png':10,'J.png':10,'K.png':10,'Q.png':10,'A.png':[1,11]},
    'isStand':false,
    'turnsOver':false,
    'wins':0,
    'losses':0,
    'draws':0,
}

const YOU=blackjackGame['you'];
const DEALER=blackjackGame['dealer'];
const hitSound=new Audio('sounds/swish.m4a');
const winSound=new Audio('sounds/cash.mp3');
const loseSound=new Audio('sounds/aww.mp3');

document.querySelector('#hit').addEventListener('click',blackjackHit);
document.querySelector('#stand').addEventListener('click',blackjackStand);
document.querySelector('#deal').addEventListener('click',blackjackDeal);

function blackjackHit(){
    if(blackjackGame['isStand']==false){
        let img=randomImg();
        showImg(YOU,img);
        updateScore(YOU,img);
        showScore(YOU);
    }
    if(YOU['score']>21){
        blackjackGame['isStand']=true;
    }
}

async function blackjackStand(){
    if(YOU['score']>21){
        while(DEALER['score']<2){
            let img=randomImg();
            showImg(DEALER,img);
            updateScore(DEALER,img);
            showScore(DEALER);
            await sleep(1000);
        }
    }else {
        while(DEALER['score']<16){
            let img=randomImg();
            showImg(DEALER,img);
            updateScore(DEALER,img);
            showScore(DEALER);
            await sleep(1000);
        }
    }
    showWinner();
    blackjackGame['isStand']=true;
    blackjackGame['turnsOver']=true;
}

function blackjackDeal(){
    if(blackjackGame['turnsOver']==true){
        let yourImage=document.querySelector(YOU['div']).querySelectorAll('img');
        let dealerImage=document.querySelector(DEALER['div']).querySelectorAll('img');

        for(let i=0;i<yourImage.length;i++){
            yourImage[i].remove();
        }
        for(let i=0;i<dealerImage.length;i++){
            dealerImage[i].remove();
        }

        YOU['score']=0;
        DEALER['score']=0;

        document.querySelector(YOU['span']).textContent=YOU['score'];
        document.querySelector(YOU['span']).style.color='white';
        document.querySelector(DEALER['span']).textContent=DEALER['score'];
        document.querySelector(DEALER['span']).style.color='white';
        document.querySelector('#play').textContent="Let's play";
        document.querySelector('#play').style.color='black';
    }
    blackjackGame['isStand']=false;
    blackjackGame['turnsOver']=false;
}

function randomImg(){
    let random=Math.floor(Math.random()*13);
    return blackjackGame['cards'][random];
}

function showImg(active,img)
{
    let cardImage=document.createElement('img');
    cardImage.src='images/'+img;
    document.querySelector(active['div']).appendChild(cardImage);
    hitSound.play();
}

function updateScore(active,img){
    if(img=='A.png'){
        if(active['score']+blackjackGame['cardsMap'][img][1]<=21){
            active['score']+=blackjackGame['cardsMap'][img][1];
        }else{
            active['score']+=blackjackGame['cardsMap'][img][0];
        }
    }else {
        active['score']+=blackjackGame['cardsMap'][img];
    }
}

function showScore(active){
    if(active['score']>21){
        document.querySelector(active['span']).textContent="BUST!";
        document.querySelector(active['span']).style.color='red';
    }else {
        document.querySelector(active['span']).textContent=active['score'];
    }
}

function computeWinner(){
    let winner;
    if(YOU['score']<=21){
        if(YOU['score']>DEALER['score'] || DEALER['score']>21){
            winner=YOU;
            blackjackGame['wins']++;
        }else if(YOU['score']==DEALER['score']){
            winner=0;
            blackjackGame['draws']++;
        }else {
            winner=DEALER;
            blackjackGame['losses']++;
        }
    }else if(YOU['score']>21 && DEALER['score']<=21){
        winner=DEALER;
        blackjackGame['losses']++;
    }else if(YOU['score']>21 && DEALER['score']>21){
        winner=0;
        blackjackGame['draws']++;
    }
    return winner;
}

function showWinner(){
    let winner=computeWinner();
    if(winner==YOU){
        document.querySelector('#play').textContent="You Win!";
        document.querySelector('#play').style.color='green';
        winSound.play();
        document.querySelector('#wins').textContent=blackjackGame['wins'];
    }else if(winner==DEALER){
        document.querySelector('#play').textContent="You Losses!";
        document.querySelector('#play').style.color='red';
        loseSound.play();
        document.querySelector('#losses').textContent=blackjackGame['losses'];
    }
    else {
        document.querySelector('#play').textContent="You drew!";
        document.querySelector('#play').style.color='yellow';
        document.querySelector('#draws').textContent=blackjackGame['draws'];
    }
}

function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
}