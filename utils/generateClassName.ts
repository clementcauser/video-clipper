const generateClassName = (componentName: string, prefix?: string) =>
  prefix ? `${prefix}__${componentName}` : componentName;

export default generateClassName;
