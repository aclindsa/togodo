package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
)

type User struct {
	UserId   int64
	Name	 string
	Username string
	Password string
	Email    string
}

func (u *User) Write(w http.ResponseWriter) error {
	enc := json.NewEncoder(w)
	return enc.Encode(u)
}

func (u *User) Read(json_str string) error {
	dec := json.NewDecoder(strings.NewReader(json_str))
	return dec.Decode(u)
}

func GetUser(userid int64) (*User, error) {
	var u User

	err := DB.SelectOne(&u, "SELECT * from users where UserId=?", userid)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func GetUserFromSession(r *http.Request) (*User, error) {
	s, err := GetSession(r)
	if err != nil {
		return nil, err
	}
	return GetUser(s.UserId)
}

func UserHandler(w http.ResponseWriter, r *http.Request) {
	log.Print(r.Method)
	if r.Method == "POST" {
		user_json := r.PostFormValue("user")
		if user_json == "" {
			WriteError(w, 3 /*Invalid Request*/)
			return
		}

		var user User
		err := user.Read(user_json)
		if err != nil {
			WriteError(w, 3 /*Invalid Request*/)
			return
		}
		user.UserId = -1

		err = DB.Insert(&user)
		if err != nil {
			WriteError(w, 999 /*Internal Error*/)
			log.Print(err)
			return
		}
	} else {
		user, err := GetUserFromSession(r)
		if err != nil {
			WriteError(w, 1 /*Not Signed In*/)
			return
		}

		userid, err := GetURLID(r.URL.Path)
		if err != nil {
			WriteError(w, 3 /*Invalid Request*/)
			return
		}

		if userid != user.UserId {
			WriteError(w, 2 /*Unauthorized Access*/)
			return
		}

		if r.Method == "GET" {
			err = user.Write(w)
			if err != nil {
				WriteError(w, 999 /*Internal Error*/)
				log.Print(err)
				return
			}
		} else if r.Method == "PUT" {
			user_json := r.PostFormValue("user")
			if user_json == "" {
				WriteError(w, 3 /*Invalid Request*/)
				return
			}

			err = user.Read(user_json)
			if err != nil || user.UserId != userid {
				WriteError(w, 3 /*Invalid Request*/)
				return
			}

			count, err := DB.Update(&user)
			if count != 1 || err != nil {
				WriteError(w, 999 /*Internal Error*/)
				log.Print(err)
				return
			}
		} else if r.Method == "DELETE" {
			count, err := DB.Delete(&user)
			if count != 1 || err != nil {
				WriteError(w, 999 /*Internal Error*/)
				log.Print(err)
				return
			}
		}
	}
}
