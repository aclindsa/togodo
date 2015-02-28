package main

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
	"gopkg.in/gorp.v1"
	"log"
)

var DB *gorp.DbMap = initDB()

func initDB() *gorp.DbMap {
	db, err := sql.Open("sqlite3", "file:togodo.sqlite?cache=shared&mode=rwc")
	if err != nil {
		log.Fatal(err)
	}

	dbmap := &gorp.DbMap{Db: db, Dialect: gorp.SqliteDialect{}}
	dbmap.AddTableWithName(User{}, "users").SetKeys(true, "UserId")
	dbmap.AddTableWithName(Session{}, "sessions").SetKeys(true, "SessionId")
	dbmap.AddTableWithName(Todo{}, "todos").SetKeys(true, "TodoId")

	err = dbmap.CreateTablesIfNotExists()
	if err != nil {
		log.Fatal(err)
	}

	return dbmap
}
