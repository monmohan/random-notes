package main

import (
	"bytes"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"syscall"
)

func main() {
	namedPipe := filepath.Join("/home/singhmo/named-pipes", "ABCD")
	err := syscall.Mkfifo(namedPipe, 0600)
	if err != nil {
		fmt.Printf("Error creating fifo named pipe %v\n", err.Error())
	}
	np, _ := os.OpenFile(namedPipe, os.O_RDONLY, 0600)
	var b bytes.Buffer
	n, err := io.Copy(&b, np)
	if err != nil {
		fmt.Printf("Error reading fifo named pipe %v\n", err.Error())
	}
	fmt.Printf("read %d bytes from pipe \n", n)
	np.Close()
	fmt.Printf("Data %s", b.String())
}
