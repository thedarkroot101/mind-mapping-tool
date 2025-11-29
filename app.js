const mapArea = document.getElementById("mapArea");
const connectionsContainer = document.querySelector("#connections");
const nodeTemplate = document.getElementById("nodeTemplate");

let nodeId = 0;
let connections = [];

mapArea.addEventListener("dblclick", (e) => {
  const el = e.target;
  if (el.id === "mapArea") {
    createNode(e.clientX, e.clientY);
  }
});

function calculateNodePosition(x, y, node) {
  node.dataset.x = x;
  node.dataset.y = y;
  return {
    top:
      Math.max(
        10,
        Math.min(
          y - node.clientHeight / 2,
          window.innerHeight - node.clientHeight - 10,
        ),
      ) + "px",
    left:
      Math.max(
        10,
        Math.min(
          x - node.clientWidth / 2,
          window.innerWidth - node.clientWidth - 10,
        ),
      ) + "px",
  };
}

export function createNode(x, y) {
  const fragment = nodeTemplate.content.cloneNode(true);
  const node = fragment.querySelector(".node");
  const nodeTextEl = fragment.querySelector(".text");
  node.className = "node";
  node.style.opacity = 0;
  node.style.pointerEvents = "none";
  mapArea.appendChild(node);

  const nodePostition = calculateNodePosition(x, y, node);
  node.style.left = nodePostition.left;
  node.style.top = nodePostition.top;
  node.dataset.id = nodeId++;
  node.dataset.conn = "";
  node.style.opacity = 1;
  node.style.pointerEvents = "all";

  nodeTextEl.contentEditable = true;
  nodeTextEl.focus();

  node.ondblclick = () => {
    nodeTextEl.contentEditable = true;

    const range = document.createRange();
    range.selectNodeContents(node);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    node.focus();
  };

  function disableNodeEditing() {
    nodeTextEl.contentEditable = false;
    if (!nodeTextEl.textContent) {
      nodeTextEl.textContent = "Node " + nodeId;
    }
    node.dataset.x = parseInt(node.style.left) + node.clientWidth / 2;
    node.dataset.y = parseInt(node.style.top) + node.clientHeight / 2;
    updateConnection(node);
  }

  nodeTextEl.onblur = disableNodeEditing;

  node.onkeydown = (e) => {
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
    updateConnection(node);
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  return node;
}

function createConnection(node0, node1) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", node0.dataset.x);
  line.setAttribute("y1", node0.dataset.y);
  line.setAttribute("x2", node1.dataset.x);
  line.setAttribute("y2", node1.dataset.y);
  line.dataset.id = connections.length;
  node0.dataset.conn += connections.length + ",";
  node1.dataset.conn += connections.length + ",";
  connectionsContainer.appendChild(line);
  connections.push([node0, node1, line]);
}

function updateConnection(node) {
  if (node.dataset.conn) {
    node.dataset.conn.split(",").forEach((connId) => {
      if (!connId) return;
      const connection = connections[connId];
      const node0 = connection[0];
      const node1 = connection[1];
      const line = connection[2];
      line.setAttribute("x1", node0.dataset.x);
      line.setAttribute("y1", node0.dataset.y);
      line.setAttribute("x2", node1.dataset.x);
      line.setAttribute("y2", node1.dataset.y);
    });
  }
}

let selectedNode = null;
mapArea.addEventListener("click", (e) => {
  console.log(e.target);
  if (e.target.classList.contains("node-clickable") && e.ctrlKey) {
    const node = e.target.classList.contains("child")
      ? e.target.parentElement
      : e.target;
    if (!selectedNode) {
      selectedNode = node;
      selectedNode.style.borderColor = "#00aaff";
    } else {
      createConnection(selectedNode, node);
      selectedNode.style.borderColor = "#444";
      selectedNode = null;
    }
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key == "Escape" && selectedNode) {
    selectedNode.style.borderColor = "#444";
    selectedNode = null;
  }
});
