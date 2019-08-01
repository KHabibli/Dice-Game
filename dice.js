document.querySelector('.card').style.display = 'none';


const setScore = document.querySelector('#setScore');
const fplayer = document.getElementById('fplayer');
const splayer = document.getElementById('splayer');
const btn = document.getElementById('throw');
const game = document.querySelector('.card-footer');
const winner = document.getElementById('winner');
const resetBtn = document.getElementById('reset');


document.getElementById('play').addEventListener('click' , function(){
    if(setScore.value == ''){
        showAlert('Enter a number as a score');
    }
    if(fplayer.value == ''){
        showAlert('Enter a name for first player');
    }
    if(splayer.value == ''){
        showAlert('Enter a name for second player');
    }
    if(setScore.value !== '' && fplayer.value !== '' && splayer.value !== ''){
        clearAlert();
        document.getElementById('start').style.display = 'none';
        document.querySelector('.card').style.display = 'block';
    }


    
    btn.addEventListener('click' , throwDices);

    let score1 = 0 , score2 = 0;
    document.getElementById('player1').innerHTML = `<h3>${fplayer.value}</h3>`;
    document.getElementById('player2').innerHTML = `<h3>${splayer.value}</h3>`;

    function throwDices(){
        const score = document.getElementById('setScore').value;

        const dot1 = Math.ceil(Math.random()*6);
        const dice1 = document.getElementById('dice1');
        dice1.className = `dice dice-${dot1}`;

        const dot2 = Math.ceil(Math.random()*6);
        const dice2 = document.getElementById('dice2');
        dice2.className = `dice dice-${dot2}`;

        if(dot1 > dot2){
            score1++;
        }else if(dot1 < dot2){
            score2++;
        }
        document.getElementById('score').value = `${score1} - ${score2}`

        if(score1 == score){
            storeInLS(fplayer.value);
            winnerPlayer(fplayer.value);
        }else if(score2 == score){
            storeInLS(splayer.value);
            winnerPlayer(splayer.value);
        }
    }

    game.addEventListener('click' , function(e){
        if(e.target.className === 'playAgain'){
            window.location.reload();
        }
    })


    function winnerPlayer(name){
        let t = 6;
        var x = setInterval(function(){
            winner.innerHTML = `<h3>Winner is ${name}!! Game will start over in ${t-1} seconds</h3>`;
            t--;
            if(t <= 0){
                clearInterval(x);
                window.location.reload()
            }
        },1000);
            btn.style.display = 'none';
    }

    function storeInLS(name){
        let names,newOne = {name: name , wins: 1};
        if(localStorage.getItem('names') === null){
            names = [];
        }else{
            names = JSON.parse(localStorage.getItem('names'));
        }

        if(names != []){
            let index = 0;
            while(index < names.length){
                if(names[index].name === name){
                    names[index].wins += 1;
                    break;
                }
                index++;
            }
            if(index == names.length){
                names.push(newOne);
            }
        }else{
            names.push(newOne);
        }
        localStorage.setItem('names' , JSON.stringify(names));
        
    }

    game.addEventListener('click' , function(e){
        if(e.target.className === 'playAgain'){
            window.location.reload();
        }
    })

    function showAlert(text){
        clearAlert();
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger mt-2';
        alert.appendChild(document.createTextNode(text));

        const parent = document.querySelector('.container');
        const child = document.querySelector('.card');
        parent.insertBefore(alert,child);
        setTimeout(() => {
            clearAlert();
        },2000);
    }

    function clearAlert(){
        let alert = document.querySelectorAll('.alert');
        if(alert.length == 3){
            alert[0].remove();
            alert[1].remove();
            alert[2].remove();
        }
    }
})

document.addEventListener('DOMContentLoaded' , leaderboard);

function leaderboard(){
    let names;
    if(localStorage.getItem('names') === null){
        names = [];
    }else{
        names = JSON.parse(localStorage.getItem('names'));
        names.sort(function(a, b){
            return b.wins-a.wins;
        })
        localStorage.setItem('names' , JSON.stringify(names));
        showLeaderboard();
    }
}
leaderboard();

function showLeaderboard(){
    const lb = document.getElementById('leaderboard');
    let names = JSON.parse(localStorage.getItem('names'));
    let rank = 0;
    let output = `<table class="table table-striped mt-3">
    <thead>
      <tr>
      <th scope="col">Rank</th>
        <th scope="col">Player</th>
        <th scope="col">Wins</th>
      </tr>
    </thead> <tbody>`;
    names.forEach(function(player,index,arr){
        if(index != 0){
            if(arr[index].wins != arr[index-1].wins){
                rank++;
            }
          }else{
              rank++;
          }
        output += `<tr>
        <td>${rank}</td>
        <td>${player.name}</td>
        <td>${player.wins}</td>
      </tr>`
    });
    output += `</tbody></table>`;
    lb.innerHTML = output;

}

resetBtn.addEventListener('click' , resetBoard);

function resetBoard(){
    if(confirm('You will delete all data in local storage. Are you sure??') === true){
        localStorage.clear();
        }        
        window.location.reload();
    }
    
