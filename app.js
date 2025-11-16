const mapArea = document.getElementById("mapArea");
let nodeId = 0;

mapArea.addEventListener("dblclick", (e) => {
  const el = e.target;
  if (el.id === "mapArea") {
    createNode(e.clientX, e.clientY);
  }
});

const calculatePosX = (x, node) =>
  Math.max(
    10,
    Math.min(
      x - node.clientWidth / 2,
      window.innerWidth - node.clientWidth - 10
    )
  );

const calculatePosY = (y, node) =>
  Math.max(
    10,
    Math.min(
      y - node.clientHeight / 2,
      window.innerHeight - node.clientHeight - 10
    )
  );

function createNode(x, y) {
  const node = document.createElement("div");
  node.className = "node";
  node.style.opacity = 0;
  node.style.pointerEvents = "none";
  mapArea.appendChild(node);

  node.style.left = calculatePosX(x, node) + "px";
  node.style.top = calculatePosY(y, node) + "px";
  node.dataset.id = nodeId;
  node.style.opacity = 1;
  node.style.pointerEvents = "all";

  node.contentEditable = true;
  node.focus();

  node.ondblclick = () => {
    node.contentEditable = true;
    node.focus();
  };

  node.onblur = () => {
    node.contentEditable = false;

    if (!node.textContent) {
      node.textContent = "Node " + ++nodeId;
    }
  };

  node.onkeydown = (e) => {
    if (e.key === "Escape") {
      node.contentEditable = false;

      if (!node.textContent) {
        node.textContent = "Node " + ++nodeId;
      }
    }
  };

  makeDraggable(node);

  return node;
}

function makeDraggable(node) {
  let isDragging = false;

  node.addEventListener("mousedown", (e) => {
    isDragging = true;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    node.style.left = calculatePosX(e.clientX, node) + "px";
    node.style.top = calculatePosY(e.clientY, node) + "px";
    // updateLines();
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}
