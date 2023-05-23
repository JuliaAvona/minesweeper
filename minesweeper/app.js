import { createField, whatTheLevel } from './components/field.js';
import { createStartModal } from './components/start.js';
import { gameOver, winGame } from './components/state.js';

export const fieldParam = {
  size: 10,
  width: '500px',
  mines: 10,
  countBomb: 10,
  countClick: 0,
  resultTop: [],
};

export const Mine = 'M';
export let intervalId;

createStartModal();

//Create Game Field
class gameRender {
  constructor(size) {
    this.size = size;
  }

  render() {
    const element = document.createElement('section');
    element.innerHTML = `
    <h1 class="title">Pirate Minesweeper</h1>
    <div class="playing-field__buttons">
        <button class="toggle-themes">Dark</button>
        <button class="restart-game">Restart</button>
        <button class="results">Results</button>
    </div>
    <div class="playing-field">
        <div class="control-panel">
            <div class="mines">🏴‍☠️ ${fieldParam.countBomb}</div>
            <div class="clicks">👣 ${fieldParam.countClick}</div>
            <div>⏳ <span class="timer">0</span></div>
        </div>
        <div class="squares" id="board"></div>
    </div>
    <audio class="audio-mine" src="./accets/audio/mine.mp3"></audio>
    <audio class="audio-open" src="./accets/audio/open.mp3"></audio>
    <audio class="audio-flag" src="./accets/audio/flag.mp3"></audio>
    <div class="table-result hidden">
        <table class="table">
            <tbody>
                <tr>
                    <td>POSITION</td>
                    <td>SPEED</td>
                    <td>MINES</td>
                </tr>
                <tr>
                    <td>1.</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>2.</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>3.</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>4.</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>5.</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>6.</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>7.</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>8.</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>9.</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>10.</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
            </tbody>
        </table>
    </div>
  `;

    element.classList.add('game-field');
    document.body.prepend(element);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const oneSquare = document.createElement('div');
        oneSquare.classList.add('square');
        document.querySelector('.squares').append(oneSquare);
      }
    }

    const gameNumber = createField(fieldParam.size, fieldParam.mines);
    document.querySelector('.squares').style.width = fieldParam.width;
    const oneSquare = document.querySelectorAll('.square');
    const tabloMines = document.querySelector('.mines');
    const clickResult = document.querySelector('.clicks');

    oneSquare.forEach((item, i) => (item.textContent = gameNumber[i]));

    oneSquare.forEach((btn, index) => {
      winGame();

      btn.addEventListener('click', (event) => {
        function clickToButtonNumber() {
          if (Number(btn.textContent) === 0) {
            btn.textContent = '';
            btn.classList.add('open');
            clickResult.textContent =
              '👣 ' + (fieldParam.countClick = fieldParam.countClick + 1);
            const audio = document.querySelector('.audio-open');
            if (audio) audio.play();

            // Automatically open adjacent squares
            openAdjacentSquares(index);
            winGame();
          } else if (Number(btn.textContent) > 0) {
            btn.style.color = getColorByNumber(Number(btn.textContent));
            clickResult.textContent =
              '👣 ' + (fieldParam.countClick = fieldParam.countClick + 1);
          }
          btn.classList.add('open');
          btn.classList.remove('flag');
          btn.classList.remove('question');
          const audio = document.querySelector('.audio-open');
          if (audio) audio.play();
          winGame();
        }

        if (Number(btn.textContent) >= 0) {
          clickToButtonNumber();
        } else if (fieldParam.countClick === 0 && btn.textContent === 'M') {
          let newField = createField(fieldParam.size, fieldParam.mines);
          while (newField[index] === 'M') {
            newField = createField(fieldParam.size, fieldParam.mines);
          }
          gameNumber.splice(0, gameNumber.length, ...newField);
          oneSquare.forEach((item, i) => (item.textContent = newField[i]));
          clickToButtonNumber();
        } else if (btn.textContent === 'M') {
          btn.classList.remove('flag');
          btn.classList.remove('question');
          btn.classList.add('mine');
          const audio = document.querySelector('.audio-mine');
          if (audio) audio.play();
          oneSquare.forEach((item) => {
            item.classList.add('open');
            if (item.textContent === 'M') {
              item.classList.add('mine');
            } else if (item.textContent === '0') {
              item.textContent = '';
            } else if (Number(item.textContent) > 0) {
              item.style.color = getColorByNumber(Number(item.textContent));
            }
          });

          btn.style.backgroundColor = 'red';
          clearInterval(intervalId);
          setTimeout(gameOver, 2500);
        }
      });

      btn.addEventListener('contextmenu', (event) => {
        event.preventDefault();

        if (!btn.classList.contains('open')) {
          if (
            !btn.classList.contains('flag') &&
            !btn.classList.contains('question')
          ) {
            btn.classList.add('flag');
            tabloMines.textContent = '🏴‍☠️ ' + --fieldParam.countBomb;
            const audio = document.querySelector('.audio-flag');
            if (audio) audio.play();
          } else if (
            btn.classList.contains('flag') &&
            !btn.classList.contains('question')
          ) {
            btn.classList.remove('flag');
            btn.classList.add('question');
            tabloMines.textContent = '🏴‍☠️ ' + ++fieldParam.countBomb;
          } else if (
            !btn.classList.contains('flag') &&
            btn.classList.contains('question')
          ) {
            btn.classList.remove('question');
          }
        }
      });
      //savePlayingField();
    });

    function openAdjacentSquares(index) {
      const size = fieldParam.size;
      const oneSquare = document.querySelectorAll('.square');
      const visited = new Array(size * size).fill(false);
      const queue = [index];

      while (queue.length > 0) {
        const currIndex = queue.shift();
        const currBtn = oneSquare[currIndex];

        if (!visited[currIndex]) {
          visited[currIndex] = true;

          // Check if the current square is adjacent to any mines
          if (Number(currBtn.textContent) === 0) {
            currBtn.textContent = '';
            currBtn.classList.add('open');
            const audio = document.querySelector('.audio-open');
            if (audio) audio.play();

            // Get adjacent squares
            const adjacentIndices = getAdjacentIndices(currIndex, size);

            // Add adjacent squares to the queue for processing
            queue.push(...adjacentIndices);
          } else if (Number(currBtn.textContent) > 0) {
            currBtn.style.color = getColorByNumber(Number(currBtn.textContent));
            currBtn.classList.add('open');
            const audio = document.querySelector('.audio-open');
            if (audio) audio.play();
          }
        }
      }
    }

    function getColorByNumber(number) {
      const colors = [
        '#4caf50',
        '#00BCD4',
        '#FF9800',
        '#9C27B0',
        '#9E9E9E',
        '#795548',
        '#FFC107',
        '#607D8B',
      ];
      return colors[number - 1] || '';
    }

    function getAdjacentIndices(index, size) {
      const indices = [];
      const row = Math.floor(index / size);
      const col = index % size;

      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          if (
            i >= 0 &&
            i < size &&
            j >= 0 &&
            j < size &&
            !(i === row && j === col)
          ) {
            indices.push(i * size + j);
          }
        }
      }
      return indices;
    }

    //Dark/Light themes
    const toggleTheme = document.querySelector('.toggle-themes');

    toggleTheme.addEventListener('click', () => {
      document.body.classList.toggle('dark');

      if (document.body.classList.contains('dark')) {
        toggleTheme.textContent = 'White';
      } else {
        toggleTheme.textContent = 'Dark';
      }
    });

    //Restart Game
    const restart = document.querySelector('.restart-game');
    restart.addEventListener('click', () => {
      createStartModal();
    });

    //Result Game Table
    const resultButton = document.querySelector('.results');
    const playingFieldHTML = document.querySelector('.playing-field');
    const resultTable = document.querySelector('.table-result');

    resultButton.addEventListener('click', () => {
      if (resultButton.textContent === 'Results') {
        resultButton.textContent = 'BACK';
        resultButton.style.background = 'rgb(0 188 212 / 70%)';
      } else if (resultButton.textContent === 'BACK') {
        resultButton.textContent = 'Results';
        resultButton.style.background = '#fbf8c5;';
      }

      playingFieldHTML.classList.toggle('hidden');
      resultTable.classList.toggle('hidden');

      // Get the table body element
      const tbody = document.querySelector('.table-result table tbody');

      // Get the rows of the table body
      const rows = tbody.querySelectorAll('tr');

      fieldParam.resultTop.sort((a, b) => a.speed - b.speed);
      fieldParam.resultTop = fieldParam.resultTop.slice(0, 10);
      // Iterate over the array and update the table rows with values
      fieldParam.resultTop.forEach((data, index) => {
        if (index + 1 < rows.length) {
          // Skip the first row
          const row = rows[index + 1]; // Start from the second row
          const cells = row.querySelectorAll('td');

          // Update the table cells with values from the array
          cells[0].textContent = index + 1 + '.';
          cells[1].textContent = data.speed;
          cells[2].textContent = data.mines;
        }
      });
    });
  }
}

