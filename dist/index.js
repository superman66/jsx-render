'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** @jsx h */

function h(type, props) {
  var _ref;

  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var children = args.length ? (_ref = []).concat.apply(_ref, args) : null;
  return { type: type, props: props, children: children };
}

function createElement(vnode) {
  // 如果 vnode 是 string，直接转换为 TextNode 即可
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }
  var n = document.createElement(vnode.type);
  var a = vnode.props || {};
  Object.keys(a).forEach(function (k) {
    return n.setAttributes(k, a[k]);
  });
  vnode.children.forEach(function (c) {
    return n.appendChild(createElement(c));
  });
  return n;
}

/**
 * 更新 node
 * @param {*}
 */
function updateElement($parent, newNode, oldNode) {
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  // 如果 oldNode 不存在，则使用 appendChild()
  if (!oldNode) {
    $parent.appendChild(createElement(newNode));
  }
  // 如果 newNode 不存在，则需要将 oldNode remove
  else if (!newNode) {
      $parent.removeChild($parent.childNodes[index]);
    }
    // 节点发生变化,则replace node
    else if (changed(newNode, oldNode)) {
        $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
      }
      // diff children, 递归调用 updateElement 判断 children 是否变化
      else if (newNode.type) {
          var newLength = newNode.children.length;
          var oldLength = oldNode.children.length;
          for (var i = 0; i < newLength || i < oldLength; i++) {
            console.log($parent);
            updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
          }
        }
}

/**
 * 判断节点是否改变
 * @param {*} node1
 * @param {*} node2
 */
function changed(node1, node2) {
  return (typeof node1 === 'undefined' ? 'undefined' : _typeof(node1)) !== (typeof node2 === 'undefined' ? 'undefined' : _typeof(node2)) || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type;
}

var oldItems = ['github', 'facebook', 'google'];
var newItems = ['Twitter', 'Gmail', 'Paypal'];

var oldVdom = h(
  'ul',
  null,
  oldItems.map(function (item) {
    return h(
      'li',
      null,
      item
    );
  })
);

var newVdom =
/*   <div>
  <p>
    his is an HTML page with a single babel-transpiled JS file and no
    dependencies. It is rendering DOM via JSX without any frameworks.
  </p>
  <p>Simple JSX DOM Render</p> */
h(
  'ul',
  null,
  newItems.map(function (item) {
    return h(
      'li',
      null,
      item
    );
  })
)
// </div>
;

window.onload = function () {
  var app = document.getElementById('app');
  console.log(app);
  var reload = document.getElementById('reload');

  updateElement(app, oldVdom);
  reload.addEventListener('click', function () {
    updateElement(app, newVdom, oldVdom);
  });
};