const React = require('react');

const Icon = ({ children, ...props }) => React.createElement('Text', props, children || 'Icon');

module.exports = {
  Eye: Icon,
  EyeSlash: Icon,
  MagnifyingGlassIcon: Icon,
};
