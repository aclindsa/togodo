package main

import (
	"strconv"
	"strings"
)

func GetURLID(url string) (int64, error) {
	pieces := strings.Split(strings.Trim(url, "/"), "/")
	return strconv.ParseInt(pieces[len(pieces)], 10, 0)
}
