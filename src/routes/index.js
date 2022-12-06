const contracts = require('./contracts');
const balances = require('./balances');
const jobs = require('./jobs');
const admin = require('./admin');

const routes = (app) => {
    app.use('/contracts', contracts);
    app.use('/balances', balances);
    app.use('/jobs', jobs);
    app.use('/admin', admin);
}

module.exports = routes;