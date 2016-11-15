/*
 * an overloaded constructor for InputTreeNode
 */
function c(text, level, leftCh, rightCh) {
  if (level === undefined || typeof(level) == "object") {
    rightCh = leftCh;
    leftCh = level;
    level = 1;
  }
  if (rightCh === undefined) {
    rightCh = leftCh;
    leftCh = [];
  }
  if (rightCh === undefined) {
    rightCh = [];
  }

  leftCh.forEach(function(obj) {
    obj.left = true;
  });
  rightCh.forEach(function(obj) {
    obj.left = false;
  });
  if (typeof(text) == "string" || text.$trusted) {
    text = [text];
  }
  return {
    text: text,
    level: level,
    children: leftCh.concat(rightCh),
  }
}

