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
      upadteProps($parent.childNodes[index], newNode.props, oldNode.props)
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
   * @param {*} node1
   * @param {*} node2
   */
  static changed(node1, node2) {
    return (
      typeof node1 !== typeof node2 ||
      (typeof node1 === 'string' && node1 !== node2) ||
      node1.type !== node2.type
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
    return false
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

  upadteProps($target, newProps, oldProps = {}) {
    const props = Object.assign({}, newProps, oldProps)
    Object.keys(props).forEach(prop => {
      updateProp($target, prop, newProps[prop], oldProps[prop])
    })
  }
}

export default VirtualDOM
