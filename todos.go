package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"
)

type Todo struct {
	TodoId      int64
	Description string
	Due         time.Time
	UserId      int64
}

type TodoList struct {
	Todos *[]Todo `json:"todos"`
}

func (t *Todo) Write(w http.ResponseWriter) error {
	enc := json.NewEncoder(w)
	return enc.Encode(t)
}

func (t *Todo) Read(json_str string) error {
	dec := json.NewDecoder(strings.NewReader(json_str))
	return dec.Decode(t)
}

func (tl *TodoList) Write(w http.ResponseWriter) error {
	enc := json.NewEncoder(w)
	return enc.Encode(tl)
}

func GetTodo(todoid int64, userid int64) (*Todo, error) {
	var t Todo

	err := DB.SelectOne(&t, "SELECT * from todos where UserId=? AND TodoId=?", userid, todoid)
	if err != nil {
		return nil, err
	}
	return &t, nil
}

func GetTodos(userid int64) (*[]Todo, error) {
	var todos []Todo

	_, err := DB.Select(&todos, "SELECT * from todos where UserId=?", userid)
	if err != nil {
		return nil, err
	}
	return &todos, nil
}

func TodoHandler(w http.ResponseWriter, r *http.Request) {
	user, err := GetUserFromSession(r)
	if err != nil {
		WriteError(w, 1 /*Not Signed In*/)
		return
	}

	if r.Method == "POST" {
		todo_json := r.PostFormValue("todo")
		if todo_json == "" {
			WriteError(w, 3 /*Invalid Request*/)
			return
		}

		var todo Todo
		err := todo.Read(todo_json)
		if err != nil {
			WriteError(w, 3 /*Invalid Request*/)
			return
		}
		todo.TodoId = -1

		err = DB.Insert(todo)
		if err != nil {
			WriteError(w, 999 /*Internal Error*/)
			log.Print(err)
		}

		WriteSuccess(w)
	} else if r.Method == "GET" {
		todoid, err := GetURLID(r.URL.Path)
		if err != nil {
			//Return all TODOs
			var tl TodoList
			todos, err := GetTodos(user.UserId)
			if err != nil {
				WriteError(w, 999 /*Internal Error*/)
				log.Print(err)
				return
			}
			tl.Todos = todos
			err = (&tl).Write(w)
			if err != nil {
				WriteError(w, 999 /*Internal Error*/)
				log.Print(err)
				return
			}
		} else {
			//Return Todo with this Id
			todo, err := GetTodo(todoid, user.UserId)
			if err != nil {
				WriteError(w, 3 /*Invalid Request*/)
				return
			}
			err = todo.Write(w)
			if err != nil {
				WriteError(w, 999 /*Internal Error*/)
				log.Print(err)
				return
			}
		}
	} else {
		todoid, err := GetURLID(r.URL.Path)
		if err != nil {
			WriteError(w, 3 /*Invalid Request*/)
			return
		}
		if r.Method == "PUT" {
			todo_json := r.PostFormValue("todo")
			if todo_json == "" {
				WriteError(w, 3 /*Invalid Request*/)
				return
			}

			var todo Todo
			err := todo.Read(todo_json)
			if err != nil || todo.TodoId != todoid {
				WriteError(w, 3 /*Invalid Request*/)
				return
			}

			count, err := DB.Update(&todo)
			if count != 1 || err != nil {
				WriteError(w, 999 /*Internal Error*/)
				log.Print(err)
				return
			}

			WriteSuccess(w)
		} else if r.Method == "DELETE" {
			var todo Todo
			todo.TodoId = todoid
			count, err := DB.Delete(&todo)
			if count != 1 || err != nil {
				WriteError(w, 999 /*Internal Error*/)
				log.Print(err)
				return
			}

			WriteSuccess(w)
		}
	}
}
