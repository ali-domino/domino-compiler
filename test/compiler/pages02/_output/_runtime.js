export function template(props) {
  const { is, data, pProps,  scope } = props;
  const templates = templateMap.get(scope);
  const renderTemplate = templates && templates.find(f => f.templateName === is);
  if (renderTemplate) {
    const newProps = {
      ...pProps, // Page上的方法可以被取到
      data: undefined, // Page 上的 data 字段不能被取到
      ...data, // 传入的 data 字段可以取到
    };
    return renderTemplate(newProps);
  }
  return null;
}

const templateMap = new Map();
template.reg = function(scope, renderTemplate) {
  let templates = templateMap.get(scope);
  if (!templates) {
    templates = [];
    templateMap.set(scope, templates);
  }
  if (!templates.includes(renderTemplate)) templates.push(renderTemplate);
};

export function createPage(assign) {
  const page = function(pageConfig) {
    Object.assign(page, pageConfig);
    Object.keys(pageConfig).forEach(key => {
      if (typeof pageConfig[key] === 'function') {
        page[key] = pageConfig[key].bind(page);
      }
    });
  };
  Object.assign(page, assign || {});
  page.data = {};
  page._getRenderProps = function () {
    return { window, ...page, ...page.data };
  };
  return page;
}
