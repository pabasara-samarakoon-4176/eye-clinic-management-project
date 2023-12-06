create database eye_clinic;
use eye_clinic;

create table doctor (
	id integer primary key auto_increment,
    doctorId varchar(20) not null,
    doctorFirstname varchar(20) not null,
    doctorLastname varchar(20) not null,
    doctorPassword varchar(20) not null,
    created timestamp not null default now()
);

