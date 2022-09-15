
export default function decorate(block) {
  const cfg = {
    path: [...block.children][0].children[0].textContent,
    level: [...block.children][1].children[0].textContent,
  };
  block.textContent = `path: ${cfg.path} // level: ${cfg.level}`;
}
