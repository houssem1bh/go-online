import React from 'react';

export interface PlayerScore {
  territory: number;
  captures: number;
  total: number;
}

export interface GoScores {
  black: PlayerScore;
  white: PlayerScore;
}

interface GoScoreTableProps {
  scores: GoScores;
  komi?: number;
}

export const GoScoreTable: React.FC<GoScoreTableProps> = ({ scores, komi = 6.5 }) => {
  return (
    <div style={{ maxWidth: 320, fontFamily: 'system-ui, sans-serif', position: 'fixed',
        top: '50px', left: '50px', backgroundColor: 'white', color: 'black'
     }}>
      <h3 style={{ marginBottom: 8 }}>Score</h3>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'right',
          fontSize: 14,
        }}
      >
        <caption
          style={{
            captionSide: 'bottom',
            textAlign: 'left',
            fontSize: 12,
            color: '#666',
            paddingTop: 6,
          }}
        >
          Territory + Captures {komi ? `(+ komi ${komi} for White)` : ''}
        </caption>

        <thead>
          <tr>
            <th style={thStyle('left')}>Player</th>
            <th style={thStyle('right')}>Territory</th>
            <th style={thStyle('right')}>Captures</th>
            <th style={thStyle('right')}>Total</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={tdStyle('left')}>🟢 Vert</td>
            <td style={tdStyle()}>{scores.black.territory}</td>
            <td style={tdStyle()}>{scores.black.captures}</td>
            <td style={tdStyle()}>{scores.black.total}</td>
          </tr>
          <tr>
            <td style={tdStyle('left')}>⚪ creme</td>
            <td style={tdStyle()}>{scores.white.territory}</td>
            <td style={tdStyle()}>{scores.white.captures}</td>
            <td style={tdStyle()}>{scores.white.total.toFixed(1)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Helper style functions
const thStyle = (align: 'left' | 'right') => ({
  border: '1px solid #ddd',
  padding: '6px 10px',
  background: '#f7f7f7',
});

const tdStyle = (align: 'left' | 'right' = 'right') => ({
  border: '1px solid #ddd',
  padding: '6px 10px',
});

export default GoScoreTable;
