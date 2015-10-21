package main

import (
	"net/http"
	"strconv"
	"crypto/sha256"
	"fmt"
	"io"
	"log"
	"time"
)

func GetPostponeHash(t *Todo, u *User) string {
	u.HashPassword()
	postpone_hasher := sha256.New()
	io.WriteString(postpone_hasher, strconv.FormatInt(t.TodoId, 10))
	io.WriteString(postpone_hasher, t.Description)
	io.WriteString(postpone_hasher, strconv.FormatBool(t.HasDueDate))
	io.WriteString(postpone_hasher, t.DueDate.String())
	io.WriteString(postpone_hasher, t.Reminder.String())
	io.WriteString(postpone_hasher, t.Tags)
	io.WriteString(postpone_hasher, t.Notes)
	io.WriteString(postpone_hasher, strconv.FormatBool(t.Completed))
	io.WriteString(postpone_hasher, strconv.FormatInt(u.UserId, 10))
	io.WriteString(postpone_hasher, u.Username)
	io.WriteString(postpone_hasher, u.PasswordHash)
	return fmt.Sprintf("%x", postpone_hasher.Sum(nil))
}

func PostponeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		WriteErrorPlain(w, 3 /*Invalid Request*/)
		return
	}

	queryValues := r.URL.Query()
	hash := queryValues.Get("hash")
	secondsStr := queryValues.Get("seconds")

	if hash == "" {
		WriteErrorPlain(w, 3 /*Invalid Request*/)
		return
	}

	seconds, err := strconv.ParseInt(secondsStr, 10, 0)
	if err != nil {
		WriteErrorPlain(w, 3 /*Invalid Request*/)
		return
	}

	todoid, err := GetURLID(r.URL.Path)
	if err != nil {
		WriteErrorPlain(w, 3 /*Invalid Request*/)
		return
	}

	todo, err := GetTodoNoUserId(todoid)
	if err != nil {
		WriteErrorPlain(w, 3 /*Invalid Request*/)
		return
	}

	if todo.HasReminder {
		WriteErrorPlain(w, 3 /*Invalid Request*/)
		return
	}

	user, err := GetUser(todo.UserId)
	if err != nil {
		WriteErrorPlain(w, 3 /*Invalid Request*/)
		return
	}

	calculatedHash := GetPostponeHash(todo, user)
	if (calculatedHash != hash) {
		user, err = GetUserFromSession(r)
		if err != nil || user.UserId != todo.UserId {
			WriteErrorPlain(w, 1 /*Not Signed In*/)
			return
		}
	}

	todo.HasReminder = true
	postponeBy := time.Second * time.Duration(seconds)
	todo.Reminder = todo.Reminder.Add(postponeBy)
	todo.DueDate = todo.DueDate.Add(postponeBy)

	count, err := DB.Update(todo)
	if count != 1 || err != nil {
		WriteErrorPlain(w, 999 /*Internal Error*/)
		log.Print(err)
		return
	}

	fmt.Fprintf(w, "Successfully postponed \"%s\" for %s", todo.Description, postponeBy.String())
}
