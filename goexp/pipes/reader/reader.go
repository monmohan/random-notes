package main

import (
	"bytes"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"syscall"
)

func goNativeImpl() {
	namedPipe := filepath.Join("/home/singhmo/named-pipes", "ABCD")
	err := syscall.Mkfifo(namedPipe, 0600)
	if err != nil {
		fmt.Printf("Error creating fifo named pipe %v\n", err.Error())
	}
	np, _ := os.OpenFile(namedPipe, os.O_RDONLY, 0600)
	defer np.Close()
	var b bytes.Buffer
	for {
		n, err := io.CopyN(&b, np, 10)
		if err != nil {
			fmt.Printf("Error reading fifo named pipe %v\n", err.Error())
			return
		}
		fmt.Printf("read %d bytes from pipe \n", n)
		fmt.Printf("\n%s\n", b.String())
		b.Reset()
	}
}

func dockerImpl() {

}

func main() {
	goNativeImpl()
}
