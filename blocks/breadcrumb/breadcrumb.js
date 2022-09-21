function getParent(path) {
  if (!path || path.length === 0 || path === '/') {
    return null;
  }
  const elements = path.split('/').filter((n) => n);
  elements.pop();
  if (elements.length === 0) {
    return '/';
  }
  return `/${elements.join('/')}/`;
}

async function getTitle(path) {
  if (path === null) {
    return null;
  }
  const res = await fetch(path);
  if (res.ok) {
    const html = await res.text();
    if (html) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      if (doc) {
        return doc.getElementsByTagName('title')[0].innerHTML;
      }
    }
  }
  return null;
}

export default async function decorate(block) {
  let path = document.location.pathname;
  let { title } = document;
  const items = [];
  while (path !== null) {
    items.push({
      path,
      title,
    });
    path = getParent(path);
    // eslint-disable-next-line no-await-in-loop
    title = await getTitle(path);
  }
  items.reverse();
  const ol = document.createElement('ol');
  items.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.setAttribute('href', item.path);
    a.textContent = `${item.title}`;
    li.append(a);
    ol.append(li);
  });
  block.textContent = '';
  block.append(ol);
}
