const FlowEvents = {
  START: 'START',
  END: 'END',
  ERROR: 'ERROR',
  DEFER_START: 'DEFER_START',
  DEFER_END: 'DEFER_END',
  NODE_START: 'NODE_START',
  NODE_END: 'NODE_END',
  NODE_ERROR: 'ERROR',
};

/**
 * Base event generator.
 * @param {string} type - the event type
 * @param {object} [data] - the event data
 * @returns {object} the event object
 */
const baseEvent = function baseEvent(type, data) {
  const hrtime = process.hrtime();
  return {
    type,
    time: new Date().toUTCString(),
    time: {
      seconds: hrtime[0],
      nanoseconds: hrtime[1]
    },
    ...data,
  };
};

/**
 * Emit the event
 * @param {string} type - the event type
 * @param {object} [data] - the event data
 */
const event = function event(type, data) {
  const eventObject = baseEvent(type, data);
  this.emit(eventObject.type, eventObject);
};

module.exports = {
  FlowEvents,
  event,
  baseEvent,
};
