'use strict';

/** @jsx h */
var items = ['github', 'facebook', 'google'];

var vdom = render(h(
  'div',
  null,
  h(
    'p',
    null,
    'his is an HTML page with a single babel-transpiled JS file and no dependencies. It is rendering DOM via JSX without any frameworks.'
  ),
  h(
    'p',
    null,
    'Simple JSX DOM Render'
  ),
  h(
    'ul',
    null,
    items.map(function (item) {
      return h(
        'li',
        null,
        text
      );
    })
  )
));

window.onload = function () {
  document.body.appendChild(vdom);
};

function render(vnode) {
  // 如果 vnode 是 string，直接转换为 TextNode 即可
  if (typeof vnode === 'string') return document.createTextNode(vnode);
  var n = document.createElement(vnode.nodeName);
  var a = vnode.attributes || {};
  Object.keys(a).forEach(function (k) {
    return n.setAttributes(k, a[k]);
  });
  vnode.children.forEach(function (c) {
    return n.appendChild(render(c));
  });
  return n;
}

function h(nodeName, attributes) {
  var _ref;

  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var children = args.length ? (_ref = []).concat.apply(_ref, args) : null;
  return { nodeName: nodeName, attributes: attributes, children: children };
}