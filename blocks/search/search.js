async function getItems(term) {
  if (term.length === 0) {
    return [];
  }
  const url = '/query-index.json';
  const res = await fetch(url);
  const json = await res.json();
  const items = [];
  json.data.forEach((item) => {
    if (item.title.toLowerCase().includes(term.toLowerCase())) {
      items.push(item);
    }
  });
  return items;
}

async function updateSearchResults(e) {
  const results = e.target.parentElement.children[1];
  const term = e.target.value;
  const items = await getItems(term);
  const ul = document.createElement('ul');
  items.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.setAttribute('href', item.path);
    a.textContent = `${item.path} | ${item.title}`;
    li.append(a);
    ul.append(li);
  });
  results.textContent = '';
  results.append(ul);
}

export default async function decorate(block) {
  const input = document.createElement('input');
  input.placeholder = 'search ...';
  const results = document.createElement('div');
  block.append(input);
  block.append(results);
  document.getElementsByTagName('input')[0].addEventListener('input', updateSearchResults);
}
