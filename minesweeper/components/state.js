import { createStartModal } from './start.js';
import { fieldParam, intervalId } from '../app.js';

//Game Over Modal
export function gameOver() {
  const blackout = document.querySelector('.blackout');
  const element = document.createElement('div');
  element.innerHTML = `
        <div class="modal-result">
            <h2 class="modal-result__status">Boooom!</h2>
            <h2 class="modal-result__info">Game over. Try again</h2>
            <button class="restart">New Game</button>
        </div>
  `;
  element.classList.add('overlay-result');
  document.body.firstChild.remove();
  document.body.prepend(element);
  blackout.classList.add('active');

  //Restart Game
  const restart = document.querySelector('.restart');
  restart.addEventListener('click', () => {
    createStartModal();
  });
}

//Successful Game
export function winGame() {
  const oneItem = document.querySelectorAll('.square');
  const mines = document.querySelector('.how-mines__tablo');
  let count = 0;

  oneItem.forEach((item) => {
    if (Number(item.textContent) >= 0 && item.classList.contains('open')) {
      ++count;
    }
  });

  if (
    count === fieldParam.size * fieldParam.size - fieldParam.mines ||
    (fieldParam.countClick === 1 && mines.textContent == 1)
  ) {
    clearInterval(intervalId);
    SuccessfulGameModal();
  }

  // Successful Game Modal
  function SuccessfulGameModal() {
    const blackout = document.querySelector('.blackout');
    const timer = document.querySelector('.timer');
    const element = document.createElement('div');
    element.innerHTML = `
        <div class="modal-result">
            <h2 class="modal-result__status">Hooray! Are you Winner!</h2>
            <h2 class="modal-result__info">You found all mines in ${timer.textContent} seconds 
            and ${fieldParam.countClick} moves!</h2>
            <button class="restart">New Game</button>
            <audio class="audio-winner" src="./accets/audio/winner.mp3"></audio>
        </div>
  `;
    element.classList.add('overlay-result');
    document.body.firstChild.remove();
    document.body.prepend(element);
    blackout.classList.add('active');
    const audio = document.querySelector('.audio-winner');
    audio.play();

    //Save Result
    fieldParam.resultTop.push({
      speed: timer.textContent,
      mines: fieldParam.mines,
    });

    localStorage.setItem('result-top', JSON.stringify(fieldParam.resultTop));
    let getResultsFromLocalStorage = JSON.parse(
      localStorage.getItem('result-top')
    );

    //Restart Game
    const restart = document.querySelector('.restart');
    restart.addEventListener('click', () => {
      createStartModal();
    });
  }
}
