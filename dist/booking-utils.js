/* Shared, dependency-free booking rules, also exercised by Node tests. */
(function (root) {
  const AREAS = ['Direito Trabalhista', 'Direito Previdenciário', 'Preciso de orientação'];
  const FORMATS = ['Online', 'Presencial'];
  const PERIODS = ['Sem preferência', 'Manhã', 'Tarde'];
  function dateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }
  function parseDate(key) {
    if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key)) throw new Error('Escolha uma data válida.');
    const [y,m,d] = key.split('-').map(Number), date = new Date(y,m-1,d);
    if (dateKey(date) !== key) throw new Error('Escolha uma data válida.');
    return date;
  }
  function brazilToday(now = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', {timeZone:'America/Fortaleza',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
    const get = type => parts.find(p=>p.type===type).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  }
  function validate(input, todayKey = brazilToday()) {
    parseDate(input.date);
    if (input.date < todayKey) throw new Error('A data escolhida já passou. Selecione uma nova data.');
    if (!AREAS.includes(input.area) || !FORMATS.includes(input.format) || !PERIODS.includes(input.period)) throw new Error('Confira o assunto e suas preferências.');
    return {date:input.date, area:input.area, format:input.format, period:input.period};
  }
  function message(input, todayKey) {
    const value = validate(input,todayKey);
    const date = new Intl.DateTimeFormat('pt-BR',{dateStyle:'full'}).format(parseDate(value.date));
    return `Olá, Samila! Gostaria de solicitar uma consulta.\nÁrea: ${value.area}\nAtendimento: ${value.format}\nData de preferência: ${date}\nPeríodo de preferência: ${value.period}\nPodemos combinar um horário? Entendo que a data e o horário dependem de confirmação.`;
  }
  const api = {AREAS,FORMATS,PERIODS,dateKey,parseDate,brazilToday,validate,message};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BookingUtils = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
