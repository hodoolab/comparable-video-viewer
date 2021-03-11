import React from 'react';
import styled from 'styled-components';

interface Props {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  percentagePlayed: number;
}

const Seek = (props: Props) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
    props.onChange(e);
  };

  return (
    <Wrapper>
      <Track>
        <Info
          style={{
            width: `${props.percentagePlayed || 0}%`,
          }}
        />
        <SeekInput
          min='0'
          step={1}
          max='100'
          type='range'
          // orient='horizontal'
          onChange={onChange}
          value={props.percentagePlayed || 0}
        />
      </Track>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  left: 40px;
  right: 120px;
  height: 100%;
  display: inline-block;
  padding: 0 2vmin;
`;

const Track = styled.div`
  position: absolute;
  top: 50%;
  left: 5px;
  right: 5px;
  height: 4px;
  transform: translateY(-50%);
  background-color: #3e3e3e;
`;

const Info = styled.div`
  position: absolute;
  background: white;
  top: 0;
  left: 0;
  height: 100%;
`;

const SeekInput = styled.input`
  width: 100%;
  opacity: 0;
  cursor: pointer;
`;

export default Seek;
