let listaDeAgendamento = []

async function carregarAgendamento() {
    const veiculos = await chamandoServer('/veiculo')

    document.getElementById('id_cliente').innerHTML =
        '<option value="">Selecione o veículo</option>' +
        veiculos.map(cliente => `
            <option value="${cliente.id}">
              
            </option>
        `).join('')

    listaDeAgendamento = await chamandoServer('/agendamento')

    document.getElementById('tabela').innerHTML =
        listaDeAgendamento.map(agendamento => `
            <tr>
                <td>${agendamento.data_agendamento}</td>
                <td>${agendamento.servico}</td>
                <td>${agendamento.cliente}</td>
               
                <td>
                    <button type="button" onclick="preencherFormularioDeAgendamento(${agendamento.id})">Editar</button>
                    <button type="button" onclick="excluirAgendamento(${agendamento.id})">Excluir</button>
                </td>
            </tr>
        `).join('')
}

function limparFormularioDeAgendamento() {
    document.getElementById('formulario').reset()
    document.getElementById('id').value = ''
}

function preencherFormularioDeAgendamento(idDoAgendamento) {
    const agendamento = listaDeAgendamento.find(
        agendamentoDaLista => agendamentoDaLista.id == idDoAgendamento
    )

    document.getElementById('id').value = agendamento.id
    document.getElementById('data_agendamento').value = agendamento.data_agendamento
    document.getElementById('servico').value = agendamento.servico
    
}

async function excluirAgendamento(idDoAgendamento) {
    await chamandoServer('/agendamento/' + idDoAgendamento, 'DELETE')
    await carregarAgendamento()
}

document.getElementById('formulario').onsubmit = async (evento) => {
    evento.preventDefault()

    const id = document.getElementById('id').value

    const dadosDoAgendamento = {
        data_agendamento: document.getElementById('data_agendamento').value,
        servico: document.getElementById('servico').value,
    }

    if (id) {
        await chamandoServer('/agendamento/' + id, 'PUT', dadosDoAgendamento)
    } else {
        await chamandoServer('/agendamento', 'POST', dadosDoAgendamento)
    }

    limparFormularioDeAgendamento()
    await carregarAgendamento()
}

carregarAgendamento()
