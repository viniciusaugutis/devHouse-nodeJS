/* metodos: index, show, update, store, destroy
  index: listagem de sessoes
  store: criar uma sessão
  update: listar uma única sessão
  update: alterar uma sessão
  destroy: deletar uma sessão
*/

import * as Yup from 'yup';
import User from '../models/User'; // const user = require('../models/User');

class SessionController {
  async store(req, res) {
    const { email } = req.body;

    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Email deve ser válido' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email });
    }

    return res.json(user);
  }
}

export default new SessionController();
