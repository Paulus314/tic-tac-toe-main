import { useState } from 'react';
import styled from 'styled-components'
import GlobalStyles from './GlobalStyles'


const Button = styled.button`
  width: 120px;
  height: 120px;

  border-radius: 5px;
  border: 2px solid #241ed5;
  background: #72e3e0;

  color: #992b8c;
  font-size: 48px;

  align-items: center;
  justify-content: center;
`

type SquareValue = 'X' | 'O' | null;

interface SquareProps {
    value: SquareValue;
    onSquareClick: () => void;
}

function Square({ value, onSquareClick }: SquareProps) {
    return (
        <Button className="square" onClick={onSquareClick}>
            {value}
        </Button>
    );
}

interface BoardProps {
    xIsNext: boolean;
    squares: SquareValue[];
    onPlay: (squares: SquareValue[]) => void;
}

const Row = styled.div`
  display: flex;
`

function Board({ xIsNext, squares, onPlay }: BoardProps) {
    function handleClick(i: number) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status: string;
    if (winner === 'empate') {
        status = 'Empate'
    }
    else if (winner) {
        status = 'Ganador: ' + winner;
    } else {
        status = 'Siguiente jugador: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <>
            <GlobalStyles />
            <div className="status">{status}</div>
            <Row>
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </Row>
            <Row>
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </Row>
            <Row>
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </Row>
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState<SquareValue[][]>([
        Array(9).fill(null),
    ]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares: SquareValue[]) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = 'Ir al movimiento #' + move;
        } else {
            description = 'Ir al inicio del juego';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol className="moves">{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares: SquareValue[], currentMove: number): SquareValue {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    if (squares.every(square => square !== null)) {
        return 'empate';
    }
    return null;
}