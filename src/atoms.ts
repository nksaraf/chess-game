import { atom } from "jotai"
import { focusAtom } from "jotai/optics"
import { atomFamily, atomWithReset } from "jotai/utils"
import { Square, State } from "./lib/chess/types"
import { DEFAULT_POSITION, EMPTY, WHITE } from "./lib/chess/constants"
import { generateMoves, getFen, getPiece, loadFen, makePretty } from "./lib/chess/state"

const board$ = atomWithReset({
  board: new Array(128),
  kings: { w: EMPTY, b: EMPTY },
  turn: WHITE,
  castling: { w: 0, b: 0 },
  ep_square: EMPTY,
  half_moves: 0,
  move_number: 1
} as State)

board$.onMount = ((set) => {
  const state = loadFen(DEFAULT_POSITION)
  if (state) {
    set(() => ({ ...state } as any))
  }
});

const turn$ = focusAtom(board$, (optic) => optic.prop('turn'))

const boardFen$ = atom((get) => {
  getFen(get(board$))
})

const allMoves$ = atom((get) => {
  const board = get(board$);
  return generateMoves(board).map(move => makePretty(board, move))
})

const moves$ = atomFamily((square: Square) => atom((get) => {
  const board = get(board$);
  return generateMoves(board, { square }).map(move => makePretty(board, move))
}))

const selectedSquare$ = atom(null as Square | null)

const hoveredSquare$ = atom('a1' as Square | null)

const dispatch$ = atom(
  null,
  (
    get,
    set,
    action:
      | { type: "POINTER_ENTER"; square: Square }
      | { type: "POINTER_LEAVE"; square: Square }
  ) => {
    switch (action.type) {
      case "POINTER_ENTER": {
        set(isHoveredSquare$(action.square), true);
      }
      case "POINTER_LEAVE": {
        set(isHoveredSquare$(action.square), false);
      }
    }
  }
);

const isHoveredSquare$ = atomFamily((square: Square) =>
  atom(false)
);

const piece$ = atomFamily((square: Square) => atom(get => getPiece(get(board$), square)));

export const atoms = {
  board: board$,
  boardFen: boardFen$,
  moves: moves$,
  allMoves: allMoves$,
  dispatch: dispatch$,
  hoveredSquare: hoveredSquare$,
  isHoveredSquare: isHoveredSquare$,
  selectedSquare: selectedSquare$,
  turn: turn$,
  piece: piece$
}

export const $ = atoms