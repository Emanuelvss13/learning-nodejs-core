class EventEmitter {

  constructor(){}

  listeners = {};  // key-value pair
  
  addListener(eventName, fn) {

    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(fn);
    return this

  }

  on(eventName, fn) {
    this.addListener(eventName, fn);
  }
  
  removeListener(eventName, fn) {

    let listners = this.listeners[eventName]

    if(!listners) return this

    const index = listners.findIndex(listner => listner === fn)

    this.listeners[eventName].splice(index, 1)
  }
  
  off(eventName, fn) {
    return this.removeListener(eventName, fn);
  }
  
  once(eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || [];

    const onceWrapper = () => {
      fn()
      this.off(eventName, onceWrapper)
    }

    this.listeners[eventName].push(onceWrapper)

    return this
  }
  
  emit(eventName, ...args) {
    let fns = this.listeners[eventName];
    if (!fns) return false;
    fns.forEach((f) => {
      f(...args);
    });
    return true;
  }
  
  listenerCount(eventName) {
    let fns = this.listeners[eventName] || [];
    return fns.length;
  }
  
  rawListeners(eventName) {
    return this.listeners[eventName];
  }
}

module.exports = EventEmitter