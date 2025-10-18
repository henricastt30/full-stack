import { useEffect } from 'react';
import style from './user.module.css';

const User = () => {
  useEffect(() => {
    const form = document.getElementById('frmLogin');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;

      const url = 'http://localhost:3000/login';

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      })
        .then((res) => {
          if (!res.ok) {
            console.log('Erro ao fazer login');
            return;
          }
          return res.json();
        })
        .then((data) => {
          if (data) {
            alert('Login bem sucedido');
          }
        })
        .catch((error) => console.log(error));
    });
  }, []);

  return (
    <>
      <form id="frmLogin">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="senha" className="form-label">
            Password
          </label>
          <input type="password" className="form-control" id="senha" />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
};

export default User;
