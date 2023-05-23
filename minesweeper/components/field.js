import { Mine, fieldParam } from '../app.js';

//Create Logik Field
export function createField(size, mines) {
  const field = new Array(size * size).fill(0);

  function inc(x, y, checkParam) {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      if (field[y * size + x] === checkParam) {
        return;
      }
      field[y * size + x] += 1;
    }
  }

  for (let i = 0; i < mines; ) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);

    if (field[y * size + x] === Mine) {
      continue;
    }

    field[y * size + x] = Mine;
    i += 1;

    inc(x + 1, y - 1, Mine);
    inc(x - 1, y - 1, Mine);
    inc(x + 1, y + 1, Mine);
    inc(x - 1, y + 1, Mine);
    inc(x + 1, y, Mine);
    inc(x - 1, y, Mine);
    inc(x, y + 1, Mine);
    inc(x, y - 1, Mine);
  }

  return field;
}

export function whatTheLevel(btn) {
  if (btn.classList.contains('medium')) {
    fieldParam.size = 15;
    fieldParam.width = '750px';
  }
  if (btn.classList.contains('hard')) {
    fieldParam.size = 25;
    fieldParam.width = '1250px';
  }
}
