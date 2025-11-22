const mapArea = document.getElementById("mapArea");
const connectionsContainer = document.querySelector("#connections");

let nodeId = 0;
let connections = [[0, 1]];

mapArea.addEventListener("dblclick", (e) => {
  const el = e.target;
  if (el.id === "mapArea") {
    createNode(e.clientX, e.clientY);
  }
});

// #region Nodes
function calculateNodePosition(x, y, node) {
  node.dataset.x = x;
  node.dataset.y = y;
  return {
    top:
      Math.max(
        10,
        Math.min(
          y - node.clientHeight / 2,
          window.innerHeight - node.clientHeight - 10
        )
      ) + "px",
    left:
      Math.max(
        10,
        Math.min(
          x - node.clientWidth / 2,
          window.innerWidth - node.clientWidth - 10
        )
      ) + "px",
  };
}

export function createNode(x, y) {
  const node = document.createElement("div");
  node.className = "node";
  node.style.opacity = 0;
  node.style.pointerEvents = "none";
  mapArea.appendChild(node);

  const nodePostition = calculateNodePosition(x, y, node);
  node.style.left = nodePostition.left;
  node.style.top = nodePostition.top;
  node.dataset.id = nodeId++;
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

  function disableNodeEditing() {
    node.contentEditable = false;
    if (!node.textContent) {
      node.textContent = "Node " + ++nodeId;
    }
  }

  node.onblur = disableNodeEditing;

  node.onkeydown = (e) => {
    node.dataset.x = parseInt(node.style.left) + node.clientWidth / 2;
    node.dataset.y = parseInt(node.style.top) + node.clientHeight / 2;
    if (e.key === "Escape") {
      disableNodeEditing();
    }
  };

  let isDragging = false;

  node.addEventListener("mousedown", (e) => {
    isDragging = true;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const nodePostition = calculateNodePosition(e.clientX, e.clientY, node);
    node.style.left = nodePostition.left;
    node.style.top = nodePostition.top;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  return node;
}

//#endregion

// #region Connections
function createConnection(node0, node1) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", node0.dataset.x);
  line.setAttribute("y1", node0.dataset.y);
  line.setAttribute("x2", node1.dataset.x);
  line.setAttribute("y2", node1.dataset.y);
  connectionsContainer.appendChild(line);
}

// mapArea.addEventListener("click", (e) => {
//   const el = e.target;
//   if (el.id === "mapArea") {
//     createConnection(e);
//   }
// });

// let endClick = false;
// const connection = {
//   x1: 0,
//   y1: 0,
//   x2: 0,
//   y2: 0,
// };

// function createConnection(e) {
//   if (!endClick) {
//     connection.x1 = e.clientX;
//     connection.y1 = e.clientY;
//     console.log(connection, 1);
//   } else {
//     connection.x2 = e.clientX;
//     connection.y2 = e.clientY;
//     console.log(connection);
//     connections.push(connection, 2);
//     createConnections();
//   }

//   endClick = !endClick;
// }
// #endregion

// TODO remove later
const node0 = createNode(400, 400);
const node1 = createNode(800, 600);

createConnection(node0, node1);

const node2 = createNode(444, 220);
const node3 = createNode(232, 600);

createConnection(node2, node3);
