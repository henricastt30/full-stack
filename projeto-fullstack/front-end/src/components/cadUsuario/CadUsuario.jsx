import { useEffect } from 'react';

const CadUsuario = () => {
    useEffect(() => {
        const form = document.getElementById('frmCadUsuario');

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const idade = document.getElementById('idade').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            const url = 'http://localhost:3000/registrar';

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ nome, idade, email, senha }),
            })
                .then((res) => {
                    if (!res.ok) {
                        console.log('Erro ao cadastrar');
                        return;
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data) {
                        alert('Cadastro bem sucedido');
                    }
                })
                .catch((error) => console.log(error));
        });
    }, []);
    return (
        <>
            <form id="frmCadUsuario">
                <div className="mb-3">
                    <label htmlFor="nome" className="form-label">Nome</label>
                    <input type="text" className="form-control" id="nome" />
                    <label htmlFor="idade" className="form-label">Idade</label>
                    <input type="number" className="form-control" id="idade" />
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="name@example.com" />
                    <label htmlFor="senha" className="form-label">Senha</label>
                    <input type="password" className="form-control" id="senha" />
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </>
    )
}

export default CadUsuario