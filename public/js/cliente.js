let listaDeClientes = [];

async function carregarClientes() {
  listaDeClientes = await chamandoServer('/cliente');
  document.getElementById('tabela').innerHTML = listaDeClientes.map(cliente => `
    <tr>
      <td>${cliente.nome}</td>
      <td>${cliente.cpf}</td>
      <td>${cliente.telefone}</td>
      <td>
        <button type="button" onclick="preencherFormularioDeCliente(${cliente.id})">Editar</button>
        <button type="button" onclick="excluirCliente(${cliente.id})">Excluir</button>
      </td>
    </tr>
  `).join('');
}

function limparFormularioDeCliente() {
  document.getElementById('formulario').reset();
  document.getElementById('id').value = '';
}

function preencherFormularioDeCliente(id) {
  const cliente = listaDeClientes.find(clienteDaLista => clienteDaLista.id == id);
  document.getElementById('id').value = cliente.id;
  document.getElementById('nome').value = cliente.nome;
  document.getElementById('cpf').value = cliente.cpf;
  document.getElementById('telefone').value = cliente.telefone;
}

async function excluirCliente(id) {
  await chamandoServer('/cliente/' + id, 'DELETE');
  carregarClientes();
}

document.getElementById('formulario').onsubmit = async (evento) => {
  evento.preventDefault();
  const idDoRegistro = document.getElementById('id').value;
  const dadosDoCliente = {
    nome: document.getElementById('nome').value,
    cpf: document.getElementById('cpf').value,
    telefone: document.getElementById('telefone').value,
  };

  if (idDoRegistro) await chamandoServer('/cliente/' + idDoRegistro, 'PUT', dadosDoCliente);
  else await chamandoServer('/cliente', 'POST', dadosDoCliente);
  limparFormularioDeCliente();
  carregarClientes();
};

carregarClientes();