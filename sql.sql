create table if not exists usuario(
id serial primary key,
nome varchar(100) not null,
login varchar(100) not null unique,
senha text not null
);

create table if not exists cliente(
id serial primary key,
nome varchar(100) not null,
cpf varchar(100) not null,
telefone varchar(100) not null
);

create table if not exists veiculo(
id serial primary key,
placa varchar(100) not null,
modelo varchar(100) not null,
ano int not null,
id_cliente int not null,
foreign key (id_cliente) references cliente(id)
);

create table if not exists agendamento(
id serial primary key,
data_agendamento date not null,
servico varchar(100) not null,
id_veiculo int not null,
foreign key (id_veiculo) references veiculo(id)
);

-- USUARIOS
INSERT INTO usuario (nome, login, senha) VALUES
('João Silva', 'joao.silva', '$2b$10$H0ke24ahqS.xHmArWyrxVefu064felGc0htUXEaMXlDLmKG.Afsje'),
('Maria Oliveira', 'maria.oliveira', '$2b$10$IwI0zGk8t4dvDiwKv.zcLeOsR6xcCXm/85y.sTzfPWx1W9nEu2Dw6'),
('Pedro Santos', 'pedro.santos', '$2b$10$OAqS5RIDXheOlchObrKso.t4sD2SlOYM9LUjsUJzA5.rLSpdPGTEe'),
('Usuario Teste', 'teste@gmail.com', '$2b$10$KSyKNZmubGmXN2vdXStgnObw2u/n5jnyI5sANgUUApHlD.GPKniKW')
ON CONFLICT (login) DO NOTHING;


-- CLIENTES
INSERT INTO cliente (nome, cpf, telefone) VALUES
('Carlos Souza', '12345678901', '48999991111'),
('Ana Pereira', '98765432100', '48988882222'),
('Lucas Ferreira', '45678912300', '48977773333');


-- AGENDAMENTOS
INSERT INTO agendamento (data_agendamento, servico, id_veiculo) VALUES
('2026-10-20', 'Troca de óleo', 1),
('2026-10-21', 'Alinhamento e balanceamento', 2),
('2026-10-22', 'Revisão geral', 3);

