create database eye_clinic_database;
use eye_clinic_database;

create table admin (
    id int primary key auto_increment,
    adminId varchar(20) not null unique check (adminId regexp '^MBBS\.[0-9]{5}$'),
    adminFirstname varchar(255) not null,
    adminLastname varchar(255) not null,
    adminPassword varchar(255) not null,
    adminKey int not null check (adminKey between 100000 and 999999),
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table doctor (
    doctorId varchar(20) primary key CHECK (doctorId REGEXP '^MBBS.\.[0-9]+$' AND CHAR_LENGTH(SUBSTRING_INDEX(doctorId, '.', -1)) = 5),
    doctorFirstname varchar(255) not null,
    doctorLastname varchar(255) not null,
    doctorPassword varchar(255) not null,
    created TIMESTAMP not null DEFAULT now()
);

