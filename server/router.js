const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  controllers.Gatcha.make();
  console.log('Gatcha Created');
  app.get('/getToken', controllers.Account.getToken);
  app.get('/getTeam', mid.requiresLogin, controllers.Characters.getTeam);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/main', mid.requiresLogin, controllers.Characters.mainPage);
  app.post('/main', mid.requiresLogin, controllers.Characters.roll);
  app.get('/getGatcha', controllers.Gatcha.getGatcha);
  app.get('/check', mid.requiresLogin, controllers.Account.currency);
  app.post('/check', mid.requiresLogin, controllers.Account.updateCurr);
  app.get('/password', mid.requiresSecure, mid.requiresLogin, controllers.Characters.passwordPage);
  app.post('/password', mid.requiresSecure, mid.requiresLogin, controllers.Characters.password);
  app.get('/pay', mid.requiresSecure, mid.requiresLogin, controllers.Account.payPage);
  app.post('/pay', mid.requiresSecure, mid.requiresLogin, controllers.Account.updateCurr);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
