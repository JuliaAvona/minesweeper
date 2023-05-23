import { fieldParam, intervalId, createGameField, showTime } from '../app.js';
import { whatTheLevel } from './field.js';

export function createStartModal() {
  clearInterval(intervalId);
  fieldParam.countBomb = 10;
  fieldParam.countClick = 0;
  const section = document.querySelector('.game-field');
  const overlayResult = document.querySelector('.overlay-result');
  const blackOut = document.querySelector('.blackout');

  if (section) {
    section.remove();
  }

  if (overlayResult) {
    overlayResult.remove();
  }

  if (blackOut) {
    blackOut.remove();
  }

  const elementOverlay = document.createElement('div');
  elementOverlay.innerHTML = `
      <div class="modal">
        <h2 class="modal-title">Pirate <br>minesweeper</h2>
          <ul class="items">
            <li class="one-item easy">Easy</li>
            <li class="one-item medium">Medium</li>
            <li class="one-item hard">Hard</li>
          </ul>
          <p class="how-mines">How many Mines?: <span class="how-mines__tablo">10</span></p>
          <input type="range" min="1" max="99" value="10" class="how-mines__input">
      </div>
    `;
  elementOverlay.classList.add('overlay');
  document.body.prepend(elementOverlay);

  const elementBlackout = document.createElement('div');
  elementBlackout.classList.add('blackout');
  elementBlackout.classList.add('active');
  elementOverlay.after(elementBlackout);

  const modal = document.querySelector('.overlay');
  const oneOption = document.querySelectorAll('.one-item');
  const blackout = document.querySelector('.blackout');
  const howManyMine = document.querySelector('.how-mines__tablo');

  document
    .querySelector('.how-mines__input')
    .addEventListener('change', function () {
      howManyMine.textContent = this.value;
      fieldParam.mines = this.value;
      fieldParam.countBomb = this.value;
    });

  oneOption.forEach((btn) => {
    btn.addEventListener('click', () => {
      whatTheLevel(btn);
      modal.classList.add('hide');
      blackout.classList.remove('active');
      createGameField(fieldParam.size);
      showTime();
    });
  });
}
