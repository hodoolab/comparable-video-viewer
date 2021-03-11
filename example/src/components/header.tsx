import * as React from 'react';

interface Props {
  siteTitle: string;
}

const Header = ({ siteTitle, history }) => (
  <header style={{ background: `#87160a` }}>
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `0.7875rem 0.7875rem`,
      }}
    >
      <h1 style={{ margin: 0, color: `white`, textDecoration: `none` }} onClick={() => history.push('/')}>
        {siteTitle}
      </h1>
    </div>
  </header>
);

export default Header;
