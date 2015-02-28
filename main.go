package main

import (
	"flag"
	"github.com/gorilla/context"
	"log"
	"net"
	"net/http"
	"os"
	"path"
	"strconv"
)

var base_dir string
var port int
var smtpServer string
var smtpPort int
var smtpUsername string
var smtpPassword string
var reminderEmail string

func init() {
	flag.StringVar(&base_dir, "base", "./", "Base directory for server")
	flag.IntVar(&port, "port", 80, "Port to serve API/files on")
	flag.StringVar(&smtpServer, "smtp.server", "smtp.example.com", "SMTP server to send reminder emails from.")
	flag.IntVar(&smtpPort, "smtp.port", 587, "SMTP server port to connect to")
	flag.StringVar(&smtpUsername, "smtp.username", "togodo", "SMTP username")
	flag.StringVar(&smtpPassword, "smtp.password", "password", "SMTP password")
	flag.StringVar(&reminderEmail, "email", "tododo@example.com", "Email address to send reminder emails as.")
	flag.Parse()

	static_path := path.Join(base_dir, "static")

	// Ensure base directory is valid
	dir_err_str := "The base directory doesn't look like it contains the " +
		"'static' directory. Check to make sure you're passing the right " +
		"value to the -base argument."
	static_dir, err := os.Stat(static_path)
	if err != nil {
		log.Print(err)
		log.Fatal(dir_err_str)
	}
	if !static_dir.IsDir() {
		log.Fatal(dir_err_str)
	}
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, path.Join(base_dir, "static/index.html"))
}

func staticHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, path.Join(base_dir, r.URL.Path))
}

func main() {
	log.Printf("Serving on port %d out of directory: %s", port, base_dir)

	startReminderRoutine()

	servemux := http.NewServeMux()
	servemux.HandleFunc("/", rootHandler)
	servemux.HandleFunc("/static/", staticHandler)
	servemux.HandleFunc("/session/", SessionHandler)
	servemux.HandleFunc("/user/", UserHandler)
	servemux.HandleFunc("/todo/", TodoHandler)

	listener, _ := net.Listen("tcp", ":"+strconv.Itoa(port))
	http.Serve(listener, context.ClearHandler(servemux))
}
