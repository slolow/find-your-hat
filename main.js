const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const player = "*";

class Field {
  constructor(field) {
    this._field = field;
    this._numberOfRows = this._field[0].length - 1;
    this._numberOfColumns = this._field.length - 1;
    // search for player Position
    for (let y = 0; y < this._field.length; y++) {
      for (let x = 0; x < this._field[y].length; x++) {
        if (this._field[y][x] === player) {
          this._playerPosition = {
            x: x,
            y: y
          }
          break;
        }
      }
    }
    this._endOfGame = false;
  }

  static generateField(height, width, percentage) {
    // create 2D field with fieldCharacter
    const field = new Array(height)
      .fill(fieldCharacter)
      .map(() => new Array(width).fill(fieldCharacter));

    // always start player on top left corner of the field
/*     field[0][0] = player; */

    // replace given percentage of fieldCharacters with holeCharacters and numHats at random spots
    const numHoles = Math.round(height * width * (percentage / 100));
    const numHats = 1;
    const numPlayers = 1;
    const randomPositions = [];

    while (randomPositions.length < numHoles + numHats + numPlayers) {
      // random position betwenn 0 and height - 1
      const randomPositionY = Math.floor(Math.random() * height);

      // random position between 0 and width - 1
      const randomPositionX = Math.floor(Math.random() * width);

      // skip if [0, 0]
/*       if (randomPositionX === 0 && randomPositionY === 0) {
        continue;
      } */

      const randomPosition = [randomPositionY, randomPositionX];

      // check if randomPosition = [Y, X] is already icluded somewhere in randomPositions
      const randomPostionIncluded = randomPositions.some((arr) =>
        arr.every((value, index) => value === randomPosition[index])
      );
      if (!randomPostionIncluded) {
        // first add player than hats than holes
        if (randomPositions.length < numPlayers) {
          field[randomPositionY][randomPositionX] = player;
        } else if (randomPositions.length < (numPlayers + numHats)) {
          field[randomPositionY][randomPositionX] = hat;
        } else {
          field[randomPositionY][randomPositionX] = hole;
        }
        randomPositions.push(randomPosition);
      }
    }

    return field;
  }

  print() {
    this._field.forEach((row) => {
      console.log(row.join(""));
    });
  }

  play() {
    while (!this._endOfGame) {
      this.print();
      this._movePlayer();
      this._endOfGame = this._checkEndOfGame();
      if (!this._endOfGame) {
        this._field[this._playerPosition.y][this._playerPosition.x] =
          player;
      } else {
        const playerWon = this._checkPlayerWon();
        const playerDownTheHole = this._checkPlayerDownTheHole();
        const playerOutOfField = this._checkPlayerOutOfField();
        if (playerWon) {
          console.log("Congrats you found your hat!");
        } else if (playerDownTheHole) {
          console.log("Sorry you felt down a hole...");
        } else if (playerOutOfField) {
          console.log("Sorry you went out of the field...");
        }
      }
    }
  }

  _movePlayer() {
    this._field[this._playerPosition.y][this._playerPosition.x] =
      fieldCharacter;
    const direction = prompt("Which direction? ").toLowerCase();
    switch (direction) {
      case "d":
        this._playerPosition.y++;
        break;
      case "u":
        this._playerPosition.y--;
        break;
      case "l":
        this._playerPosition.x--;
        break;
      case "r":
        this._playerPosition.x++;
        break;
      default:
        console.log(
          `wrong input: ${direction}. Choose one of these instead: 'd', 'u', 'l', 'r'.`
        );
    }
  }

  _checkEndOfGame() {
    return (
      this._checkPlayerDownTheHole() ||
      this._checkPlayerWon() ||
      this._checkPlayerOutOfField()
    );
  }

  _checkPlayerWon() {
    const playerOutOfField = this._checkPlayerOutOfField();
    if (playerOutOfField) {
      return;
    }
    return this._field[this._playerPosition.y][this._playerPosition.x] === hat;
  }

  _checkPlayerDownTheHole() {
    const playerOutOfField = this._checkPlayerOutOfField();
    if (playerOutOfField) {
      return;
    }
    return this._field[this._playerPosition.y][this._playerPosition.x] === hole;
  }

  _checkPlayerOutOfField() {
    const x = this._playerPosition.x;
    const y = this._playerPosition.y;
    return (
      x < 0 ||
      x > this._numberOfRows || 
      y < 0 || 
      y > this._numberOfColumns
    );
  }
}

const generatedFieldArr = Field.generateField(5, 10, 25);
const generatedField = new Field(generatedFieldArr);
generatedField.play();
