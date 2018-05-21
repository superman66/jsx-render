'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @jsx h */
var VirtualDOM = function () {
  function VirtualDOM() {
    _classCallCheck(this, VirtualDOM);
  }

  _createClass(VirtualDOM, null, [{
    key: 'createElement',

    /**
     * 创建 Element
     * @param {*} vnode
     */
    value: function createElement(vnode) {
      var _this = this;

      // 如果 vnode 是 string，直接转换为 TextNode 即可
      if (typeof vnode === 'string') {
        return document.createTextNode(vnode);
      }
      var element = document.createElement(vnode.type);
      this.setProps(element, vnode.props);
      vnode.children.forEach(function (child) {
        return element.appendChild(_this.createElement(child));
      });
      return element;
    }

    /**
     * 更新 Element
     * @param {*}
     */

  }, {
    key: 'updateElement',
    value: function updateElement($parent, newNode, oldNode) {
      var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      // 如果 oldNode 不存在，则使用 appendChild()
      if (!oldNode) {
        $parent.appendChild(this.createElement(newNode));
      }
      // 如果 newNode 不存在，则需要将 oldNode remove
      else if (!newNode) {
          $parent.removeChild($parent.childNodes[index]);
        }
        // 节点发生变化,则replace node
        else if (this.changed(newNode, oldNode)) {
            $parent.replaceChild(this.createElement(newNode), $parent.childNodes[index]);
          }
          // diff children, 递归调用 updateElement 判断 children 是否变化
          else if (newNode.type) {
              this.updateProps($parent.childNodes[index], newNode.props, oldNode.props);
              var newLength = newNode.children.length;
              var oldLength = oldNode.children.length;
              for (var i = 0; i < newLength || i < oldLength; i++) {
                this.updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
              }
            }
    }

    /**
     * 判断节点是否改变
     * @param {*} node1
     * @param {*} node2
     */

  }, {
    key: 'changed',
    value: function changed(node1, node2) {
      return (typeof node1 === 'undefined' ? 'undefined' : _typeof(node1)) !== (typeof node2 === 'undefined' ? 'undefined' : _typeof(node2)) || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type;
    }
  }, {
    key: 'setProp',
    value: function setProp($target, name, value) {
      if (this.isCustomProp(name)) {
        return;
      } else if (name === 'className') {
        $target.setAttribute('class', value);
      } else if (typeof value === 'boolean') {
        this.setBooleanProp($target, name, value);
      } else {
        $target.setAttribute(name, value);
      }
    }
  }, {
    key: 'setProps',
    value: function setProps($target, props) {
      var _this2 = this;

      Object.keys(props).forEach(function (prop) {
        _this2.setProp($target, prop, props[prop]);
      });
    }

    /**
     * 设置 boolean 类型的值 如 checked disabled
     * @param {*}
     * @param {*} name
     * @param {*} value
     */

  }, {
    key: 'setBooleanProp',
    value: function setBooleanProp($target, name, value) {
      if (value) {
        $target.setAttribute(name, value);
        $target[name] = true;
      } else {
        $target[name] = false;
      }
    }
  }, {
    key: 'isCustomProp',
    value: function isCustomProp(name) {
      return false;
    }
  }, {
    key: 'removeBooleanProp',
    value: function removeBooleanProp($target, name) {
      $target.removeAttribute(name);
      $target[name] = false;
    }
  }, {
    key: 'removeProp',
    value: function removeProp($target, name, value) {
      if (this.isCustomProp(name)) {
        return;
      } else if (name === 'className') {
        $target.removeAttribute('class');
      } else if (typeof value === 'boolean') {
        this.removeBooleanProp($target, name);
      }
    }

    /**
     * 更新 props，分为新增prop，remove prop，和更新prop
     * @param {*}
     * @param {*} name
     * @param {*} value
     */

  }, {
    key: 'updateProp',
    value: function updateProp($target, name, newVal, oldVal) {
      if (!newVal) {
        this.removeProp($target, name);
      } else if (!oldVal || newVal !== oldVal) {
        this.setProp($target, name, newVal);
      }
    }
  }, {
    key: 'updateProps',
    value: function updateProps($target, newProps) {
      var oldProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var props = Object.assign({}, newProps, oldProps);
      Object.keys(props).forEach(function (prop) {
        updateProp($target, prop, newProps[prop], oldProps[prop]);
      });
    }
  }]);

  return VirtualDOM;
}();

function h(type, props) {
  var _ref;

  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var children = args.length ? (_ref = []).concat.apply(_ref, args) : null;
  return { type: type, props: props || {}, children: children };
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
  var reload = document.getElementById('reload');

  VirtualDOM.updateElement(app, oldVdom);
  reload.addEventListener('click', function () {
    VirtualDOM.updateElement(app, newVdom, oldVdom);
  });
};