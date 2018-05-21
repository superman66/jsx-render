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
      // 单独为 事件设置属性
      this.addEventListeners(element, vnode.props);
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
     * @param {*} newNode
     * @param {*} oldNode
     */

  }, {
    key: 'changed',
    value: function changed(newNode, oldNode) {
      return (typeof newNode === 'undefined' ? 'undefined' : _typeof(newNode)) !== (typeof oldNode === 'undefined' ? 'undefined' : _typeof(oldNode)) || typeof newNode === 'string' && newNode !== oldNode || newNode.type !== oldNode.type ||
      // 自定义属性，用于强制更新
      newNode.props && newNode.props.forceUpdate;
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
      return this.isEventProps(name) || name === 'forceUpdate';
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
      var _this3 = this;

      var oldProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var props = Object.assign({}, newProps, oldProps);
      Object.keys(props).forEach(function (prop) {
        _this3.updateProp($target, prop, newProps[prop], oldProps[prop]);
      });
    }

    /**
     * 判断是否为 Event prop，事件都以 on 开头
     * @param {*} name
     */

  }, {
    key: 'isEventProps',
    value: function isEventProps(name) {
      return (/^on/.test(name)
      );
    }
  }, {
    key: 'extractEventName',
    value: function extractEventName(name) {
      return name.slice(2).toLowerCase();
    }
  }, {
    key: 'addEventListeners',
    value: function addEventListeners($target, props) {
      var _this4 = this;

      Object.keys(props).forEach(function (prop) {
        if (_this4.isEventProps(prop)) {
          $target.addEventListener(_this4.extractEventName(prop), props[prop]);
        }
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

  var children = args.length ? (_ref = []).concat.apply(_ref, args) : [];
  return { type: type, props: props || {}, children: children };
}

var oldItems = ['github', 'facebook', 'google'];
var newItems = ['Twitter', 'Gmail', 'Paypal'];

/* const oldVdom = <ul>{oldItems.map(item => <li>{item}</li>)}</ul>

const newVdom = (
   <div>
    <p>
      his is an HTML page with a single babel-transpiled JS file and no
      dependencies. It is rendering DOM via JSX without any frameworks.
    </p>
    <p>Simple JSX DOM Render</p> 
  <ul>{newItems.map(item => <li>{item}</li>)}</ul>
  </div>
)
*/

function log(e) {
  console.log(e.target.value);
}

var f = h(
  'ul',
  { style: 'list-style: none;' },
  h(
    'li',
    { className: 'item', onClick: function onClick() {
        return alert('hi!');
      } },
    'item 1'
  ),
  h(
    'li',
    { className: 'item' },
    h('input', { type: 'checkbox', checked: true }),
    h('input', { type: 'text', onInput: log })
  ),
  h(
    'li',
    { forceUpdate: true },
    'text'
  )
);

var g = h(
  'ul',
  { style: 'list-style: none;' },
  h(
    'li',
    { className: 'item item2', onClick: function onClick() {
        return alert('hi!');
      } },
    'item 1'
  ),
  h(
    'li',
    { style: 'background: red;' },
    h('input', { type: 'checkbox', checked: false }),
    h('input', { type: 'text', onInput: log })
  ),
  h(
    'li',
    { forceUpdate: true },
    'text'
  )
);
window.onload = function () {
  var app = document.getElementById('app');
  var reload = document.getElementById('reload');

  VirtualDOM.updateElement(app, f);
  reload.addEventListener('click', function () {
    VirtualDOM.updateElement(app, g, f);
  });
};