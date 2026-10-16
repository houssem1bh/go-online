"use client"

import './Board.css';
import { useState } from 'react';
import GoBoard from '@sabaki/go-board';
import type { Sign, Vertex } from '@sabaki/go-board';
import Scores from './Scores';
import { get } from 'http';

function getScores(board: GoBoard) {
  const width = board.width;
  const height = board.height;

  let blackCaptures = board.getCaptures(1);
  let whiteCaptures = board.getCaptures(-1);

  let blackTerritory = 0;
  let whiteTerritory = 0;

  // Keep track of visited empty intersections
  const visited = new Set<string>();

  function vertexKey([x, y]: Vertex) {
    return `${x},${y}`;
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sign = board.get([x, y]);

      if (sign === 0 && !visited.has(vertexKey([x, y]))) {
        // Find connected empty area
        const area = board.getConnectedComponent([x, y], v => board.get(v) === 0);
        area.forEach(v => visited.add(vertexKey(v)));

        // Find which colors border this empty area
        const borderingColors = new Set<Sign>();
        for (const [ax, ay] of area) {
          for (const neighbor of board.getNeighbors([ax, ay])) {
            const neighborSign = board.get(neighbor);
            if (neighborSign !== 0) borderingColors.add(neighborSign);
          }
        }

        // If bordered by only one color, that’s that color’s territory
        if (borderingColors.size === 1) {
          const color = [...borderingColors][0];
          if (color === 1) blackTerritory += area.length;
          if (color === -1) whiteTerritory += area.length;
        }
      }
    }
  }

  const blackScore = blackTerritory + blackCaptures;
  const whiteScore = whiteTerritory + whiteCaptures + 6.5; // add komi if needed

  return {
    black: { territory: blackTerritory, captures: blackCaptures, total: blackScore },
    white: { territory: whiteTerritory, captures: whiteCaptures, total: whiteScore },
  };
}

export default function Board() {
    type goPiece = {
        color: string,
        coordinates: {
            x: number,
            y: number
        }
    }
    const [turn, setTurn] = useState(1);
    const [board, setBoard] = useState<GoBoard>(new GoBoard([
    [ 0, 0, 0,0,0,0,0,0, 0, 0],
    [ 0, 0, 0,0,0,0,0,0, 0, 0],
    [ 0, 0, 0,0,0,0,0,0, 0, 0],
    [ 0, 0, 0,0,0,0,0,0, 0, 0],
    [ 0, 0, 0,0,0,0,0,0, 0, 0],
    [ 0, 0, 0,0,0,0,0,0, 0, 0],
    [ 0, 0, 0,0,0,0,0,0, 0, 0],
    [ 0, 0, 0,0,0,0,0,0, 0, 0],
    [ 0, 0, 0,0,0,0,0,0, 0, 0],
    [ 0, 0, 0,0,0,0,0,0, 0, 0],
      // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    // [ 0, 0, 0,0,0,0,0, 0,0,0,0,0, 0,0, 0,0,0, 0, 0],
    ]));
    const handleMove = (abs: number, ord: number) => {
        try {
            console.log('abs', abs, 'ord', ord, turn)

            setBoard(board.makeMove(turn as Sign, [abs, ord] as Vertex))
            setTurn(turn === 1 ? -1 : 1);
        } catch(err) {

        }
    }
    const getColor = (state: number): any => ({
    '-1': {
      background: 'radial-gradient(circle at 30% 30%, #F9FAFB, #F9FAFB)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
    }
,
    '0': {},
    '1': {
        background: 'radial-gradient(circle at 30% 30%, #2bd194, #2bd194)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
    },
    }[String(state)] ?? '');

    const countingArray = Array.from(Array(10).keys())
    const generateVerticalStyle = (index: number) : Object => ({
        left: `${index * 30}px`,
        top: '0px'
    })
    const generateHorizontalStyle = (index: number) : Object => ({
        top: `${index * 30}px`,
        left: '0px'
    })
    const [pieces, setPieces] = useState([{
        color: 'black',
        coordinates: {x: 4, y: 8}
    }]);
    const generatePointStyle = (abs: number, ord: number) : Object => ({
        left: `${abs * 30}px`,
        top: `${ord * 30}px`
    })
    const scores = getScores(board);
    return <div className="Board-container">
        <Scores
        scores={scores} komi={6.5}
        />
        {countingArray.map((el) => <div key={el + 'vertical'} className='Board-vertical-line'
        style={generateVerticalStyle(el)}
        />)}
        {countingArray.map((el) => <div key={el + 'horizontal'} className='Board-horizontal-line'
        style={generateHorizontalStyle(el)}
        />)}
        {countingArray.map((abs) => countingArray
          .map((ord) => <div key={`X${abs}Y${ord}point`}
          className={`Board-point ${turn === -1 ? 'Board-point-white' : 'Board-point-black'}`}
        style={generatePointStyle(abs, ord)}
        onClick={() => handleMove(abs, ord)}
        />)
        ).flat()}
        {
          board.signMap.map((line, x) => line.map((state, y) => (<div
          className='Board-piece'
          key={`pieceX${x}Y${y}`}
          style={{
            ...getColor(state),
            top: (x * 30) - 14,
            left: (y * 30) - 14,
            display: state === 0 ? 'none' : 'unset'
           }}
          />
        )
        )).flat()
        }
        </div>
}
