create database portaria;
use portaria;

create table moradores(
    id int primary key auto_increment,
    nome varchar(100) not null,
    bloco varchar(10) not null,
    apartamento varchar(10) not null,
    telefone varchar(20) not null,
    email varchar(100) not null,
    status enum('residente', 'proprietario', 'visitante') not null,
    criado_em timestamp default current_timestamp
);

create table veiculos(
    id int primary key auto_increment,
    placa varchar(10) not null,
    modelo varchar(50) not null,
    cor varchar(30) not null,
    box varchar(10) not null,
    morador_id int not null,
    criado_em timestamp default current_timestamp,
    foreign key (morador_id) references moradores(id) on delete cascade
);

create index idx_morador_status on moradores(status);
create index idx_veiculo_placa on veiculos(placa);
create index idx_veiculo_morador on veiculos(morador_id);
