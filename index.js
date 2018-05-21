/** @jsx h */
class VirtualDOM {
  /**
   * 创建 Element
   * @param {*} vnode
   */
  static createElement(vnode) {
    // 如果 vnode 是 string，直接转换为 TextNode 即可
    if (typeof vnode === 'string') {
      return document.createTextNode(vnode)
    }
    const element = document.createElement(vnode.type)
    this.setProps(element, vnode.props)
    // 单独为 事件设置属性
    this.addEventListeners(element, vnode.props)
    vnode.children.forEach(child =>
      element.appendChild(this.createElement(child)),
    )
    return element
  }

  /**
   * 更新 Element
   * @param {*}
   */
  static updateElement($parent, newNode, oldNode, index = 0) {
    // 如果 oldNode 不存在，则使用 appendChild()
    if (!oldNode) {
      $parent.appendChild(this.createElement(newNode))
    }
    // 如果 newNode 不存在，则需要将 oldNode remove
    else if (!newNode) {
      $parent.removeChild($parent.childNodes[index])
    }
    // 节点发生变化,则replace node
    else if (this.changed(newNode, oldNode)) {
      $parent.replaceChild(
        this.createElement(newNode),
        $parent.childNodes[index],
      )
    }
    // diff children, 递归调用 updateElement 判断 children 是否变化
    else if (newNode.type) {
      this.updateProps($parent.childNodes[index], newNode.props, oldNode.props)
      const newLength = newNode.children.length
      const oldLength = oldNode.children.length
      for (let i = 0; i < newLength || i < oldLength; i++) {
        this.updateElement(
          $parent.childNodes[index],
          newNode.children[i],
          oldNode.children[i],
          i,
        )
      }
    }
  }

  /**
   * 判断节点是否改变
   * @param {*} newNode
   * @param {*} oldNode
   */
  static changed(newNode, oldNode) {
    return (
      typeof newNode !== typeof oldNode ||
      (typeof newNode === 'string' && newNode !== oldNode) ||
      newNode.type !== oldNode.type ||
      // 自定义属性，用于强制更新
      newNode.props && newNode.props.forceUpdate
    )
  }

  static setProp($target, name, value) {
    if (this.isCustomProp(name)) {
      return
    } else if (name === 'className') {
      $target.setAttribute('class', value)
    } else if (typeof value === 'boolean') {
      this.setBooleanProp($target, name, value)
    } else {
      $target.setAttribute(name, value)
    }
  }

  static setProps($target, props) {
    Object.keys(props).forEach(prop => {
      this.setProp($target, prop, props[prop])
    })
  }

  /**
   * 设置 boolean 类型的值 如 checked disabled
   * @param {*}
   * @param {*} name
   * @param {*} value
   */
  static setBooleanProp($target, name, value) {
    if (value) {
      $target.setAttribute(name, value)
      $target[name] = true
    } else {
      $target[name] = false
    }
  }

  static isCustomProp(name) {
    return this.isEventProps(name) || name === 'forceUpdate'
  }

  static removeBooleanProp($target, name) {
    $target.removeAttribute(name)
    $target[name] = false
  }

  static removeProp($target, name, value) {
    if (this.isCustomProp(name)) {
      return
    } else if (name === 'className') {
      $target.removeAttribute('class')
    } else if (typeof value === 'boolean') {
      this.removeBooleanProp($target, name)
    }
  }

  /**
   * 更新 props，分为新增prop，remove prop，和更新prop
   * @param {*}
   * @param {*} name
   * @param {*} value
   */
  static updateProp($target, name, newVal, oldVal) {
    if (!newVal) {
      this.removeProp($target, name)
    } else if (!oldVal || newVal !== oldVal) {
      this.setProp($target, name, newVal)
    }
  }

  static updateProps($target, newProps, oldProps = {}) {
    const props = Object.assign({}, newProps, oldProps)
    Object.keys(props).forEach(prop => {
      this.updateProp($target, prop, newProps[prop], oldProps[prop])
    })
  }

  /**
   * 判断是否为 Event prop，事件都以 on 开头
   * @param {*} name
   */
  static isEventProps(name) {
    return /^on/.test(name)
  }

  static extractEventName(name) {
    return name.slice(2).toLowerCase()
  }

  static addEventListeners($target, props) {
    Object.keys(props).forEach(prop => {
      if (this.isEventProps(prop)) {
        $target.addEventListener(this.extractEventName(prop), props[prop])
      }
    })
  }
}

function h(type, props, ...args) {
  let children = args.length ? [].concat(...args) : []
  return { type, props: props || {}, children }
}

const oldItems = ['github', 'facebook', 'google']
const newItems = ['Twitter', 'Gmail', 'Paypal']

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
  console.log(e.target.value)
}

const f = (
  <ul style="list-style: none;">
    <li className="item" onClick={() => alert('hi!')}>
      item 1
    </li>
    <li className="item">
      <input type="checkbox" checked={true} />
      <input type="text" onInput={log} />
    </li>
    {/* this node will always be updated */}
    <li forceUpdate={true}>text</li>
  </ul>
)

const g = (
  <ul style="list-style: none;">
    <li className="item item2" onClick={() => alert('hi!')}>
      item 1
    </li>
    <li style="background: red;">
      <input type="checkbox" checked={false} />
      <input type="text" onInput={log} />
    </li>
    {/* this node will always be updated */}
    <li forceUpdate={true}>text</li>
  </ul>
)
window.onload = function() {
  const app = document.getElementById('app')
  const reload = document.getElementById('reload')

  VirtualDOM.updateElement(app, f)
  reload.addEventListener('click', () => {
    VirtualDOM.updateElement(app, g, f)
  })
}
