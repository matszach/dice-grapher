"use strict";

/**
 * Collection of tools that can be used to create games with JS and HTML5 canvas
 * @author Lukasz Kaszubowski
 * @see https://github.com/matszach
 * @version 1.0
 */
const Gmt = {

    /**
     * ===== ===== ===== ===== RANDOM ===== ===== ===== =====
     */

    /**
     * Math.random() wrapper
     */
    random() {
        return Math.random();
    },

    /**
     * Returns true if Math.random() call returns less than the passed chance value
     * Values <= 0 always return false
     * Values >= 1 always return true
     * @param {Float} chance - value between 0.00 - 1.00
     */
    chance(chance) {
        return Math.random() < chance;
    },

    /**
     * Returns true or false with 50/50 chance for each
     */
    randBool() {
        return Gmt.chance(0.5);
    },

    /**
     * Returns 1 or -1 with 50/50 chance for each
     */
    randSign(){
        return Gmt.randBool() ? 1 : -1;
    },

    /**
     * Returns a random Integer between min and max values, max excluded
     * @param {Float} min - the lowest possible value returned
     * @param {Float} max - the ~highest possible value returned
     */
    randFloat(min, max) {
        return min + (max - min) * Math.random(); 
    },

    /**
     * Returns a random Integer between min and max values, both included
     * @param {Integer} min - the lowest possible value returned
     * @param {Integer} max - the highest possible value returned
     */
    randInt(min, max) {
        return Math.floor(this.randFloat(min, max + 1)); 
    },

    /**
     * Returns a random value from the passed list
     * @param {Array} list - list to select from
     */
    choice(list) {
        return list[this.randInt(0, list.length - 1)];
    },




    /**
     * ===== ===== ===== ===== UTIL ===== ===== ===== =====
     */

    /**
     * Clamps value between min and max
     * @param {Number} num - original value
     * @param {Number} min - value's bottom boundary
     * @param {Number} max - value's top boundary
     */
    clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    },

    /**
     * Returns true if the original values is between the min adn max values passed
     * @param {Number} num - original value
     * @param {Number} min - value's bottom boundary
     * @param {Number} max - value's top boundary
     */
    between(num, min, max) {
        return num >= min && num <= max;
    },

    /**
     * Current value approaches target value at a rate of step
     * This returss the next value in the series
     * @param {Number} current 
     * @param {Number} target 
     * @param {Number} step 
     */
    ease(current, target, step) {
        step = step || 1;
        if(Math.abs(current - target) <= step) {
            return target;
        } else if (current > target) {
            return current - step;
        } else {
            return current + step;
        }
    },

    /**
     * Easy 1D iteration
     * eg: Gmt.iter1D(10, (x, y) => {});
     * @param {Number} xSize 
     * @param {Function} func 
     */
    iter1D(xSize, func) {
        for(let x = 0; x < xSize; x++){
            func(x);
        }
    },

    /**
     * Easy 2D iteration
     * eg: Gmt.iter2D(10, 10, (x, y) => {});
     * @param {Number} xSize 
     * @param {Number} ySize 
     * @param {Function} func 
     */
    iter2D(xSize, ySize, func) {
        for(let x = 0; x < xSize; x++){
            for(let y = 0; y < ySize; y++){
                func(x, y);
            }
        }
    },

    /**
     * Easy 3D iteration
     * eg: Gmt.iter3D(10, 10, 10, (x, y) => {});
     * @param {Number} xSize 
     * @param {Number} ySize 
     * @param {Number} zSize 
     * @param {Function} func 
     */
    iter3D(xSize, ySize, zSize, func) {
        for(let x = 0; x < xSize; x++){
            for(let y = 0; y < ySize; y++){
                for(let z = 0; z < zSize; z++){
                    func(x, y, z);
                }
            }
        }
    },

    /**
     * Easy 4D iteration
     * eg: Gmt.iter4D(10, 10, 10, 10, (x, y) => {});
     * @param {Number} xSize 
     * @param {Number} ySize 
     * @param {Number} zSize 
     * @param {Number} wSize 
     * @param {Function} func 
     */
    iter4D(xSize, ySize, zSize, wSize, func) {
        for(let x = 0; x < xSize; x++){
            for(let y = 0; y < ySize; y++){
                for(let z = 0; z < zSize; z++){
                    for(let w = 0; w < wSize; w++){
                        func(x, y, z, w);
                    }
                }
            }
        }
    },
    

    /**
     * ===== ===== ===== ===== DATA STRUCTURES ===== ===== ===== =====
     */

    /**
     * Creates an array of numeric values
     * @param {Number} min - starting value (included)
     * @param {Number} max - ending value (included if permitted by step)
     * @param {Number} step - difference between consecutive values
     */
    range(min, max, step){
        step = step || 1;
        let arr = [];
        while(min <= max){
            arr.push(min);
            min += step;
        }
        return arr;
    },

    /**
     * Constructs an Array of size 'len' 
     * using function 'func' to generate the array's content 
     * @param {Number} len - size of the desired array
     * @param {Function} func - array element generator
     */
    constructArray(len, func) {
        let arr = [];
        Gmt.iter1D(len, i => arr.push(func(i)));
        return arr;
    },

    /**
     * Creates a 2D array of specified size and default value
     * @param {Number} sizeX - X size of the array
     * @param {Number} sizeY - Y size of the array
     * @param {Any} defaultValue - default value of the array's element
     */
    array2D(sizeX, sizeY, defaultValue){
        let arr = new Array(sizeX);
        for(let x = 0; x < sizeX; x++){
            let row = new Array(sizeY);
            if(defaultValue != undefined){
                for(let y = 0; y < sizeY; y++){
                    row[y] = defaultValue;
                }
            }
            arr[x] = row;
        }
        return arr;
    },

    /**
     * generates consecutive numbers in an arithmetic series
     */
    Counter : class {

        constructor(baseValue, step){
            this.value = baseValue || 0;
            this.step = step || 0
            this.value -= this.step;
        }

        next() {
            return this.value += this.step;
        }

        reset() {
            this.value = -this.step;
        }
    },

    /**
     * Circular array that can be iterated over in both directions
     */
    RingArray : class {

        constructor(baseArray) {
            this.values = baseArray || [];
            this.i = 0;
        }

        // Adds a new item to the end of the base array
        add(item) {
            this.values.push(item);
            return this;
        }

        // Replaces the current item in the ring
        replace(item) {
            this.values[this.i] = item;
            return this;
        }
        
        // Resets the ring to it's base position 
		reset() {
            this.i = 0;
            return this;
		}

        // returns the current value
        get() {
            return this.values[this.i];
        }

        // Moves the ring to it's next position and returns it's value
        next(step) {
            step = step || 1;
            this.i += step;
            this.i = this.i < this.values.length ? this.i : (this.i - this.values.length);
            return this.get();
        }

        // Moves the ring to it's previous position and returns it's value
        prev(step) {
            step = step || 1;
            this.i -= step;
            this.i = this.i >= 0 ? this.i : (this.values.length + this.i);
            return this.get();
        }
    },

    /**
     * Counter that wraps around from its max value to its min value
     */
    RingCounter : class {

        constructor(min, max, step){
            this.min = min || 0;
            this.max = max || 100;
            this.step = step || 0;
            this.value = this.min - this.step;
        }

        next() {
            this.value += this.step;
            this.value = this.value <= this.max ? this.value : (this.value - this.max + this.min - 1);
            return this.value;
        }

        reset() {
            this.value = this.min - this.step;
            return this;
        }

    },

    /**
     * Array that can be iterated back and forth
     */
    BackAndForthArray : class {

        constructor(baseArray) {
            this.values = baseArray || [];
            this.i = 0;
            this.directionForward = true;
        }

        // Adds a new item to the end of the base array
        add(item) {
            this.values.push(item);
            return this;
        }

        // Replaces the current item in the ring
        replace(item) {
            this.values[this.i] = item;
            return this;
        }
        
        // Resets the ring to it's base position 
		reset() {
            this.i = 0;
            this.directionForward = true;
            return this;
        }
        
        // reverses the direction of the array
        reverse() {
            this.directionForward = !this.directionForward;
            return this;
        }

        // returns the current value
        get() {
            return this.values[this.i];
        }

        // Moves the ring to it's next position and returns it's value
        next(step) {
            step = step || 1;
            if(this.directionForward) {
                this.i += step;
                if(this.i >= this.values.length) {
                    this.i = 2 * this.values.length - this.i;
                    this.directionForward = false;
                }
            } else {
                this.i -= step;
                if(this.i < 0) {
                    this.i *= -1;
                    this.directionForward = true;
                }
            }
            return this.get();
        }

        // Moves the ring to it's previous position and returns it's value
        prev(step) {
            step = step || 1;
            return this.next(-step);
        }

    },

    /**
     * 2D array wrapper class
     */
    Table2D : class {

        constructor(xSize, ySize, defaultValue) {
            this.xSize = xSize;
            this.ySize = ySize;
            this.values = Gmt.array2D(xSize, ySize, defaultValue);
        }

        // returns the the value at position
        get(x, y){
            return this.values[x][y];
        }

        // returns a part of the table as a new Gmt.Table2D
        slice(x, y, width, height) {
            let slice = new Gmt.Table2D(width, height);
            this.iterSlice(x, y, width, height, (xi, yi, e) => {
                slice.put(xi - x, yi - y, e);
            });
            return slice;
        }

        // puts the vlue at a postion an dreturns the table 
        put(x, y, value){
            this.values[x][y] = value;
            return this;
        }

        // iterats over the table's fields and executes the func on each
        // the function can be written as a lambda : (x, y, value) => {}
        iter(func) {
            for(let x = 0; x < this.xSize; x++) {
                for(let y = 0; y < this.ySize; y++) {
                    func(x, y, this.get(x, y));
                }
            }
            return this;
        }

        // iterates over a slice
        iterSlice(x, y, width, height, func) {
            let maxX = x + width;
            let maxY = y + height;
            for(let xi = x; xi < maxX; xi++) {
                for(let yi = y; yi < maxY; yi++) {
                    func(xi, yi, this.get(xi, yi));
                }
            }
            return this;
        } 

        // checks if a position is within the table's range
        isInRange(x, y){
            return x >= 0 && x < this.xSize && y >= 0 && y < this.ySize;
        }

    },

    /**
     * 
     */
    Typed2DArray : class {

        constructor(sizeX, sizeY, type, defaultValue) {
            this._sizeX = sizeX;
            this._sizeY = sizeY;
            arrayClass = arrayClass || Int32Array;
            this._values = new arrayClass(sizeX * sizeY);
            this._values.fill(defaultValue || 0);
        } 

        _convertIndex(x, y) {
            return x + y * this._sizeX;
        };

        get(x, y) {
            return this._values[this._convertIndex(x, y)];
        } 

        put(x, y, value) {
            this._values[this._convertIndex(x, y)] = value;
            return this;
        }

        isInRange(x, y) {
            let index = this._convertIndex(x, y);
            return Gmt.between(index, 0, this._values.length - 1);
        }
    },

    /**
     * ===== ===== ===== ===== GEOMETRY 2D ===== ===== ===== =====
     */

    // const
    PI : Math.PI,
    E : Math.E,
    _RAD_TO_DEG_MOD :180 / Math.PI,
    _DEG_TO_RAD_MOD : Math.PI / 180,

    /**
     * Retuns n radians
     * @param {Number} n - desired number of radiands 
     */
    rad(n) {
        return Gmt.PI * n;
    },

    // converts radians to degrees
    radToDeg(rad) {
        return rad * Gmt._RAD_TO_DEG_MOD;
    },

    // converts degrees to radians
    degToRad(deg) {
        return deg * Gmt._DEG_TO_RAD_MOD;
    },

    /**
     * Converts Polar coordinates to Cartesian coordinates
     * @param {Number} r - radius, direct distance from P(0, 0) 
     * @param {Number} phi - direction / angle [rad]
     */
    polarToCartesian(r, phi) {
        return {
            x: r * Math.cos(phi),
            y: r * Math.sin(phi)
        };
    },

    /**
     * Converts Cartesian coordinates to Polar coordinates
     * @param {Number} x - x position relative to P(0, 0)
     * @param {Number} y - y position relative to P(0, 0)
     */
    cartesianToPolar(x, y) {
        let phi; 
        if(x == 0) {
            if (y > 0) {
                phi = Gmt.PI/2;
            } else {
                phi = Gmt.PI/2 * 3;
            }
        } else {
            phi = Math.atan(y/x);
            if (x < 0) {
                phi += Gmt.PI;
            }
        }
        return {
            r: Gmt.Distance.plain(0, 0, x, y),
            phi: phi
        };
    },

    // Can represent a point or a direction on a 2D plane
    Vertex : class {

        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        move(dx, dy) {
            this.x += dx;
            this.y += dy;
            return this;
        }

        movePolar(distance, direction) {
            let crt = Gmt.polarToCartesian(distance, direction);
            this.move(crt.x, crt.y);
        }

        moveAway(otherVertex, distance) {
            let distanceToOtherVertex = this.distanceTo(otherVertex);
            if(distanceToOtherVertex == 0) {
                return this;
            }
            let d = distance / distanceToOtherVertex;
            let dx = d * (this.x - otherVertex.x);
            let dy = d * (this.y - otherVertex.y);
            return this.move(dx, dy);
        }

        moveTowards(otherVertex, distance) {
            let distanceToOtherVertex = this.distanceTo(otherVertex);
            if(distanceToOtherVertex == 0) {
                return this;
            }
            let d = distance / distanceToOtherVertex;
            let dx = d * (otherVertex.x - this.x);
            let dy = d * (otherVertex.y - this.y);
            return this.move(dx, dy);
        }

        place(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }

        /**
         * Rotates the vertex against a pivot vertex
         * @param {Gmt.Vertex} pivot 
         * @param {Radian} angle 
         */
        rotate(pivot, angle) {
            let r = this.distanceTo(pivot);
            let pCrd = Gmt.cartesianToPolar(this.x - pivot.x, this.y - pivot.y);
            let cCrd = Gmt.polarToCartesian(r, angle + pCrd.phi);
            this.place(cCrd.x + pivot.x, cCrd.y + pivot.y);
            return this;
        }

        toCircle(radius) {
            return new Gmt.Circle(this.x, this.y, radius);
        }

        toRectangle(width, height) {
            return new Gmt.Rectangle(this.x - width/2, this.y - height/2, width, height);
        }

        toSquare(sideLength) {
            return this.toRectangle(sideLength, sideLength);
        }

        copy() {
            return new Gmt.Vertex(this.x, this.y);
        }

        equals(otherVertex) {
            return Gmt.Intersection(this, otherVertex);
        }

        distanceTo(otherVertex) {
            return Gmt.Distance.vertices(this, otherVertex);
        }
    },

    // 2 connected Vertices
    Segment : class {

        constructor(x1, y1, x2, y2) {
            this.start = new Gmt.Vertex(x1, y1);
            this.end = new Gmt.Vertex(x2, y2);
        }

        move(dx, dy) {
            this.start.move(dx, dy);
            this.end.move(dx, dy);
            return this;
        }
        
        movePolar(distance, direction) {
            let crt = Gmt.polarToCartesian(distance, direction);
            this.move(crt.x, crt.y);
        }

        rotate(pivot, angle) {
            this.start.rotate(pivot, angle);
            this.end.rotate(pivot, angle);
            return this;
        }
        
        copy() {
            return new Gmt.Segment(
                this.start.x, this.start.y,
                this.end.x, this.end.y
            );
        }

        length() {
            return Gmt.Distance.vertices(this.start, this.end);
        }
    },

    segmentFromRay(x, y, radius, direction){
        let cart = Gmt.polarToCartesian(radius, direction);
        return new Gmt.Segment(x,  y,  x + cart.x, y + cart.y);
    },  

    // sequence of connected verices
    PolyLine : class {

        constructor(x, y) {
            this.vertices = [];
            if(x && y) {
                this.vertices.push(new Gmt.Vertex(x, y));
            }
        }

        add(x, y) {
            this.vertices.push(new Gmt.Vertex(x, y));
            return this;
        }

        push(vertex) {
            this.vertices.push(vertex);
            return this;
        }

        move(x, y) {
            this.vertices.forEach(e => e.move(x, y));
            return this;
        }

        movePolar(distance, direction) {
            let crt = Gmt.polarToCartesian(distance, direction);
            this.move(crt.x, crt.y);
        }

        rotate(pivot, angle) {
            this.vertices.forEach(e => e.rotate(pivot, angle));
            return this;
        }

        toSegments() {
            let segments = [];
            for(let i = 0; i < this.vertices.length - 1; i++) {
                let v1 = this.vertices[i];
                let v2 = this.vertices[i + 1];
                segments.push(new Gmt.Segment(v1.x, v1.y, v2.x, v2.y));
            }
            return segments;
        }

        toVertices() {
            return this.vertices;
        }

        toPolygon() {
            let pg = new Gmt.Polygon();
            pg.body = this;
            return pg;
        }

        copy() {
            let pl = new Gmt.PolyLine();
            this.vertices.forEach(v => pl.vertices.push(v.copy()));
            return pl;
        }

        length() {
            let len = 0;
            this.toSegments().forEach(s => len += s.length());
            return len;
        }
    },
    
    Polygon : class {

        constructor(x, y) {
            this.body = new Gmt.PolyLine(x, y);
        }

        add(x, y) {
            this.body.add(x, y);
            return this;
        }

        push(vertex) {
            this.body.push(vertex);
            return this;
        }

        move(x, y) {
            this.body.move(x, y);
            return this;
        }

        movePolar(distance, direction) {
            let crt = Gmt.polarToCartesian(distance, direction);
            this.move(crt.x, crt.y);
        }

        rotate(pivot, angle) {
            this.body.rotate(pivot, angle);
            return this;
        }

        toSegments() {
            let segments = this.body.toSegments();
            let vs = this.toVertices()[0];
            let ve = this.toVertices()[this.toVertices().length - 1];
            segments.push(new Gmt.Segment(vs.x, vs.y, ve.x, ve.y));
            return segments;
        }

        toVertices() {
            return this.body.toVertices();
        }

        copy() {
            let pg = new Gmt.Polygon();
            pg.body = this.body.copy();
            return pg;
        }

        getCircumference() {
            let len = 0;
            this.toSegments().forEach(s => len += s.length());
            return len;
        }
    },

    // Has a center and a radius
    Circle : class {

        constructor(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
        }

        move(dx, dy) {
            this.x += dx;
            this.y += dy;
            return this;
        } 

        movePolar(distance, direction) {
            let crt = Gmt.polarToCartesian(distance, direction);
            this.move(crt.x, crt.y);
        }

        rotate(pivot, angle) {
            let center = this.getCenter();
            center.rotate(pivot, angle);
            this.x = center.x;
            this.y = center.y;
            return this;
        }

        scale(scale) {
            this.radius *= scale;
            return this;
        }

        toPolygon(vertices, rotation) {
            return Gmt.polygonInCircle(this, vertices, rotation);
        }

        getCenter() {
            return new Gmt.Vertex(this.x, this.y);
        }

        getArea() {
            return Gmt.PI * Gmt.PI * this.radius;
        }

        getCircumference() {
            return 2 * Gmt.PI * this.radius;
        }

        getDiamater() {
            return 2 * this.radius;
        }

        copy() {
            return new Gmt.Circle(this.x, this.y, this.radius);
        }
    },

    // has a a position, width and height
    Rectangle : class {

        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        move(dx, dy) {
            this.x += dx;
            this.y += dy;
            return this;
        }

        movePolar(distance, direction) {
            let crt = Gmt.polarToCartesian(distance, direction);
            this.move(crt.x, crt.y);
        }

        rotate(pivot, angle) {
            let root = new Gmt.Vertex(this.x, this.y);
            root.rotate(pivot, angle);
            this.x = root.x;
            this.y = root.y;
            return this;
        }
        
        scale(scale) {
            this.width *= scale;
            this.height *= scale;
            return this;
        }

        getCenter() {
            return new Gmt.Vertex(this.x + this.width/2, this.y + this.height/2);
        }

        getArea() {
            return this.width * this.height;
        }

        toVertices() {
            return [
                new Gmt.Vertex(this.x, this.y),
                new Gmt.Vertex(this.x, this.y + this.height),
                new Gmt.Vertex(this.x + this.width, this.y),
                new Gmt.Vertex(this.x + this.width, this.y + this.height)
            ];
        }

        toPolygon(){
            return new Gmt.Polygon(this.x, this.y)
                .add(this.x, this.y + this.height)
                .add(this.x + this.width, this.y)
                .add(this.x + this.width, this.y + this.height);
        }
        
        toSegments() {
            return this.toPolygon().toSegments();
        }

        getCircumference() {
            return 2 * (this.width + this.height);
        }

        getDiagonal() {
            return 2 * this.radius;
        }

        copy() {
            return new Gmt.Rectangle(this.x, this.y, this.width, this.height);
        }
    },

    /**
     * Creates a polyline from a list of coorinates
     * @param  {...Number} coordinates 
     */
    polyLineFromList(...coordinates) {
        if(coordinates.length % 2 != 0) {
            throw "Coordinate list of odd length.";
        }
        let pl = new Gmt.PolyLine();
        for(let i = 0; i < coordinates.length;) {
            pl.add(coordinates[i++], coordinates[i++]);
        }
        return pl;
    },

    /**
     * Creates a polygon from a list of coorinates
     * @param  {...Number} coordinates 
     */
    polygonFromList(...coordinates) {
        if(coordinates.length % 2 != 0) {
            throw "Coordinate list of odd length.";
        }
        let pg = new Gmt.Polygon();
        for(let i = 0; i < coordinates.length;) {
            pg.add(coordinates[i++], coordinates[i++]);
        }
        return pg;
    },

    /**
     * Returns a polygon inscibed in a circle
     * @param {Gmt.Circle} circle - circle in which the polygon is inscribed
     * @param {Number} nofVertices - describes number of desired verices (default = 4)
     * @param {Radian} rotation - describes position of the polygon's first vertex (default = 0)
     */
    polygonInCircle(circle, nofVertices, rotation) {
        nofVertices = nofVertices || 4;
        rotation = rotation || 0;
        let angle = 2 * Gmt.PI / nofVertices;
        let pg = new Gmt.Polygon();
        for(let i = 0; i < nofVertices; i++) {
            let crd = Gmt.polarToCartesian(circle.radius, rotation + angle * i);
            pg.add(circle.x + crd.x, circle.y + crd.y);
        }   
        return pg;
    },


    /**
     * Distance calculator
     */
    Distance : {

        // plain distance between point (x1, y1) and point (x2, y2)
        plain(x1, y1, x2, y2) {
            let dx = x1 - x2;
            let dy = y1 - y2;
            return Math.sqrt(dx * dx + dy * dy);
        },

        // distance between vertices 1 and 2
        vertices(v1, v2) {
            return Gmt.Distance.plain(v1.x, v1.y, v2.x, v2.y);
        },

        // distance between a vertex and a circle 
        // (negative value means that the vertex is inside the circle)
        vertexVsCircle(v, c){
            return Gmt.Distance.plain(v.x, v.y, c.x, c.y) - c.radius;
        },

        // distance between 2 circles 
        // (negative value means that the circles overlap
        circles(c1, c2){
            return Gmt.Distance.plain(c1.x, c1.y, c2.x, c2.y) - c1.radius - c2.radius; 
        }

    },

    /**
     * Collision calculator
     */
    Collision : {

        // true if the position sof the verices are equal
        vertices(v1, v2) {
            return v1.x == v2.x && v1.y == v2.y;
        },

        // true if the distance between the vertex and the circles center 
        // is smaller than the cirlce's radius
        vertexVsCircle(v, c) {
            return Gmt.Distance.vertexVsCircle(v, c) < 0;
        }, 

        // true if the distance between the circless is smaller
        // than the sum of their radii
        circles(c1, c2) {
            return Gmt.Distance.circles(c1, c2) < 0;
        },

        // true if the passed segments intersect
        segments(s1, s2) {
            return Gmt.Intersection.segments(s1, s2).intersect; 
        }

    },

    /**
     * Intersection calculator
     */
    Intersection : {

        // returns 2 segments crossection info
        // @see https://en.wikipedia.org/wiki/Line-line_intersection
        segments(s1, s2) {
            let tNom = (s1.start.x - s2.start.x) * (s2.start.y - s2.end.y) - (s1.start.y - s2.start.y) * (s2.start.x - s2.end.x);
            let uNom = - ((s1.start.x - s1.end.x) * (s1.start.y - s2.start.y) - (s1.start.y - s1.end.y) * (s1.start.x - s2.start.x));
            let tDen = (s1.start.x - s1.end.x) * (s2.start.y - s2.end.y) - (s1.start.y - s1.end.y) * (s2.start.x - s2.end.x);
            if(tDen == 0) { // -> lines are parallel
                return {
                    parallel: true,
                    vertex: null,
                    intersect: false
                };
            } 
            let t = tNom/tDen;
            let u = uNom/tDen;
            return {
                parallel: false,
                vertex: new Gmt.Vertex(s1.start.x + t * (s1.end.x - s1.start.x), s1.start.y + t * (s1.end.y - s1.start.y)),
                intersect: Gmt.between(t, 0, 1) && Gmt.between(u, 0, 1), // -> true if the segments intersect
                t: t,
                u: u
            };
        },

        /**
         * Returns copy of a ray sliced to size by the edge segment 
         * (if no collision has been detected then the original ray is retuned)
         * @param {Gmt.Segment} ray - segment to slice 
         * @param {Gmt.Segment} edge - segment to slice against
         */
        sliceRay(ray, edge) {
            let info = Gmt.Intersection.segments(ray, edge);
            if(info.intersect) {
                ray = ray.copy();
                ray.end = info.vertex;
            } 
            return ray;
        },

        /**
         * Returns the rey segment, sliced against all segmets in edge array
         * @param {Gmt.Segment} ray 
         * @param {Array<Gmt.Segment>} edges 
         */
        castRay(ray, edges) {
            ray = ray.copy();
            edges.forEach(e => {
                ray = Gmt.Intersection.sliceRay(ray, e);
            });
            return ray;
        }

    },


    /**
     * ===== ===== ===== ===== CONCURRENCY / THREADING ===== ===== ===== =====
     */

    /**
     * Executes the passed function with certain time interval between each iteration
     * Example usage:
     *  Gmt.echo(10, 500, i => console.log(i));
     * @param {Number} iterations - number of iteration of the function
     * @param {Number} delay - delay between each iteration, measured in [ms]
     * @param {Function} func - fired oneach iteration, accepts an optional parameter: iteration index 
     */
    echo(iterations, delay, func) {
        Gmt.times(iterations, (i) => setTimeout(func, delay * i, i));
    },

    /**
     * Retursn current time in milliseconds
     */
    now() {
        return new Date().getTime();
    },

    // pseudo threading, interval launcher
    Interval : {

        start(delay, func, arg) {
            return setInterval(func, delay, arg);
        },
    
        close(interval) {
            clearInterval(interval);
            return interval;
        }
    },

    Loop : class {

        constructor(fps, func) {
            this.fps = fps;
            this.func = func;
            this.interval = null;
            this.frameCount = 0;
            this.time = Gmt.now();
        }

        start() {
            this.interval = Gmt.Interval.start(1000/this.fps, (loop) => {
                loop.frameCount++;
                loop.func(loop);
                loop.time = Gmt.now();
            }, this);
            return this;
        }

        stop() {
            Gmt.Interval.close(this.interval);
            return this;
        }

        getFrame() {
            return this.frameCount;
        }

        getDelay() {
            return Gmt.now() - this.time; 
        }

        getFPS() {
            return 1000/this.getDelay();
        }

    },

    
    /**
     * Can be used as a parent class (extended) for any in game entity
     */
    Agent : class {

        constructor(intervalTimer, act) {
            this.interval = null;
            this.intervalTimer = intervalTimer;
        }

        act() {
            // abstract, should be overriden
        }

        start() {
            let agent = this;
            this.interval = setInterval(() => agent.act(), this.intervalTimer);
            return this;
        }

        stop() {
            clearInterval(this.interval);
            this.interval = null;
            return this;
        }

        isActive() {
            return this.interval != null;
        }

    },

    /**
     * 
     */
    Observer : class {

        constructor(options) {

            if(!options.lookup) {
                throw 'No \"lookup\" option given.';
            }

            this.interval = null;
            this.value = null;
            this.lookup = options.lookup;
            this.time = options.time || 200;
            this.onchange = options.onchange || ((newValue, oldValue) => {});
        }

        start() {
            this.value = this.lookup();
            this.interval = setInterval(obs => {
                var newValue = obs.lookup();
                if(obs.value !== newValue) {
                    obs.onchange(newValue, obs.value);
                    obs.value = newValue;
                }
            }, this.time, this);
        }

        stop() {
            clearInterval(this.interval);
            this.interval = null;
        }

    },

    /**
     * ===== ===== ===== ===== Image asset wrappers ===== ===== ===== =====
     */

    Tile : class {
        constructor(imageReference, x, y, width, height) {
            this.img = imageReference;
            this.boudingRect = new Gmt.Rectangle(x, y, width, height);
        }
    },

    TileSet : class {

        constructor(fileUrl, tileSizeX, tileSizeY, borderSize) {
            this.img = new Image();
            this.img.src = fileUrl;
            this.xSize = tileSizeX;
            this.ySize = tileSizeY;
            this.borderSize = borderSize || 1
        }

        get(x, y) {
            return new Gmt.Tile(
                this.img,
                x * (this.xSize + this.borderSize),
                y * (this.ySize + this.borderSize),
                this.xSize,
                this.ySize
            );
        }
    },

    ImageWrapper : class {

        constructor(fileUrl) {
            this.img = new Image();
            this.img.src = fileUrl;
        }

        slice(x, y, width, height) {
            return new Gmt.Tile(this.img, x, y, width, height);
        }

    },

    /**
     * ===== ===== ===== ===== CANVAS UTILS ===== ===== ===== =====
     */

    CanvasWrapper : class {

        constructor(parentID) {
            this.canvas = null;
            this.context = null;
            this.parent = null;
            if(parentID) {
                this.initCanvas(parentID);
                this.refit();    
            }
            this.unit = 1;      // relative size unit (a rectangle of width 10 with unit size of 5 -> 50px rectangle)
            this.offsetX = 0;   // offset from the left of any drawn content vertex with x = 10 with offsetX = 20 -> vertex drawn at 30px from left
            this.offsetY = 0;   // offset from the top ~
        }

        /**
         * Returns a Gmt.Rectangle equal tothe current canvas area
         * This rectangle, when drawn with fillRect() method, will fill the entire canvas
         */
        getBoundingRect() {
            return new Gmt.Rectangle(
                - this.offsetX / this.unit,
                - this.offsetY / this.unit,
                this.canvas.width / this.unit,
                this.canvas.height / this.unit
            );
        }

        /**
         * Returns a CanvasWrapper that references the same canvas 
         * but can have its other properties changed
         */
        getSubWrapper() {
           let sw = new Gmt.CanvasWrapper(); 
           sw.canvas = this.canvas;
           sw.context = this.context;
           sw.parent = this.parent;
           sw.unit = this.unit;
           sw.offsetX = this.offsetX;
           sw.offsetY = this.offsetY;
           return sw;
        }

        // sets the unit size and return the canvas wrapper
        setUnitSize(u) {
            this.unit = u;
            return this;
        }

        // sets the draw offsets and returns the canvas wrapper
        setOffset(offsetX, offsetY) {
            this.offsetX = offsetX;
            this.offsetY = offsetY;
            return this;
        }

        // sets up fill parameters
        setFillStyle(color) {
            this.context.fillStyle = color || 'black';
            return this;
        }

        // sets up stroke parameters
        setStrokeStyle(color, lineWidth) {
            this.context.strokeStyle = color || 'black'
            this.context.lineWidth = (lineWidth || 1) * this.unit;
            return this;
        }

        // initiates canvas a canvas that resizes to fit it's parent div
        initCanvas(parentID) {
            this.canvas = document.createElement('canvas');
            this.canvas.classList.add(`${parentID}-canvas`);
            this.context = this.canvas.getContext('2d');
            this.parent = document.getElementById(parentID);
            this.parent.appendChild(this.canvas);
            let cw = this;
            window.addEventListener('resize', () => cw.refit());
            return this;
        }

        // resizes the canvas to fit it's parent
        refit() {
            this.canvas.width = this.parent.clientWidth;
            this.canvas.height = this.parent.clientHeight;
            return this;
        }

        // clears the entire canvas
        clear() {
            this.context.clearRect(0, 0 , this.canvas.width, this.canvas.height);
            return this;
        }

        // fills the entire canvas with color
        fill(color) {
            this.context.fillStyle = color;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            return this;
        }

        // draws a filled Gmt.Rectangle 
        fillRect(rect, color) {
            this.setFillStyle(color);
            this.context.fillRect(rect.x * this.unit + this.offsetX,  // x
                                  rect.y * this.unit + this.offsetY,  // y
                                  rect.width * this.unit,             // width
                                  rect.height * this.unit);           // height
            return this;
        } 

        // draws an empty Gmt.Rectangle
        strokeRect(rect, color, lineWidth) {
            this.setStrokeStyle(color, lineWidth);
            this.context.strokeRect(rect.x * this.unit + this.offsetX,  // x
                                    rect.y * this.unit + this.offsetY,  // y
                                    rect.width * this.unit,             // width
                                    rect.height * this.unit);           // height
            return this;
        }

        // combines fillRect() and strokeRect() functions
        drawRect(rect, colorFill, colorStroke, lineWidth) {
            this.fillRect(rect, colorFill);
            this.strokeRect(rect, colorStroke || colorFill, lineWidth);
            return this;
        }


        // draws a Gmt.Segment
        strokeSegment(seg, color, lineWidth) {
            this.setStrokeStyle(color, lineWidth);
            this.context.beginPath();
            this.context.moveTo(seg.start.x * this.unit + this.offsetX, seg.start.y * this.unit + this.offsetY);
            this.context.lineTo(seg.end.x * this.unit + this.offsetX, seg.end.y * this.unit + this.offsetY);
            this.context.stroke();
            return this;
        }

        // draws multiple Gmt.Segments
        strokeSegments(segments, color, lineWidth) {
            this.setStrokeStyle(color, lineWidth);
            this.context.beginPath();
            let sts = segments[0];
            this.context.moveTo(
                sts.start.x * this.unit + this.offsetX, 
                sts.start.y * this.unit + this.offsetY
            );
            segments.forEach(seg => {
                this.context.lineTo(
                    seg.end.x * this.unit + this.offsetX, 
                    seg.end.y * this.unit + this.offsetY
                );
            });
            this.context.closePath();
            this.context.stroke();
            return this;
        }

        // draws a Gmt.PolyLine
        strokePolyLine(pline, color, lineWidth) {
            this.strokeSegments(pline.toSegments(), color, lineWidth);
            return this;
        }

        // draws a filled Gmt.Polygon
        fillPolygon(polygon, color) {
            this.setFillStyle(color);
            let vertices = polygon.toVertices();
            let vs = vertices[0];
            this.context.beginPath();
            this.context.moveTo(
                vs.x * this.unit + this.offsetX,
                vs.y * this.unit + this.offsetY,    
            );
            for(let i = 1; i < vertices.length; i++) {
                let v = vertices[i];
                this.context.lineTo(
                    v.x * this.unit + this.offsetX,
                    v.y * this.unit + this.offsetY,    
                );
            }
            this.context.closePath();
            this.context.fill();
            return this;
        }

        // draws an empty Gmt.Polygon
        strokePolygon(polygon, color, lineWidth) {
            this.strokeSegments(polygon.toSegments(), color, lineWidth);
            return this;
        }

        // combines fillPolygon() and strokePolygon() functions
        drawPolygon(rect, colorFill, colorStroke, lineWidth) {
            this.fillPolygon(rect, colorFill);
            this.strokePolygon(rect, colorStroke || colorFill, lineWidth);
            return this;
        }

        // draws a filled Gmt.Circle
        fillCircle(circle, color) {
            this.setFillStyle(color);
            this.context.beginPath();
            this.context.arc(circle.x * this.unit + this.offsetX, 
                             circle.y * this.unit + this.offsetY, 
                             circle.radius * this.unit, 0, Gmt.PI * 2);
            this.context.fill();
            return this;
        }

        // draws an empty Gmt.Circle
        strokeCircle(circle, color, lineWidth) {
            this.setStrokeStyle(color, lineWidth);
            this.context.beginPath();
            this.context.arc(circle.x * this.unit + this.offsetX, 
                             circle.y * this.unit + this.offsetY, 
                             circle.radius * this.unit, 0, Gmt.PI * 2);
            this.context.stroke();
            return this;
        }

        // combines fillCircle() and strokeCircle() functions
        drawCircle(rect, colorFill, colorStroke, lineWidth) {
            this.fillCircle(rect, colorFill);
            this.strokeCircle(rect, colorStroke || colorFill, lineWidth);
            return this;
        }

        // writes text 
        write(content, x, y, color, size, font) {
            this.setFillStyle(color);
            size = size || 12;      // default size
            font = font || 'Arial'; // default font
            this.context.font = `${parseInt(size * this.unit)}px ${font}`;
            this.context.fillText(
                content, 
                x * this.unit + this.offsetX,
                y * this.unit + this.offsetY
            );
            return this;
        }

        // draws a tileset tile on canvas
        drawTile(tile, targetRect, rotation, alpha) {

            // context settings changes
            this.context.save();
            this.context.globalAlpha = alpha || 1
            this.context.translate(
                targetRect.x * this.unit + this.offsetX,
                targetRect.y * this.unit + this.offsetY,
            ); 
            this.context.rotate(rotation || 0);

            // drawing proper
            this.context.drawImage(
                tile.img,               
                tile.boudingRect.x,                 
                tile.boudingRect.y,
                tile.boudingRect.width, 
                tile.boudingRect.height,
                - targetRect.width/2 * this.unit,
                - targetRect.height/2 * this.unit,
                targetRect.width * this.unit,
                targetRect.height * this.unit
            );

            // context setting restore
            this.context.restore();
            return this;
        }
        
        // ===== colors =====

        /**
         * Generate rgb color string
         * @param {Number} r - red 0-255 
         * @param {Number} g - green 0-255
         * @param {Number} b - blue 0-255
         */
        rgb(r, g, b) {
            return Gmt.rgb(r, g, b);
        }

        /**
         * Generate rgb color string with alpha
         * @param {Number} r - red 0-255 
         * @param {Number} g - green 0-255
         * @param {Number} b - blue 0-255
         * @param {Number} a - alpha 0-1
         */
        rgba(r, g, b, a) {
            return Gmt.rgba(r, g, b, a);
        }
        
        /**
         * Generate linear gradient 
         * @param {Gmt.Vertex} startVertex - gradient start vertex
         * @param {Gmt.Vertex} endVertex - gradient end vertex
         * @param {any} colorInfo -  1. step 0-1, 2. RGB, 1. ...
         */
        linearGradient(startVertex, endVertex, ...colorInfo) {
            let grd = this.context.createLinearGradient(
                startVertex.x * this.unit + this.offsetX, 
                startVertex.y * this.unit + this.offsetY, 
                endVertex.x * this.unit + this.offsetX, 
                endVertex.y * this.unit + this.offsetY
            );
            for(let i = 0; i < colorInfo.length;) {
                grd.addColorStop(colorInfo[i++], colorInfo[i++]);
            }
            return grd;
        }

        /**
         * Generate linear gradient 
         * @param {Gmt.Circle} startCircle - gradient start circle
         * @param {Gmt.Circle} endCircle - gradiendt end circle
         * @param {any} colorInfo -  1. step 0-1, 2. RGB, 1. ...
         */
        radialGradient(startCircle, endCircle, ...colorInfo) {
            let grd = this.context.createRadialGradient(
                startCircle.x * this.unit + this.offsetX, 
                startCircle.y * this.unit + this.offsetY, 
                startCircle.radius * this.unit,
                endCircle.x * this.unit + this.offsetX, 
                endCircle.y * this.unit + this.offsetY, 
                endCircle.radius * this.unit
            );
            for(let i = 0; i < colorInfo.length;) {
                grd.addColorStop(colorInfo[i++], colorInfo[i++]);
            }
            return grd;
        }

    },

    /**
     * Generate rgb color string
     * @param {Number} r - red 0-255 
     * @param {Number} g - green 0-255
     * @param {Number} b - blue 0-255
     */
    rgb(r, g, b) {
        return `rgb(${r}, ${g}, ${b})`;
    },

    /**
     * Generate rgb color string with alpha
     * @param {Number} r - red 0-255 
     * @param {Number} g - green 0-255
     * @param {Number} b - blue 0-255
     * @param {Number} a - alpha 0-1
     */
    rgba(r, g, b, a) {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    },

    /**
     * ===== ===== ===== ===== AUDIO ===== ===== ===== =====
     */
    AudioWrapper : class {

        constructor(fileUrl){
            this.src = fileUrl;
            this.audio = new Audio(fileUrl);
        }
    
        play(){
            this.audio.play();
            return this;
        }

        volume(vol) {
            this.audio.volume = Gmt.clamp(vol, 0, 1);
            return this;
        }

        volumeEaseTo(vol, duration) {
            let a = this.audio;
            let dv = (Gmt.clamp(vol, 0, 1) - a.volume) / 10;
            Gmt.echo(10, duration/10, () => a.volume += dv);
            return this;
        }

        rate(rate) {
            if(rate < 0) {
                return this.pause();
            }
            this.audio.playbackRate = rate;
            return this;
        }

        rateEaseTo(rate, duration) {
            let a = this.audio;
            let dr = (rate - a.playbackRate) / 10;
            Gmt.echo(10, duration/10, () => {
                if (a.playbackRate + dr <= 0) {
                    return;
                }
                a.playbackRate += dr;       
            });
            return this;
        }
    
        pause(){
            this.audio.pause();
            return this;
        }
    
        time(time){
            this.audio.currentTime = time;
            return this;
        }

        rewind(){
           return this.time(0);
        }

        reset(){
            return this.volume(1).rate(1).rewind().pause();
        }

        source(src) {
            this.src = src;
            this.audio = new Audio(src);
            return this;
        }
    
        isOn(){     
            return this.audio.paused();
        }

        getDuration() {
            return this.audio.duration;
        }

    },

    /**
     * ===== ===== ===== ===== USER INPUT ===== ===== ===== =====
     */

    Input : {
        
        _keys : {},

        _mouse : {
           posX: 0,
           moveX: 0,
           posY: 0,
           moveY: 0,
           left: false,
           middle: false,
           right: false,
        },

        /**
         * Initalizes Input listeners
         * @param {String(ID)} targetID - target of the input listeners (default = document)
         */
        init(targetId) {
            
            // event listerens target
            let target = targetId ? document.getElementById(targetId) : document;
            if(!target) {
                throw `Failure locating target element of ID \"${targetId}\".`;
            }
            
            // mouse listeners
            target.onmousemove = (e) => {
                Gmt.Input._mouse.posX = e.x;
                Gmt.Input._mouse.moveX = e.movementX;
                Gmt.Input._mouse.posY = e.y;
                Gmt.Input._mouse.moveY = e.movementY;
            };

            target.onmousedown = (e) => {
                switch(e.button) {
                    case 0: this._mouse.left = true; break;
                    case 1: this._mouse.middle = true; break;
                    case 2: this._mouse.right = true; break;
                }
            };
            target.onmouseup = (e) => {
                switch(e.button) {
                    case 0: this._mouse.left = false; break;
                    case 1: this._mouse.middle = false; break;
                    case 2: this._mouse.right = false; break;
                }
            };

            // key listeners
            target.onkeydown = (e) => {
                Gmt.Input._keys[e.code] = true;
            };
            target.onkeyup = (e) => {
                Gmt.Input._keys[e.code] = false;
            };

            // disable context menu on right click
            target.oncontextmenu = () => {return false;};
        },

        /**
         * Returns true if characted of the specifie code has been pressed
         * For keycode names:
         * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
         * @param {String} keycode 
         */
        key(code) {
            if(code in this._keys) {
                return this._keys[code];
            }
            return false;
        },

        // returns true if all of the keys specified are pressed
        keys(...codes) {
            for(let i = 0; i < codes.length; i++) {
                if(!this.key(codes[i])) {
                    return false;
                }
            }
            return true;
        },

        handleKeys(...args) {
            for(let i = 0; i < args.length;) {
                if(this.key(args[i++])){
                    args[i++]();
                }
            }
        },

        // returns mouse position in window vertex
        mousePos() {
            return {
                x: this._mouse.posX,
                y: this._mouse.posY
            };
        },

        mousePosVertex() {
            return new Gmt.Vertex(this._mouse.posX, this._mouse.posY);
        },

        /**
         * Returns mouse position adjusted for passed canvas wrapper
         * @param {Gmt.CanvasWrapper} cw 
         */
        mousePosCW(cw) {
            return {
                x: (this._mouse.posX - cw.offsetX) / cw.unit,
                y: (this._mouse.posY - cw.offsetY) / cw.unit
            };
        },

        mousePosVertexCW(cw) {
            return new Gmt.Vertex(
                (this._mouse.posX - cw.offsetX) / cw.unit,
                (this._mouse.posY - cw.offsetY) / cw.unit
            );
        },


        // returns mouse movement vector
        mouseMove() {
            return {
                x: this._mouse.moveX,
                y: this._mouse.moveY
            };
        },

        /**
         * Returns mouse movement vector adjusted for passed canvas wrapper
         * @param {Gmt.CanvasWrapper} cw 
         */
        mouseMoveCW(cw) {
            return {
                x: this._mouse.moveX / cw.unit,
                y: this._mouse.moveY / cw.unit
            };
        },

        // returns mouse button state
        mouseButtons() {
            return {
                left: this._mouse.left,
                middle: this._mouse.middle,
                right: this._mouse.right
            };
        }

    },

    /**
     * Dice roll generator
     */
    Dice : {

        d4() {
          return Gmt.randInt(1, 4);  
        },

        d4s(number) {
            let rolls = [];
            Gmt.iter1D(number, () => rolls.push(Gmt.Dice.d4()));
            return rolls;
        },

        d6() {
            return Gmt.randInt(1, 6);  
        },

        d6s(number) {
            let rolls = [];
            Gmt.iter1D(number, () => rolls.push(Gmt.Dice.d6()));
            return rolls;
        },

        d8() {
            return Gmt.randInt(1, 8);  
        },

        d8s(number) {
            let rolls = [];
            Gmt.iter1D(number, () => rolls.push(Gmt.Dice.d8()));
            return rolls;
        },

        d10() {
        return Gmt.randInt(1, 10);  
        },

        d10s(number) {
            let rolls = [];
            Gmt.iter1D(number, () => rolls.push(Gmt.Dice.d10()));
            return rolls;
        },

        d12() {
            return Gmt.randInt(1, 12);  
        },
    
        d12s(number) {
            let rolls = [];
            Gmt.iter1D(number, () => rolls.push(Gmt.Dice.d12()));
            return rolls;
        },

        d20() {
            return Gmt.randInt(1, 20);  
        },

        d20s(number) {
            let rolls = [];
            Gmt.iter1D(number, () => rolls.push(Gmt.Dice.d20()));
            return rolls;
        }
    },
}