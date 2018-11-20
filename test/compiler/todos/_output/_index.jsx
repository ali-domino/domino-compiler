import React from 'react';
import PropTypes from 'prop-types';
import wrapper from 'domino-compiler/lib/wrapper';
import renderAXML from './todos.axml.jsx';
import initPage from './todos.js';
import './_index.less';

class Index extends React.Component {

  static propTypes = {
    setData: PropTypes.func.isRequired,
    data: PropTypes.object,
    assignToPage: PropTypes.object,
  };

  static defaultProps = {
    assignToPage: {},
  };

  constructor(props) {
    super(props);
    this.page = initPage({
      setData: props.setData,
      ...props.assignToPage,
    });
    props.setData(this.page.data);
  }

  componentWillReceiveProps(nextProps) {
    this.page.data = nextProps.data;
  }

  render() {
    return (<div className="todos-efa36fb2c87a7ee73ca201bf3eb4ebbc">
      {renderAXML(this.page._getRenderProps())}
    </div>);
  }
}

export default wrapper(Index);
