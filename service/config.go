package service

import (
	"go.uber.org/zap"
)

const DEFAULT_TCP_ADDR = ":26659"

// Config describes a set of settings for a GnokeyMobileService
type Config struct {
	Logger  *zap.Logger
	TcpAddr string
}

type GnokeyMobileOption func(cfg *Config) error

func (cfg *Config) applyOptions(opts ...GnokeyMobileOption) error {
	withDefaultOpts := make([]GnokeyMobileOption, len(opts))
	copy(withDefaultOpts, opts)
	withDefaultOpts = append(withDefaultOpts, WithFallbackDefaults)
	for _, opt := range withDefaultOpts {
		if err := opt(cfg); err != nil {
			return err
		}
	}
	return nil
}

// FallBackOption is a structure that permits to fallback to a default option if the option is not set.
type FallBackOption struct {
	fallback func(cfg *Config) bool
	opt      GnokeyMobileOption
}

// --- Logger options ---

// WithLogger set the given logger.
var WithLogger = func(l *zap.Logger) GnokeyMobileOption {
	return func(cfg *Config) error {
		cfg.Logger = l
		return nil
	}
}

// WithDefaultLogger init a noop logger.
var WithDefaultLogger GnokeyMobileOption = func(cfg *Config) error {
	logger, err := zap.NewDevelopment()
	if err != nil {
		return err
	}

	cfg.Logger = logger

	return nil
}

var fallbackLogger = FallBackOption{
	fallback: func(cfg *Config) bool { return cfg.Logger == nil },
	opt:      WithDefaultLogger,
}

// WithFallbackLogger sets the logger if no logger is set.
var WithFallbackLogger GnokeyMobileOption = func(cfg *Config) error {
	if fallbackLogger.fallback(cfg) {
		return fallbackLogger.opt(cfg)
	}
	return nil
}

// --- tcpAddr options ---

// WithTcpAddr sets the given TCP address to serve the gRPC server.
// If no TCP address is defined, a default will be used.
// If the TCP port is set to 0, a random port number will be chosen.
var WithTcpAddr = func(addr string) GnokeyMobileOption {
	return func(cfg *Config) error {
		cfg.TcpAddr = addr
		return nil
	}
}

// WithDefaultTcpAddr sets a default TCP addr to listen to.
var WithDefaultTcpAddr GnokeyMobileOption = func(cfg *Config) error {
	cfg.TcpAddr = DEFAULT_TCP_ADDR

	return nil
}

var fallbackTcpAddr = FallBackOption{
	fallback: func(cfg *Config) bool { return cfg.TcpAddr == "" },
	opt:      WithDefaultTcpAddr,
}

// WithDefaultTcpAddr sets a default TCP addr to listen to if no address is set.
var WithFallbackTcpAddr GnokeyMobileOption = func(cfg *Config) error {
	if fallbackTcpAddr.fallback(cfg) {
		return fallbackTcpAddr.opt(cfg)
	}
	return nil
}

// --- Fallback options ---

var defaults = []FallBackOption{
	fallbackLogger,
	fallbackTcpAddr,
}

// WithFallbackDefaults sets the default options if no option is set.
var WithFallbackDefaults GnokeyMobileOption = func(cfg *Config) error {
	for _, def := range defaults {
		if !def.fallback(cfg) {
			continue
		}
		if err := def.opt(cfg); err != nil {
			return err
		}
	}
	return nil
}
