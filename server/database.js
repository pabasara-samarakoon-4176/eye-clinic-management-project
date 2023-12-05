import mysql from 'mysql2'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Dhoomiii@2000',
    database: 'notes_app'
}).promise()


export async function getNotes() {
    const [result] = await pool.query("select * from notes")
    return result
}

export async function getNote(id) {
    const [result] = await pool.query(`
    select * from notes where id = ${id}
    `)
    return result
}

export async function createNote(title, contents) {
    await pool.query(`
    insert into notes (title, contents) 
    values (?, ?)
    `, [title, contents])
}

export async function updateNote(id, title, contents) {
    await pool.query(`
    update notes set title = ?, contents = ?
    where id = ${id}
    `, [title, contents])
}

export async function deleteNote(id) {
    await pool.query(`
    delete from notes where id = ${id}
    `)
}

