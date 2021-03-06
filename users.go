package main

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
)

type User struct {
	UserId       int64
	Name         string
	Username     string
	Password     string `db:"-"`
	PasswordHash string `json:"-"`
	Email        string
}
const BogusPassword = "password"

type UserExistsError struct{}

func (ueu UserExistsError) Error() string {
	return "User exists"
}

func (u *User) Write(w http.ResponseWriter) error {
	enc := json.NewEncoder(w)
	return enc.Encode(u)
}

func (u *User) Read(json_str string) error {
	dec := json.NewDecoder(strings.NewReader(json_str))
	return dec.Decode(u)
}

func (u *User) HashPassword() {
	password_hasher := sha256.New()
	io.WriteString(password_hasher, u.Password)
	u.PasswordHash = fmt.Sprintf("%x", password_hasher.Sum(nil))
	u.Password = ""
}

func GetUser(userid int64) (*User, error) {
	var u User

	err := DB.SelectOne(&u, "SELECT * from users where UserId=?", userid)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func GetUserByUsername(username string) (*User, error) {
	var u User

	err := DB.SelectOne(&u, "SELECT * from users where Username=?", username)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func InsertUser(u *User) error {
	transaction, err := DB.Begin()
	if err != nil {
		return err
	}

	existing, err := transaction.SelectInt("SELECT count(*) from users where Username=?", u.Username)
	if err != nil {
		transaction.Rollback()
		return err
	}
	if existing > 0 {
		transaction.Rollback()
		return UserExistsError{}
	}

	err = transaction.Insert(u)
	if err != nil {
		transaction.Rollback()
		return err
	}

	err = transaction.Commit()
	if err != nil {
		transaction.Rollback()
		return err
	}

	return nil
}

func GetUserFromSession(r *http.Request) (*User, error) {
	s, err := GetSession(r)
	if err != nil {
		return nil, err
	}
	return GetUser(s.UserId)
}

func UserHandler(w http.ResponseWriter, r *http.Request) {
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
		user.HashPassword()

		err = InsertUser(&user)
		if err != nil {
			if _, ok := err.(UserExistsError); ok {
				WriteError(w, 4 /*User Exists*/)
			} else {
				WriteError(w, 999 /*Internal Error*/)
				log.Print(err)
			}
			return
		}

		WriteSuccess(w)
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

			// Save old PWHash in case the new password is bogus
			old_pwhash := user.PasswordHash

			err = user.Read(user_json)
			if err != nil || user.UserId != userid {
				WriteError(w, 3 /*Invalid Request*/)
				return
			}

			// If the user didn't create a new password, keep their old one
			if user.Password != BogusPassword {
				user.HashPassword()
			} else {
				user.Password = ""
				user.PasswordHash = old_pwhash
			}

			count, err := DB.Update(user)
			if count != 1 || err != nil {
				WriteError(w, 999 /*Internal Error*/)
				log.Print(err)
				return
			}

			WriteSuccess(w)
		} else if r.Method == "DELETE" {
			count, err := DB.Delete(&user)
			if count != 1 || err != nil {
				WriteError(w, 999 /*Internal Error*/)
				log.Print(err)
				return
			}

			WriteSuccess(w)
		}
	}
}
