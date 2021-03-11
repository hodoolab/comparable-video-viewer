import * as React from 'react';
import SplitPane from 'react-split-pane';

import Header from './header';
import Footer from './footer';
import Menu from './menu';
import './layout.css';

// interface Props {
//   pathname: string;
//   children: JSX.Element[] | JSX.Element;
// }

const Layout = (props: any) => {
  const { location, children, history } = props;
  return (
    <>
      <Header siteTitle={'Comparable Video Viewer'} history={history} />
      <div
        style={{
          // display: "flex",
          marginTop: `1.45rem`,
          background: '#FFF8F8',
          height: '100%'
          // flexShrink: 0,
          // flex: "0 0 auto",
        }}
      >
        <SplitPane
          split="vertical"
          minSize={'15%'}
          defaultSize={'18%'}
          style={{ height: 'inherit', marginBottom: '4rem' }}
          pane2Style={{
            overflowX: 'hidden',
            overflowY: 'scroll',
            minWidth: '20%',
          }}
        >
          <Menu pathName={location.pathname} history={history} />
          <div>
            <main
              style={{
                margin: `0 auto`,
                padding: `0px 1.0875rem 1.45rem`,
                paddingTop: 0,
                maxWidth: '85%',
                width: '80%',
              }}
            >
              {children}
            </main>
          </div>
        </SplitPane>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
