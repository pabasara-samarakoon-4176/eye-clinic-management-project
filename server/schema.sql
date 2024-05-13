create database eye_clinic_database;
use eye_clinic_database;

-- drop database eye_clinic_database;

create table admin (
    id int primary key auto_increment,
    adminId varchar(20) not null unique check (adminId regexp '^MBBS\.[0-9]{5}$'),
    adminFirstname varchar(255) not null,
    adminLastname varchar(255) not null,
    adminPassword varchar(255) not null,
    adminKey int not null check (adminKey between 000000 and 999999),
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

insert into admin (adminId, adminFirstname, adminLastname, adminPassword, adminKey) values (
    'MBBS.00000',
    'John', 
    'Doe',
    'JohnDoe',
    '001129'
);

create table doctor (
    doctorId varchar(20) primary key CHECK (doctorId REGEXP '^MBBS.\.[0-9]+$' AND CHAR_LENGTH(SUBSTRING_INDEX(doctorId, '.', -1)) = 5),
    doctorFirstname varchar(255) not null,
    doctorLastname varchar(255) not null,
    doctorPassword varchar(255) not null,
    created TIMESTAMP not null DEFAULT CURRENT_TIMESTAMP
);

alter table doctor add column adminId varchar(20) not null;
alter table doctor add foreign key doctor (adminId) references admin(adminId);

create table nurse (
    nurseId varchar(20) primary key not null unique CHECK (nurseId regexp '^NR\.[0-9]{5}$'),
    nurseFirstname varchar(225) not null,
    nurseLastname varchar(255) not null,
    nursePassword varchar(255) not null,
    created TIMESTAMP not null DEFAULT CURRENT_TIMESTAMP
);

alter table nurse add column adminId varchar(20) not null;
alter table nurse add foreign key nurse (adminId) references admin(adminId);

insert into nurse (nurseId, nurseFirstname, nurseLastname, nursePassword, adminId) values 
('NR.00000', 'nurse1Fname', 'nurse1Lname', 'nurse1', 'MBBS.00000');

alter table nurse add column stockMgr boolean not null default false;

insert into nurse (nurseId, nurseFirstname, nurseLastname, nursePassword, adminId, stockMgr) values 
('NR.00001', 'nurse1Fname', 'nurse1Lname', 'nurse1', 'MBBS.00000', true);

create table patient (
    patientId varchar(20) primary key not null unique check (
		patientId regexp '^[0-9]{9}[v]$' or
        patientId regexp '^[0-9]{12}$'
    ),
    patientFirstname varchar(255) not null,
    patientLastname varchar(255) not null,
    dateOfBirth date not null,
    gender enum('male', 'female', 'other'),
    address varchar(255) not null,
    phoneNumber varchar(255) not null,
    patientDescription varchar(255) not null,
    doctorInChargeId varchar(255) not null,
    patient_image blob not null,
    created TIMESTAMP not null DEFAULT CURRENT_TIMESTAMP,

    foreign key (doctorInChargeId) references doctor(doctorId)
);

alter table patient add column admittedNurse varchar(20) not null;
alter table patient add foreign key patient (admittedNurse) references nurse(nurseId);

create table patientComplaint(
	patientComplaintId varchar(20) primary key not null unique check (
		patientComplaintId regexp '^PC-([0-9]{9}[v]|[0-9]{12})$'
    ),
    -- right eye bool
    rightPainBool boolean DEFAULT false,
    rightDoubleVisionBool boolean DEFAULT false,
    rightRedeyeBool boolean DEFAULT false,
    rightPoorVisionBool boolean DEFAULT false,
    -- right eye
    rightPain varchar(25),
    rightDoubleVision varchar(25),
    rightRedeye varchar(25),
    rightPoorVision varchar(25),
    rightDescription varchar(25),
    rightEyeImage blob not null,
    -- left eye bool
    leftPainBool boolean DEFAULT false,
    leftDoubleVisionBool boolean DEFAULT false,
    leftRedeyeBool boolean DEFAULT false,
    leftPoorVisionBool boolean DEFAULT false,
    -- left eye
    leftPain varchar(25),
    leftDoubleVision varchar(25),
    leftRedeye varchar(25),
    leftPoorVision varchar(25),
    leftDescription varchar(25),
    leftEyeImage blob not null,
    
    allergies varchar(30),
    medicalHistory varchar(50),
    
    patientId varchar(20) not null check (
		patientId regexp '^[0-9]{9}[v]$' or
        patientId regexp '^[0-9]{12}$'
    ),
    
    foreign key (patientId) references patient(patientId)
);

create table examination (
	examId varchar(25) primary key not null unique check (
		examId regexp '^EXM-[0-9]{5}-([0-9]{9}[v]|[0-9]{12})$'
    ),
    examDate date not null,
    examTime time not null,
    -- right eye
    rightLids varchar(30),
    rightConjuitive varchar(30),
    rightAC varchar(30),
    rightIris varchar(30),
    rightVitereous varchar(30),
    rightCornea varchar(30),
    rightRetina varchar(30),
    -- left eye
    leftLids varchar(30),
    leftConjuitive varchar(30),
    leftAC varchar(30),
    leftIris varchar(30),
    leftVitereous varchar(30),
    leftCornea varchar(30),
    leftRetina varchar(30),
    
    -- foreign keys
    patientId varchar(20) not null check (
		patientId regexp '^[0-9]{9}[v]$' or
        patientId regexp '^[0-9]{12}$'
    ),
    doctorId VARCHAR(20) CHECK (doctorId REGEXP '^MBBS.\.[0-9]+$' AND CHAR_LENGTH(SUBSTRING_INDEX(doctorId, '.', -1)) = 5),
    
    foreign key (doctorId) references doctor(doctorId),
    foreign key (patientId) references patient(patientId),
    
    created timestamp not null default current_timestamp
    
);

create table manufacturer (
    manuId varchar(2) primary key not null unique,
    manuName varchar(20) not null
);

create table lens (
	lensId varchar(20) primary key not null unique check (lensId regexp '^[A-Z]{2}-[0-9]{4}-[0-9]{4}$'),
    lensType varchar(20) not null,
    surgeryType varchar(20) not null,
    manufacturerId varchar(2) not null,
    model varchar(30) not null,
    lensPower double not null,
    manufactureDate date not null,
    expiryDate date not null,
    batchNo varchar(20) not null,
    remarks varchar(50),
    adminId varchar(20) not null,
    stockMgrNurse varchar(20) not null,
    reserved boolean default false,

    foreign key (adminId) references admin(adminId),
    foreign key (manufacturerId) references manufacturer(manuId),
    foreign key (stockMgrNurse) references nurse(nurseId),
    
    created timestamp not null default current_timestamp
    
);

create table surgery (
	surgeryId varchar(25) primary key not null unique check (surgeryId regexp '^SG-[0-9]{5}-([0-9]{9}[v]|[0-9]{12})$'),
    surgeryDate date not null,
    surgeryTime time not null,
    pending boolean not null default false,
    created timestamp not null default current_timestamp,
    description varchar(225),
    docReport mediumblob,
    patientId varchar(20) not null,
    doctorId varchar(20) not null,
    examId varchar(30) not null,
    compId varchar(20) not null,
    lensId varchar(20) not null,
    nurseId varchar(20) not null,

    foreign key (patientId) references patient(patientId),
    foreign key (doctorId) references doctor(doctorId),
    foreign key (examId) references examination(examId),
    foreign key (compId) references patientComplaint(patientComplaintId),
    foreign key (lensId) references lens(lensId),
    foreign key (nurseId) references nurse(nurseId)

);

create table clinic (
	clinicId varchar(21) not null unique check (clinicId regexp '^CL-[0-9]{5}-([0-9]{9}[v]|[0-9]{12})$'),
    clinicDate date not null,
    clinicTime time not null,
    consultantId VARCHAR(20) CHECK (consultantId REGEXP '^MBBS.\.[0-9]+$' AND CHAR_LENGTH(SUBSTRING_INDEX(consultantId, '.', -1)) = 5),
    patientId varchar(20) not null check (
		patientId regexp '^[0-9]{9}[v]$' or
        patientId regexp '^[0-9]{12}$'
    ),
    created timestamp not null default current_timestamp,
    
    foreign key (consultantId) references doctor(doctorId),
    foreign key (patientId) references patient(patientId)
    
);

