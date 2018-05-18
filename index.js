/** @jsx h */
const items = ['github', 'facebook', 'google']

const vdom = render(
  <div>
    <p>
      his is an HTML page with a single babel-transpiled JS file and no
      dependencies. It is rendering DOM via JSX without any frameworks.
    </p>
    <p>Simple JSX DOM Render</p>
    <ul>{items.map(item => <li>{item}</li>)}</ul>
  </div>,
)

window.onload = function() {
  document.body.appendChild(vdom)
}

function render(vnode) {
  // 如果 vnode 是 string，直接转换为 TextNode 即可
  if (typeof vnode === 'string') return document.createTextNode(vnode)
  let n = document.createElement(vnode.nodeName)
  let a = vnode.attributes || {}
  Object.keys(a).forEach(k => n.setAttributes(k, a[k]))
  vnode.children.forEach(c => n.appendChild(render(c)))
  return n
}

function h(nodeName, attributes, ...args) {
  let children = args.length ? [].concat(...args) : null
  return { nodeName, attributes, children }
}
