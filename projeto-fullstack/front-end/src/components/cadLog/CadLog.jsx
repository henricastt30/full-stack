import { useEffect } from 'react';
import style from './cadLog.module.css'

const CadLog = () => {
    useEffect(() => {
        const form = document.getElementById('frmCadLog');

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const categoria = document.getElementById('categoria').value;
            const horasTrabalhadas = document.getElementById('horasTrabalhadas').value;
            const linhasCodigo = document.getElementById('linhasCodigo').value;
            const bugsCorrigidos = document.getElementById('bugsCorrigidos').value;

            const url = 'http://localhost:3000/logs';

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ categoria, horasTrabalhadas, linhasCodigo, bugsCorrigidos }),
            })
                .then((res) => {
                    if (!res.ok) {
                        console.log('Erro ao enviar');
                        return;
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data) {
                        alert('Envio bem sucedido');
                    }
                })
                .catch((error) => console.log(error));
        });
    }, []);
    return (
        <>
        <form id="frmCadLog">
            <div className="mb-3">
                <label for="categoria" className="form-label">Categoria</label>
                <input type="text" className="form-control" id="categoria" placeholder="Categoria..." />
                <label for='horasTrabalhadas' className='form-label'>Horas Trabalhadas</label>
                <input type="number" className='form-control' id='horasTrabalhadas' placeholder='Insira em horas' />
                <label for='linhasCodigo' className='form-label'>Linhas de Código</label>
                <input type="number" className='form-control' id='linhasCodigo' placeholder='' />
                <label for='bugsCorrigidos' className='form-label'>Bugs Corrigidos</label>
                <input type="number" className='form-control' id='bugsCorrigidos' placeholder='' />
            </div>
            <button type="submit" className="btn btn-primary">
                Submit
            </button>
        </form>
        </>
    )
}

export default CadLog