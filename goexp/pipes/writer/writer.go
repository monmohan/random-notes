package main

import (
	"fmt"
	"os"
	"path/filepath"
	"time"
)

func main() {
	namedPipe := filepath.Join("/home/singhmo/named-pipes", "ABCD")
	np, _ := os.OpenFile(namedPipe, os.O_WRONLY, 0600)
	defer np.Close()
	i := 1
	for {
		fmt.Printf("Wrote %d times\n", i)
		np.Write([]byte("Hello"))
		time.Sleep(10 * time.Second)
		i++
	}

}
