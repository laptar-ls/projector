const fs = require('fs');
const path = require('path');

class TreeNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalanceFactor(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

    return x;
  }

  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

    return y;
  }

  insert(node, key, value) {
    if (!node) return new TreeNode(key, value);

    if (key < node.key) {
      node.left = this.insert(node.left, key, value);
    } else if (key > node.key) {
      node.right = this.insert(node.right, key, value);
    } else {
      node.value = value;
      return node;
    }

    node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;

    const balance = this.getBalanceFactor(node);

    if (balance > 1 && key < node.left.key) return this.rotateRight(node);
    if (balance < -1 && key > node.right.key) return this.rotateLeft(node);
    if (balance > 1 && key > node.left.key) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    if (balance < -1 && key < node.right.key) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  find(node, key) {
    if (!node) return null;
    if (key === node.key) return node.value;
    if (key < node.key) return this.find(node.left, key);
    return this.find(node.right, key);
  }

  getMinValueNode(node) {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  }

  delete(node, key) {
    if (!node) return node;

    if (key < node.key) {
      node.left = this.delete(node.left, key);
    } else if (key > node.key) {
      node.right = this.delete(node.right, key);
    } else {
      if (!node.left || !node.right) {
        node = node.left || node.right;
      } else {
        const temp = this.getMinValueNode(node.right);
        node.key = temp.key;
        node.value = temp.value;
        node.right = this.delete(node.right, temp.key);
      }
    }

    if (!node) return node;

    node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    const balance = this.getBalanceFactor(node);

    if (balance > 1 && this.getBalanceFactor(node.left) >= 0) return this.rotateRight(node);
    if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    if (balance < -1 && this.getBalanceFactor(node.right) <= 0) return this.rotateLeft(node);
    if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  insertElement(key, value) {
    this.root = this.insert(this.root, key, value);
  }

  findElement(key) {
    return this.find(this.root, key);
  }

  deleteElement(key) {
    this.root = this.delete(this.root, key);
  }
}


function measureTime(callback) {
  const start = performance.now();
  callback();
  const end = performance.now();
  return end - start;
}

let insertTimes = [];

for (let i = 0; i < 100; i++) {
  let numElements = Math.floor(Math.random() * 1000000) + 1;
  console.log(i, '...', numElements)
  const data = Array.from({ length: numElements }, () => [Math.floor(Math.random() * 100000), Math.random()]);

  let avlTree = new AVLTree();
  data.forEach(([key, value]) => avlTree.insertElement(key, value));

  let newKey = Math.floor(Math.random() * 100000);
  let newValue = Math.random();
  let insertTime = measureTime(() => avlTree.insertElement(newKey, newValue));

  insertTimes.push({numElements, insertTime});
}
const jsonString = JSON.stringify(insertTimes, null, 2);
const timestamp = Date.now();
const fileName = `${timestamp}.json`;
const filePath = path.join(__dirname, fileName);

fs.writeFile(filePath, jsonString, (err) => {
  if (err) {
    console.error('Error writing file', err);
  } else {
    console.log(`File created successfully in the current directory with name: ${fileName}`);
  }
});