export function createGameField(size) {
  new gameRender(size).render();
}

//Timer
export function showTime() {
  const startTime = new Date();

  intervalId = setInterval(() => {
    const currentTime = new Date();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

    document.querySelector('.timer').textContent = elapsedSeconds;
  }, 1000);
}

//Save Best Score in LocalStorage
window.addEventListener('DOMContentLoaded', function () {
  let getResultsFromLocalStorage = JSON.parse(
    localStorage.getItem('result-top')
  );
  if (getResultsFromLocalStorage) {
    fieldParam.resultTop = [...getResultsFromLocalStorage];
  }
});

// window.onload = function () {
//   const savedPlayingField = localStorage.getItem('playingField');

//   console.log('window onload!!!');

//   if (savedPlayingField) {
//     const modal = document.querySelector('.overlay');
//     const blackout = document.querySelector('.blackout');
//     const playingField = document.querySelector('.playing-field');
//     modal.classList.add('hide');
//     blackout.classList.remove('active');

//     createGameField(fieldParam.size);
//     playingField.innerHTML = savedPlayingField;
//   }
// };

//Save State after click
// function savePlayingField() {
//   const playingField = document.querySelector('.playing-field');
//   localStorage.setItem('playingField', playingField.innerHTML);
// }

//Clear State after finish Game
// function clearPlayingField() {
//   localStorage.removeItem('playingField');
// }
