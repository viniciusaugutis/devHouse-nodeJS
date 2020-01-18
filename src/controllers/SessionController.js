/*metodos: index, show, update, store, destroy
  index: listagem de sessoes
  store: criar uma sessão
  update: listar uma única sessão
  update: alterar uma sessão
  destroy: deletar uma sessão
*/

import User from '../models/User';  //const user = require('../models/User');

class SessionController {

  async store(req, res) {
    const { email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email });
    }

    return res.json(user);
  }

}

export default new SessionController();