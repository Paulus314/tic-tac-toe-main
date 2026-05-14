import { calculateWinner, SquareValue, Square, Board } from './App';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// calculateWinner
// Test 1: returns null for an empty board.
test('returns null for an empty board', () => {
    const board = Array(9).fill(null);
    expect(calculateWinner(board)).toBeNull();
});
// Test 2: detects a row win for X.
test('detects a row win for X', () => {
    const board: SquareValue[] = ['X', 'X', 'X', null, null, null, null, null, null];
    expect(calculateWinner(board)).toBe('X');
});
// Test 3: detects a column win for O
test('detects a column win for O', () => {
    const board: SquareValue[] = ['O', null, null, 'O', null, null, 'O', null, null];
    expect(calculateWinner(board)).toBe('O');
});
// Test 4: detects a diagonal win.
test('detects a diagonal win', () => {
    const board: SquareValue[] = ['O', null, null, null, 'O', null, null, null, 'O'];
    expect(calculateWinner(board)).toBe('O');
});
// Test 5: returns null on a full board with no winner (draw, function level)
test('returns null on a full board with no winner (draw, function level)', () => {
    const board: SquareValue[] = ['O', 'X', 'O', 'O', 'X', 'X', 'X', 'O', 'O'];
    expect(calculateWinner(board)).toBe('empate');
});

// <Square />
// Test 6: renders the value passed via props.
test('renders the value passed via props', () => {
    render(<Square value="X" onSquareClick={() => { }} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('X');
});
// Test 7: renders an empty button when value is null.
test('renders an empty button when value is null', () => {
    render(<Square value={null} onSquareClick={() => { }} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('');
});
// Test 8: calls onSquareClick exactly once when clicked.
test('calls onSquareClick exactly once when clicked', async () => {
    const handleClick = jest.fn()
    render(<Square value={null} onSquareClick={handleClick} />);
    const button = screen.getByRole('button');
    await userEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1);
});

// <Board />
// Test 9: shows "Next player: X" when xIsNext is true and the board is empty.
test('shows "Next player: X" when xIsNext is true and the board is empty', () => {
    const board = Array(9).fill(null);
    render(<Board xIsNext={true} squares={board} onPlay={jest.fn()} />);
    expect(screen.getByText('Siguiente jugador: X')).toBeInTheDocument();
});
// Test 10: shows "Next player: O" when xIsNext is false.
test('shows "Next player: O" when xIsNext is false', () => {
    const board = Array(9).fill(null);
    render(<Board xIsNext={false} squares={board} onPlay={jest.fn()} />);
    expect(screen.getByText('Siguiente jugador: O')).toBeInTheDocument();
});
// Test 11: calls onPlay with the updated squares array when an empty square is clicked.
test('calls onPlay with the updated squares array when an empty square is clicked', async () => {
    const onPlay = jest.fn();
    const board: SquareValue[] = Array(9).fill(null);
    render(<Board xIsNext={true} squares={board} onPlay={onPlay} />);
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[0])
    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onPlay).toHaveBeenCalledWith(
        ['X', null, null, null, null, null, null, null, null]
    );
});
// Test 12: does not call onPlay when clicking an already-filled square.
test('does not call onPlay when clicking an already-filled square', async () => {
    const onPlay = jest.fn();
    const board: SquareValue[] = Array(9).fill(null);
    render(<Board xIsNext={true} squares={board} onPlay={() => {}} />);
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[0])
    expect(onPlay).not.toHaveBeenCalledWith(
        ['X', null, null, null, null, null, null, null, null]
    );
});
// Test 13: shows "Winner: X" when the squares prop contains a winning X line.
test('shows "Winner: X" when the squares prop contains a winning X line', async () => {
    const board: SquareValue[] = ['X', 'X', 'X', null, null, null, null, null, null];
    render(<Board xIsNext={true} squares={board} onPlay={() => {}} />);
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[0])
    expect(screen.getByText('Ganador: X')).toBeInTheDocument();
});
// Test 14: does not call onPlay when there is already a winner.
test('does not call onPlay when there is already a winner', async () => {
    const onPlay = jest.fn();
    const board: SquareValue[] = ['X', 'X', 'X', 'O', 'X', 'O', 'O', null, null];
    render(<Board xIsNext={true} squares={board} onPlay={() => {}} />);
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[7])
    expect(onPlay).not.toHaveBeenCalledWith();
});
// Test 15: full board with no winner — does not declare a winner.
test('full board with no winner — does not declare a winner', async () => {
    const onPlay = jest.fn();
    const board: SquareValue[] = ['X', 'O', 'X', 'X', 'X', 'O', 'O', 'X', 'O'];
    render(<Board xIsNext={true} squares={board} onPlay={() => {}} />);
    expect(screen.getByText('Empate')).toBeInTheDocument();
});