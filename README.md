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

Promotion moves will have a special value, encoding both the target square and the piece to promote to, given as the "to" property of the move object.

The target square for a given pawn square will be represented by a fixed number, depending on which of the three possible promotion squares (push, capture left, capture right) should be targeted. For a know pawn location this would yield:

Example:

- 10 for the left most promotion square (-10 for black promotions)
- 20 for the left most promotion square (-20 for black promotions)
- 30 for the left most promotion square (-30 for black promotions)

```typescript
const pawnSquare: number = 9; // b7
const pieceToPromoteTo: PieceCode = 9; // White queen
const targetSquareOffset = 10; //a8

const promotionMove = {
    from: pawnSquare,
    to: (pieceToPromoteTo + targetSquare) * pawnSquare
}
```
