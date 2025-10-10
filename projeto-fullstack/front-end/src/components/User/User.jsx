import style from './user.module.css'

const User = () => {
  document.getElementById(frmLogin).addEventListener('submit', function(){

    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value

    const url = 'localhost:3000/login'

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({email, senha})
    })
    .then((res) => {
      if(!res.ok)
      console.log("Erro ao fazer login")
    return res.json()
    }).then((data) => {
      if(data)
        return alert("Login bem sucedido")
    })
    .catch((error) => console.log(error))
  })
    return (
        <>
            <form id='frmLogin'>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1"/>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
        </>
    )
}

export default User;