"use strict";

var FixedDensityPDS = require('./implementations/fixed-density');
var VariableDensityPDS = require('./implementations/variable-density');

/**
 * PoissonDiskSampling constructor
 * @param {object} options Options
 * @param {Array} options.shape Shape of the space
 * @param {float} options.minDistance Minimum distance between each points
 * @param {float} [options.maxDistance] Maximum distance between each points, defaults to minDistance * 2
 * @param {int} [options.tries] Number of times the algorithm will try to place a point in the neighbourhood of another points, defaults to 30
 * @param {function|null} [options.distanceFunction] Function to control the distance between each point depending on their position, must return a value between 0 and 1
 * @param {function|null} [options.bias] When using a distanceFunction, will indicate which point constraint takes priority when evaluating two points (0 for the lowest distance, 1 for the highest distance), defaults to 0.
 * @param {function|null} [rng] RNG function, defaults to Math.random
 * @constructor
 */
function PoissonDiskSampling (options, rng) {
    rng = rng || Math.random;

    options.maxDistance = options.maxDistance || options.minDistance * 2;
    options.tries = Math.ceil(Math.max(1, options.tries || 30));

    this.shape = options.shape;

    if (options.minDistance !== options.maxDistance && typeof options.distanceFunction === 'function') {
        options.bias = Math.max(0, Math.min(1, options.bias || 0));

        this.implementation = new VariableDensityPDS(options, rng);
    } else {
        this.implementation = new FixedDensityPDS(options, rng);
    }
}

PoissonDiskSampling.prototype.implementation = null;

/**
 * Add a totally random point in the grid
 * @returns {Array} The point added to the grid
 */
PoissonDiskSampling.prototype.addRandomPoint = function () {
    return this.implementation.addRandomPoint();
};

/**
 * Add a given point to the grid
 * @param {Array} point Point
 * @returns {Array|null} The point added to the grid, null if the point is out of the bound or not of the correct dimension
 */
PoissonDiskSampling.prototype.addPoint = function (point) {
    return this.implementation.addPoint(point);
};

/**
 * Try to generate a new point in the grid, returns null if it wasn't possible
 * @returns {Array|null} The added point or null
 */
PoissonDiskSampling.prototype.next = function () {
    return this.implementation.next();
};

/**
 * Automatically fill the grid, adding a random point to start the process if needed.
 * Will block the thread, probably best to use it in a web worker or child process.
 * @returns {Array[]} Sample points
 */
PoissonDiskSampling.prototype.fill = function () {
    return this.implementation.fill();
};

/**
 * Get all the points in the grid.
 * @returns {Array[]} Sample points
 */
PoissonDiskSampling.prototype.getAllPoints = function () {
    return this.implementation.getAllPoints();
};

/**
 * Reinitialize the grid as well as the internal state
 */
PoissonDiskSampling.prototype.reset = function () {
    this.implementation.reset();
};

module.exports = PoissonDiskSampling;
