document.getElementById('formularioDeLogin').onsubmit = async (evento) => {
    evento.preventDefault()

    const usuarioLogado = await chamandoServer('/login', 'POST', {
        login: document.getElementById('login').value,
        senha: document.getElementById('senha').value,
    })
    if (usuarioLogado.erro){
        alert(usuarioLogado.erro)
        return
    }
    if(usuarioLogado.user && usuarioLogado.user.nome){
        location.href = 'index.html?nome=' + encodeURIComponent(usuarioLogado.user.nome)
    }
}