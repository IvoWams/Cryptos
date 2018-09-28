require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = add

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function add(out, a, b) {
    out[0] = a[0] + b[0]
    out[1] = a[1] + b[1]
    return out
}
},{}],2:[function(require,module,exports){
module.exports = dot

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1]
}
},{}],3:[function(require,module,exports){
module.exports = normalize

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
function normalize(out, a) {
    var x = a[0],
        y = a[1]
    var len = x*x + y*y
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len)
        out[0] = a[0] * len
        out[1] = a[1] * len
    }
    return out
}
},{}],4:[function(require,module,exports){
module.exports = set

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
function set(out, x, y) {
    out[0] = x
    out[1] = y
    return out
}
},{}],5:[function(require,module,exports){
module.exports = subtract

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function subtract(out, a, b) {
    out[0] = a[0] - b[0]
    out[1] = a[1] - b[1]
    return out
}
},{}],6:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],7:[function(require,module,exports){
var add = require('gl-vec2/add')
var set = require('gl-vec2/set')
var normalize = require('gl-vec2/normalize')
var subtract = require('gl-vec2/subtract')
var dot = require('gl-vec2/dot')

var tmp = [0, 0]

module.exports.computeMiter = function computeMiter(tangent, miter, lineA, lineB, halfThick) {
    //get tangent line
    add(tangent, lineA, lineB)
    normalize(tangent, tangent)

    //get miter as a unit vector
    set(miter, -tangent[1], tangent[0])
    set(tmp, -lineA[1], lineA[0])

    //get the necessary length of our miter
    return halfThick / dot(miter, tmp)
}

module.exports.normal = function normal(out, dir) {
    //get perpendicular
    set(out, -dir[1], dir[0])
    return out
}

module.exports.direction = function direction(out, a, b) {
    //get unit dir of two lines
    subtract(out, a, b)
    normalize(out, out)
    return out
}
},{"gl-vec2/add":1,"gl-vec2/dot":2,"gl-vec2/normalize":3,"gl-vec2/set":4,"gl-vec2/subtract":5}],8:[function(require,module,exports){
var util = require('polyline-miter-util')

var lineA = [0, 0]
var lineB = [0, 0]
var tangent = [0, 0]
var miter = [0, 0]

module.exports = function(points, closed) {
    var curNormal = null
    var out = []
    if (closed) {
        points = points.slice()
        points.push(points[0])
    }

    var total = points.length
    for (var i=1; i<total; i++) {
        var last = points[i-1]
        var cur = points[i]
        var next = i<points.length-1 ? points[i+1] : null

        util.direction(lineA, cur, last)
        if (!curNormal)  {
            curNormal = [0, 0]
            util.normal(curNormal, lineA)
        }

        if (i === 1) //add initial normals
            addNext(out, curNormal, 1)

        if (!next) { //no miter, simple segment
            util.normal(curNormal, lineA) //reset normal
            addNext(out, curNormal, 1)
        } else { //miter with last
            //get unit dir of next line
            util.direction(lineB, next, cur)

            //stores tangent & miter
            var miterLen = util.computeMiter(tangent, miter, lineA, lineB, 1)
            addNext(out, miter, miterLen)
        }
    }

    //if the polyline is a closed loop, clean up the last normal
    if (points.length > 2 && closed) {
        var last2 = points[total-2]
        var cur2 = points[0]
        var next2 = points[1]

        util.direction(lineA, cur2, last2)
        util.direction(lineB, next2, cur2)
        util.normal(curNormal, lineA)
        
        var miterLen2 = util.computeMiter(tangent, miter, lineA, lineB, 1)
        out[0][0] = miter.slice()
        out[total-1][0] = miter.slice()
        out[0][1] = miterLen2
        out[total-1][1] = miterLen2
        out.pop()
    }

    return out
}

function addNext(out, normal, length) {
    out.push([[normal[0], normal[1]], length])
}
},{"polyline-miter-util":7}],"three-line-2d":[function(require,module,exports){
var inherits = require('inherits');
var getNormals = require('polyline-normals');
var VERTS_PER_POINT = 2;

module.exports = function createLineMesh (THREE) {
  function LineMesh (path, opt) {
    if (!(this instanceof LineMesh)) {
      return new LineMesh(path, opt);
    }
    THREE.BufferGeometry.call(this);

    if (Array.isArray(path)) {
      opt = opt || {};
    } else if (typeof path === 'object') {
      opt = path;
      path = [];
    }

    opt = opt || {};

    this.addAttribute('position', new THREE.BufferAttribute(undefined, 3));
    this.addAttribute('lineNormal', new THREE.BufferAttribute(undefined, 2));
    this.addAttribute('lineMiter', new THREE.BufferAttribute(undefined, 1));
    if (opt.distances) {
      this.addAttribute('lineDistance', new THREE.BufferAttribute(undefined, 1));
    }
    if (typeof this.setIndex === 'function') {
      this.setIndex(new THREE.BufferAttribute(undefined, 1));
    } else {
      this.addAttribute('index', new THREE.BufferAttribute(undefined, 1));
    }
    this.update(path, opt.closed);
  }

  inherits(LineMesh, THREE.BufferGeometry);

  LineMesh.prototype.update = function (path, closed) {
    path = path || [];
    var normals = getNormals(path, closed);

    if (closed) {
      path = path.slice();
      path.push(path[0]);
      normals.push(normals[0]);
    }

    var attrPosition = this.getAttribute('position');
    var attrNormal = this.getAttribute('lineNormal');
    var attrMiter = this.getAttribute('lineMiter');
    var attrDistance = this.getAttribute('lineDistance');
    var attrIndex = typeof this.getIndex === 'function' ? this.getIndex() : this.getAttribute('index');

    var indexCount = Math.max(0, (path.length - 1) * 6);
    if (!attrPosition.array ||
        (path.length !== attrPosition.array.length / 3 / VERTS_PER_POINT)) {
      var count = path.length * VERTS_PER_POINT;
      attrPosition.array = new Float32Array(count * 3);
      attrNormal.array = new Float32Array(count * 2);
      attrMiter.array = new Float32Array(count);
      attrIndex.array = new Uint16Array(indexCount);

      if (attrDistance) {
        attrDistance.array = new Float32Array(count);
      }
    }

    if (undefined !== attrPosition.count) {
      attrPosition.count = count;
    }
    attrPosition.needsUpdate = true;

    if (undefined !== attrNormal.count) {
      attrNormal.count = count;
    }
    attrNormal.needsUpdate = true;

    if (undefined !== attrMiter.count) {
      attrMiter.count = count;
    }
    attrMiter.needsUpdate = true;

    if (undefined !== attrIndex.count) {
      attrIndex.count = indexCount;
    }
    attrIndex.needsUpdate = true;

    if (attrDistance) {
      if (undefined !== attrDistance.count) {
        attrDistance.count = count;
      }
      attrDistance.needsUpdate = true;
    }

    var index = 0;
    var c = 0;
    var dIndex = 0;
    var indexArray = attrIndex.array;

    path.forEach(function (point, pointIndex, list) {
      var i = index;
      indexArray[c++] = i + 0;
      indexArray[c++] = i + 1;
      indexArray[c++] = i + 2;
      indexArray[c++] = i + 2;
      indexArray[c++] = i + 1;
      indexArray[c++] = i + 3;

      attrPosition.setXYZ(index++, point[0], point[1], 0);
      attrPosition.setXYZ(index++, point[0], point[1], 0);

      if (attrDistance) {
        var d = pointIndex / (list.length - 1);
        attrDistance.setX(dIndex++, d);
        attrDistance.setX(dIndex++, d);
      }
    });

    var nIndex = 0;
    var mIndex = 0;
    normals.forEach(function (n) {
      var norm = n[0];
      var miter = n[1];
      attrNormal.setXY(nIndex++, norm[0], norm[1]);
      attrNormal.setXY(nIndex++, norm[0], norm[1]);

      attrMiter.setX(mIndex++, -miter);
      attrMiter.setX(mIndex++, miter);
    });
  };

  return LineMesh;
};

},{"inherits":6,"polyline-normals":8}]},{},[]);
