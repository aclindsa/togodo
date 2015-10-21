package main

import (
	"fmt"
	"log"
	"net/smtp"
	"strconv"
	"strings"
	"time"
)

func sendEmail(to []string, subject string, headers string, msg string) error {
	body := fmt.Sprintf("Subject: %s\n%s\n\n%s", subject, headers, msg)
	auth := smtp.PlainAuth(
		"",
		smtpUsername,
		smtpPassword,
		smtpServer,
	)
	return smtp.SendMail(smtpServer+":"+strconv.Itoa(smtpPort), auth, reminderEmail, to, []byte(body))
}

func sendReminderEmail(t Todo) error {
	user, err := GetUser(t.UserId)
	if err != nil {
		return err
	}

	subject := fmt.Sprintf("ToGoDo Reminder: %s", t.Description)
	headers := "Content-Type: text/plain; charset=ISO-8859-1\n"
	headers += fmt.Sprintf("To: %s <%s>", user.Name, user.Email)

	body := fmt.Sprintf("Description: %s\n", t.Description)
	if t.HasDueDate {
		body += fmt.Sprintf("Due: %s\n", t.DueDate)
	}
	if len(t.Tags) > 0 {
		body += fmt.Sprintf("Tags: %s\n", strings.Join(strings.Split(t.Tags, "\n"), ", "))
	}
	if len(t.Notes) > 0 {
		body += fmt.Sprintf("Notes: %s\n", t.Notes)
	}

	hash := GetPostponeHash(&t, user)
	body += fmt.Sprintf("\nPostpone by...\n")
	body += fmt.Sprintf("An hour: %s/postpone/%d/?hash=%s&seconds=%d\n", httpAddress, t.TodoId, hash, 60*60)
	body += fmt.Sprintf("A day: %s/postpone/%d/?hash=%s&seconds=%d\n", httpAddress, t.TodoId, hash, 60*60*24)
	body += fmt.Sprintf("A week: %s/postpone/%d/?hash=%s&seconds=%d\n", httpAddress, t.TodoId, hash, 60*60*24*7)
	body += fmt.Sprintf("A month: %s/postpone/%d/?hash=%s&seconds=%d", httpAddress, t.TodoId, hash, 60*60*24*7*30)

	return sendEmail([]string{user.Email}, subject, headers, body)
}

func sendReminders(t time.Time) {
	var todos []Todo
	_, err := DB.Select(&todos, "SELECT * FROM todos WHERE HasReminder=? AND Completed=? AND Reminder<?", true, false, t)
	if err != nil {
		log.Print(err)
		return
	}
	for i := range todos {
		err = sendReminderEmail(todos[i])
		if err != nil {
			log.Print(err)
			continue
		}

		err = todos[i].MarkReminded()
		if err != nil {
			log.Print(err)
		}
	}
}

func reminderRoutine(C <-chan time.Time) {
	for {
		t := <-C
		sendReminders(t)
	}
}

func startReminderRoutine() {
	ticker := time.NewTicker(time.Minute)
	go reminderRoutine(ticker.C)

}
