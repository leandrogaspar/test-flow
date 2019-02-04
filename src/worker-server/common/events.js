const FlowEvents = {
  START: 'START',
  DEFER_START: 'DEFER_START',
  END: 'END',
  ERROR: 'ERROR',
  NODE_START: 'NODE_START',
  NODE_END: 'NODE_END',
  NODE_ERROR: 'ERROR',
};

/**
 * Base event generator.
 * @param {string} type - The event type
 * @returns {object} The event
 */
const event = function event(type, data) {
  return {
    type,
    time: new Date().toUTCString(),
    hrtime: process.hrtime(),
    ...data,
  };
};

/**
 * Emmit the event
 * @param {object} events
 * @param {any} [args] optional args
 */
const emit = function emit(type, data) {
  const eventObject = event(type, data);
  this.emit(eventObject.type, eventObject);
};

module.exports = {
  FlowEvents,
  emit,
  event,
};
