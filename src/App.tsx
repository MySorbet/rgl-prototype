import { useState } from "react";
import styled from "styled-components";
import * as _ from "lodash";

type Rotation = 0 | 90 | 180 | 270;
interface ISquare {
  id: string;
  rotation: Rotation;
}

const rotate = (r: Rotation): Rotation => {
  return ((r + 90) % 360) as Rotation;
};

const initialSquares: ISquare[] = [
  { id: "A1", rotation: 0 },
  { id: "B1", rotation: 0 },
  { id: "C1", rotation: 0 },
  { id: "A2", rotation: 0 },
  { id: "B2", rotation: 0 },
  { id: "C2", rotation: 0 },
  { id: "A3", rotation: 0 },
  { id: "B3", rotation: 0 },
  { id: "C3", rotation: 0 },
];

export const App = () => {
  const [squares, setSquares] = useState<ISquare[]>(initialSquares);

  const onClick = (id: string) => {
    // Rotate the square that was clicked on
    const newSquares = squares.map((s) =>
      s.id === id ? { ...s, rotation: rotate(s.rotation) } : s
    );
    setSquares(newSquares);
  };

  const rows = _.chunk(squares, 3);

  return (
    <Root>
      <Title>Scramble Squares</Title>
      <Cols>
        {rows.map((row, i) => (
          <Row key={i}>
            {row.map((square) => (
              <Square
                rotation={square.rotation}
                onClick={() => onClick(square.id)}
                key={square.id}
              >
                {/* {square.id} */}
                <RedShell />
                <BlueShell />
                <GreenShell />
                <BlackShell />
              </Square>
            ))}
          </Row>
        ))}
      </Cols>
      <Reset onClick={() => setSquares(initialSquares)}>Reset</Reset>
    </Root>
  );
};

const Title = styled.span`
  margin-bottom: 16px;
  font-weight: 800;
`;

const Reset = styled.a`
  margin-top: 16px;
  font-weight: 800;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Cols = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
`;

const Square = styled.div<{ rotation?: Rotation }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background-color: hsl(42, 67%, 65%);
  text-align: center;
  color: black;
  font-weight: 800;
  cursor: pointer;

  --rotation: ${(p) => (p.rotation ?? 0) + "deg"};
  transition: all ease-in-out 300ms;
  transform: rotate(var(--rotation));

  &:hover {
    transform: scale(1.05) rotate(var(--rotation));
    background-color: hsl(42, 67%, 70%);
  }
`;

const Shell = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
`;

const RedShell = styled(Shell)`
  background-color: red;

  top: calc(50% - 10px);
  right: 0;
  border-radius: 50% 0 0 50%;
`;

const BlueShell = styled(Shell)`
  background-color: blue;

  top: calc(50% - 10px);
  left: 0;
  border-radius: 0 50% 50% 0;
`;

const GreenShell = styled(Shell)`
  background-color: green;

  left: calc(50% - 10px);
  top: 0;
  border-radius: 0 0 50% 50%;
`;

const BlackShell = styled(Shell)`
  background-color: black;

  left: calc(50% - 10px);
  bottom: 0;
  border-radius: 50% 50% 0 0;
`;
