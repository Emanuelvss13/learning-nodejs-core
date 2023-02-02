const EventEmitter = require('./custom-event-emitter')


console.log(EventEmitter);

const myEmitter = new EventEmitter();

// Example 1 — Create an event emitter instance and register a couple of callbacks


function c1() {
  console.log("Event");
}

function c2() {
  console.log("Another Event");
}

myEmitter.on("eventOne", c1);
myEmitter.on("eventOne", c2);

myEmitter.emit('eventOne');

// Example 2— Registering for the event to be fired only one time using once.

myEmitter.once("eventOne", () => console.log('eventOnce once fired'))

myEmitter.emit('eventOne');
myEmitter.emit('eventOne');
console.log('eventOnce once fired, must be appear one time');

// Example 3 — Registering for the event with callback parameters

myEmitter.on('status', (code, msg)=> console.log(`Got ${code} and ${msg}`));

myEmitter.emit('status', 200, 'ok');

//Example 4 — Unregistering events

myEmitter.off('eventOne', c1);

// Example 5— Getting Listener count

console.log(myEmitter.listenerCount('eventOne'));

//Example 6— Getting Raw Listeners

console.log(myEmitter.rawListeners('eventOne'));

// Example 7— Async Example demo

class WithTime extends EventEmitter {

  execute(asyncFunc, ...args) {
    this.emit('begin')
    console.time('execute')

    this.on('data', (data) => console.log('data: ', data))

    asyncFunc(...args, (err, data) => {
      if(err) {
        return this.emit('error', err)
      }

      this.emit('data', data)
      console.timeEnd('execute')
      this.emit('end')
    })
  }
}

const withTime = new WithTime();

withTime.on('begin', () => console.log('About to execute'));
withTime.on('end', () => console.log('Done with execute'));

const readFile = (url, cb) => {
  fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
      cb(null, data);
    });
}

withTime.execute(readFile, 'https://jsonplaceholder.typicode.com/posts/1');

// to run use this flag: node --experimental-fetch