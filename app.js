const mapArea = document.getElementById("mapArea");
const connectionsContainer = document.querySelector("#connections");

let nodeId = 0;
let connections = [];

mapArea.addEventListener("dblclick", (e) => {
  const el = e.target;
  if (el.id === "mapArea") {
    createNode(e.clientX, e.clientY);
  }
});

// #region Nodes
const calculateNodePosX = (x, node) =>
  Math.max(
    10,
    Math.min(
      x - node.clientWidth / 2,
      window.innerWidth - node.clientWidth - 10
    )
  );

const calculateNodePosY = (y, node) =>
  Math.max(
    10,
    Math.min(
      y - node.clientHeight / 2,
      window.innerHeight - node.clientHeight - 10
    )
  );

export function createNode(x, y) {
  const node = document.createElement("div");
  node.className = "node";
  node.style.opacity = 0;
  node.style.pointerEvents = "none";
  mapArea.appendChild(node);

  node.style.left = calculateNodePosX(x, node) + "px";
  node.style.top = calculateNodePosY(y, node) + "px";
  node.dataset.id = nodeId;
  node.style.opacity = 1;
  node.style.pointerEvents = "all";

  node.contentEditable = true;
  node.focus();

  node.ondblclick = () => {
    node.contentEditable = true;

    const range = document.createRange();
    range.selectNodeContents(node);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

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

  let isDragging = false;

  node.addEventListener("mousedown", (e) => {
    isDragging = true;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    node.style.left = calculateNodePosX(e.clientX, node) + "px";
    node.style.top = calculateNodePosY(e.clientY, node) + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  return node;
}

//#endregion

// #region Connections

function createConnections() {
  for (const el of connections) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    for (const key in el) {
      line.setAttribute(key, el[key]);
    }
    connectionsContainer.appendChild(line);
  }
}

mapArea.addEventListener("click", (e) => {
  const el = e.target;
  if (el.id === "mapArea") {
    createConnection(e);
  }
});

let endClick = false;
const connection = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
};

function createConnection(e) {
  if (!endClick) {
    connection.x1 = e.clientX;
    connection.y1 = e.clientY;
    console.log(connection, 1);
  } else {
    connection.x2 = e.clientX;
    connection.y2 = e.clientY;
    console.log(connection);
    connections.push(connection, 2);
    createConnections();
  }

  endClick = !endClick;
}
// #endregion
