export interface Option {
  wrapperLib: string,
  xmlPath: string,
  jsPath: string,
  className: string,
}

export default function(option: Option) {
  const { wrapperLib, xmlPath, jsPath, className } = option;
  return `import React from 'react';
import PropTypes from 'prop-types';
import wrapper from '${wrapperLib}';
import renderAXML from './${xmlPath}';
import initPage from './${jsPath}';
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
    return (<div className="${className}">
      {renderAXML(this.page._getRenderProps())}
    </div>);
  }
}

export default wrapper(Index);
`
};
