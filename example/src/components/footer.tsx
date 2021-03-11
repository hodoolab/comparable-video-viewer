import * as React from 'react';

const Footer = props => (
  <footer
    style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      textAlign: 'center',
      paddingBottom: '20px',
      background: '#FFFCFC',
    }}
  >
    <hr style={{ width: '10%', margin: '1rem auto' }} />
    <span>
      © {new Date().getFullYear()}
      <i style={{ fontSize: '80%' }}> H.John Choi @ Hodoo AI Labs</i>
    </span>
  </footer>
);

export default Footer;
