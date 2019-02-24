package main

import (
	"os"
	"path/filepath"
)

func main() {
	namedPipe := filepath.Join("/home/singhmo/named-pipes", "ABCD")
	np, _ := os.OpenFile(namedPipe, os.O_WRONLY, 0600)
	np.Write([]byte("Hello"))
	np.Close()
}
