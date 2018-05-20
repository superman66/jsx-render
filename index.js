/** @jsx h */

function h(type, props, ...args) {
  let children = args.length ? [].concat(...args) : null
  return { type, props, children }
}

function createElement(vnode) {
  // 如果 vnode 是 string，直接转换为 TextNode 即可
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode)
  }
  let n = document.createElement(vnode.type)
  let a = vnode.props || {}
  Object.keys(a).forEach(k => n.setAttributes(k, a[k]))
  vnode.children.forEach(c => n.appendChild(createElement(c)))
  return n
}

/**
 * 更新 node
 * @param {*}
 */
function updateElement($parent, newNode, oldNode, index = 0) {
  // 如果 oldNode 不存在，则使用 appendChild()
  if (!oldNode) {
    $parent.appendChild(createElement(newNode))
  }
  // 如果 newNode 不存在，则需要将 oldNode remove
  else if (!newNode) {
    $parent.removeChild($parent.childNodes[index])
  }
  // 节点发生变化,则replace node
  else if (changed(newNode, oldNode)) {
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index])
  }
  // diff children, 递归调用 updateElement 判断 children 是否变化
  else if (newNode.type) {
    const newLength = newNode.children.length
    const oldLength = oldNode.children.length
    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(
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
function changed(node1, node2) {
  return (
    typeof node1 !== typeof node2 ||
    (typeof node1 === 'string' && node1 !== node2) ||
    node1.type !== node2.type
  )
}

const oldItems = ['github', 'facebook', 'google']
const newItems = ['Twitter', 'Gmail', 'Paypal']

const oldVdom = <ul>{oldItems.map(item => <li>{item}</li>)}</ul>

const newVdom = (
  /*   <div>
    <p>
      his is an HTML page with a single babel-transpiled JS file and no
      dependencies. It is rendering DOM via JSX without any frameworks.
    </p>
    <p>Simple JSX DOM Render</p> */
  <ul>{newItems.map(item => <li>{item}</li>)}</ul>
  // </div>
)

window.onload = function() {
  const app = document.getElementById('app')
  const reload = document.getElementById('reload')

  updateElement(app, oldVdom)
  reload.addEventListener('click', () => {
    updateElement(app, newVdom, oldVdom)
  })
}
