package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"connectrpc.com/connect"
	"github.com/gnolang/gnokey-mobile/service"
	api_gen "github.com/gnolang/gnonative/api/gen/go"
	"github.com/gnolang/gnonative/api/gen/go/_goconnect"
	gnonative_service "github.com/gnolang/gnonative/service"
	"github.com/peterbourgon/ff/v3/ffcli"
)

// path of the remote Gno node
var remote string

func main() {
	err := runMain(os.Args[1:])

	switch {
	case err == nil:
		// noop
	case err == flag.ErrHelp || strings.Contains(err.Error(), flag.ErrHelp.Error()):
		os.Exit(2)
	default:
		fmt.Fprintf(os.Stderr, "error: %+v\n", err)
		os.Exit(1)
	}
}

func runMain(args []string) error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// setup flags
	var fs *flag.FlagSet
	{
		fs = flag.NewFlagSet("goserver", flag.ContinueOnError)
	}

	fs.StringVar(&remote, "remote", "https://api.gno.berty.io:443", "address of the Gno node")

	var root *ffcli.Command
	{
		root = &ffcli.Command{
			ShortUsage:  "goserver [flag] <subcommand>",
			ShortHelp:   "start a Go server of Gnokey Mobile",
			FlagSet:     fs,
			Subcommands: []*ffcli.Command{tcp()},
			Exec: func(ctx context.Context, args []string) error {
				return flag.ErrHelp
			},
		}
	}

	if err := root.ParseAndRun(ctx, args); err != nil {
		log.Fatal(err)
	}

	return nil
}

func tcp() *ffcli.Command {
	fs := flag.NewFlagSet("goserver tcp", flag.ExitOnError)
	addr := fs.String("addr", "", "TCP address to listen to")

	return &ffcli.Command{
		Name:       "tcp",
		ShortUsage: "goserver tcp [flags]",
		ShortHelp:  "Listen on TCP",
		FlagSet:    fs,
		Exec: func(ctx context.Context, args []string) error {
			gnoNativeOptions := []gnonative_service.GnoNativeOption{
				gnonative_service.WithRemote(remote),
				gnonative_service.WithUseTcpListener(),
				gnonative_service.WithTcpAddr("localhost:0"),
			}
			gnoNativeService, err := gnonative_service.NewGnoNativeService(gnoNativeOptions...)
			if err != nil {
				log.Fatalf("failed to create GnoNativeService: %v", err)
				os.Exit(1)
			}
			defer gnoNativeService.Close()
			// For debug
			if err := setup(gnoNativeService); err != nil {
				log.Fatalf("failed to set up: %v", err)
				os.Exit(1)
			}

			options := []service.GnokeyMobileOption{}

			if *addr != "" {
				options = append(options, service.WithTcpAddr(*addr))
			}

			service, err := service.NewGnokeyMobileService(gnoNativeService, options...)
			if err != nil {
				log.Fatalf("failed to run GnokeyMobileService: %v", err)
				os.Exit(1)
			}
			defer service.Close()

			log.Printf("Gnokey Mobile server TCP address: %s\n", service.GetTcpAddr())

			<-context.Background().Done()
			return nil
		},
	}
}

func setup(gnoNativeService gnonative_service.GnoNativeService) error {
	// Create a Gno Native Kit gRPC client.
	client := _goconnect.NewGnoNativeServiceClient(
		http.DefaultClient,
		fmt.Sprintf("http://localhost:%d", gnoNativeService.GetTcpPort()),
	)

	// gnoland already has coins for test_1. Recover the test_1 key in our temporary on-disk keybase.
	_, err := client.CreateAccount(
		context.Background(),
		connect.NewRequest(&api_gen.CreateAccountRequest{
			NameOrBech32: "test_1",
			Mnemonic:     "source bonus chronic canvas draft south burst lottery vacant surface solve popular case indicate oppose farm nothing bullet exhibit title speed wink action roast",
			Password:     "password",
		}),
	)
	if err != nil {
		return err
	}
	_, err = client.SelectAccount(
		context.Background(),
		connect.NewRequest(&api_gen.SelectAccountRequest{
			NameOrBech32: "test_1",
		}),
	)
	if err != nil {
		return err
	}
	_, err = client.SetPassword(
		context.Background(),
		connect.NewRequest(&api_gen.SetPasswordRequest{
			Password: "password",
		}),
	)
	if err != nil {
		return err
	}

	return nil
}
