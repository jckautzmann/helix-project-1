function getCfgPath(block) {
  return [...block.children][0].children[0].textContent;
}

function getCfgLevel(block) {
  const levelRow = [...block.children][1];
  if (levelRow) {
    return Number.parseInt(levelRow.children[0].textContent, 10);
  }
  return -1;
}

function keepItem(path, rootPath, level) {
  if (path === rootPath || path === `${rootPath}/`) {
    return false;
  }
  if (!path.startsWith(rootPath)) {
    return false;
  }
  if (Number.isNaN(level) || level === -1) {
    return true;
  }
  const itemLevel = path.split('/').filter((n) => n).length;
  const rootLevel = rootPath.split('/').filter((n) => n).length;
  return itemLevel > rootLevel && itemLevel < rootLevel + level + 1;
}

export default async function decorate(block) {
  const cfg = {
    path: getCfgPath(block),
    level: getCfgLevel(block),
  };
  const indexUrl = '/query-index.json';
  const res = await fetch(indexUrl);
  const json = await res.json();
  const listItems = json.data.filter((item) => keepItem(item.path, cfg.path, cfg.level));

  // render the list HTML
  const comment = document.createElement('div');
  comment.textContent = `List of pages below ${cfg.path} within ${cfg.level} level(s):`;
  const ul = document.createElement('ul');
  listItems.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.setAttribute('href', item.path);
    a.textContent = `${item.path}`;
    li.append(a);
    ul.append(li);
  });
  block.textContent = '';
  block.append(comment);
  block.append(ul);
}
