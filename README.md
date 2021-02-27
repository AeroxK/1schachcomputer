# 1schachcomputer

1schachcomputer will destroy you at chess, can also be used to play vs a friend though :smileyface

## Installation

Get dependencies:

```bash
npm install
```

Create new build (will delete and generate new dist folder):

```bash
npm run build
```

Run app and serve files from dist folder:

```bash
npm run serve
```

## Development

There are several file watchers available for the different parts of the application.

Watch and compile the Typescript files in the Backend:
```bash
npm run watch:backend
```
Watch and compile all frontend assets via Webpack:
```bash
npm run watch:frontend
```
Start the dev server with automatic restart if a backend file change is detected:
```bash
npm run watch:server
```

Run all of the watchers combined:

```bash
npm run dev
```

### The Board

The chess board is represented as an array of indices as follows:

```
| 00 | 01 | 02 | 03 | 04 | 05 | 06 | 07 |  
| 08 | 09 | 10 | 11 | 12 | 13 | 14 | 15 |  
| 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 |  
| 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 |  
| 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 |  
| 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 |  
| 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 |  
| 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 |
```

### Moves

The Moves will be given as a tuple of indices in the range 0-63:

```typescript
const move: Move = { from: 01, to: 18 };
```

### Promotions

Promotion moves will be unique, encoding both the target square and the piece to promote to into the "to" property of the move object. The value of the to property of promotion moves will always be either smaller than -63 or bigger than 63.

The target square for any promotion move will be represented by a fixed number relative to the origin square, depending on which of the three possible promotion squares (push, capture left, capture right) should be targeted. For any promotion move this will yield:

- 10 for the left most promotion square (-10 for black promotions)
- 20 for the middle promotion square (-20 for black promotions)
- 30 for the right most promotion square (-30 for black promotions)

At the end, another fixed offset will be added to the promotion square offset, making sure the value of the "to" property is pushed outside of the range from -63 to 63. For white promotions this value is 51, for black promotions it is -51.

Example Promotion Encoding:

```typescript
const pawnSquare: number = 9; // b7
const pieceToPromoteTo: PieceCode = 9; // White queen
const promotionSquareOffset = 10; //a8

const promotionMove = {
    from: pawnSquare,
    to: pieceToPromoteTo + promotionSquareOffset + 51
}
```

This explanation is intended mainly to improve understanding of the application, there are util functions covering both encoding and decoding the promotion moves.
