const {test}=require('node:test');
const assert=require('node:assert/strict');
const U=require('../dist/booking-utils.js');
const base={date:'2026-09-12',format:'Online',area:'Direito Trabalhista',period:'Manhã'};
test('Uses the date in Paraiba even after UTC midnight',()=>{assert.equal(U.brazilToday(new Date('2026-09-12T01:30:00Z')),'2026-09-11')});
test('Rejects nonexistent dates and accepts a real leap day',()=>{assert.throws(()=>U.parseDate('2026-02-29'));assert.throws(()=>U.parseDate('2026-13-01'));assert.equal(U.dateKey(U.parseDate('2028-02-29')),'2028-02-29')});
test('Rejects a stale request after the date passes',()=>{assert.throws(()=>U.validate(base,'2026-09-13'),/já passou/);assert.deepEqual(U.validate(base,'2026-09-12'),base)});
test('Rejects injected values and invalid selections',()=>{assert.throws(()=>U.validate({...base,area:'<script>'},'2026-09-11'));assert.throws(()=>U.validate({...base,period:'03:00'},'2026-09-11'))});
test('Message includes all choices and says confirmation is required',()=>{const m=U.message(base,'2026-09-11');assert.match(m,/Manhã/);assert.match(m,/Direito Trabalhista/);assert.match(m,/Online/);assert.match(m,/dependem de confirmação/);assert.equal(decodeURIComponent(encodeURIComponent(m)),m)});
