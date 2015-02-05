package main

import (
	"fmt"
	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
	"html/template"
	"log"
	"net/http"
)

var cookie_store = sessions.NewCookieStore(securecookie.GenerateRandomKey(64))

type Session struct {
	SessionId     int64
	SessionSecret string
	UserId        int64
}

func GetSession(r *http.Request) (*Session, error) {
	var s Session

	session, _ := cookie_store.Get(r, "togodo")
	_, ok := session.Values["session-secret"]
	if !ok {
		return nil, fmt.Errorf("session-secret cookie not set")
	}
	s.SessionSecret = session.Values["session-secret"].(string)

	err := DB.SelectOne(&s, "SELECT * from sessions where SessionSecret=?", s.SessionSecret)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	user.Username = r.PostFormValue("username")
	user.Password = r.PostFormValue("password")

	if user.Username == "" || user.Password == "" {
		LoginForm(w, nil)
	} else {
		//		u := GetUser(r)
		//		if u {
		//		} else {
		//			log.Printf("unable to find user")
		//		}
	}
}

func LoginForm(w http.ResponseWriter, msg *string) {

	t, err := template.New("login").Parse(`<html>
<body>
{{if .}} <p style="color:red">{{.}}</p>{{end}}
<form action="#" method="POST">
Username: <input type="text" name="username"><br />
Password: <input type="password" name="password"><br />
<input type="submit" value="Login">
</form>
</body>
</html>`)
	if err != nil {
		http.Error(w, "Unable to parse login template", 500)
		log.Print(err)
		return
	}
	t.Execute(w, msg)
}
