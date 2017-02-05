import {
	Suite
} from 'benchmark'

const id = x => x
const suite = new Suite('Either')

suite
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run()
