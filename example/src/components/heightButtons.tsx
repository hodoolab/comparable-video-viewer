import * as React from 'react';

interface Props {
  onPlus: () => any;
  onMinus: () => any;
}

const HeightButtons = ({ onMinus, onPlus }: Props) => (
  <>
    <div
      style={{
        width: '100%',
        textAlign: 'center',
        margin: '0 auto',
        padding: '0 0 15px 0',
      }}
    >
      <div
        style={{
          width: '10vw',
          display: 'inline-block',
          textAlign: 'center',
          background: '#99281d',
          margin: '0 0 10px 0',
        }}
      >
        <h3
          style={{
            color: 'white',
            padding: '10px',
            margin: '0 auto',
          }}
          onClick={e => {
            onMinus();
          }}
        >
          -
        </h3>
      </div>
      <div style={{ width: '15px', display: 'inline-block' }}></div>
      <div
        style={{
          width: '10vw',
          display: 'inline-block',
          textAlign: 'center',
          background: '#99281d',
          margin: '0 0 10px 0',
        }}
      >
        <h3
          style={{
            color: 'white',
            padding: '10px',
            margin: '0 auto',
          }}
          onClick={e => {
            onPlus();
          }}
        >
          +
        </h3>
      </div>
    </div>
  </>
);

export default HeightButtons;
