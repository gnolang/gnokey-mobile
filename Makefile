check-program = $(foreach exec,$(1),$(if $(shell PATH="$(PATH)" which $(exec)),,$(error "Missing deps: no '$(exec)' in PATH")))

# Generate API from protofiles
generate: api.generate

# Clean and generate
regenerate: api.clean api.generate

.PHONY: generate regenerate

# - API : Handle API generation and cleaning

api.generate: _api.generate.protocol _api.generate.modules
api.clean: _api.clean.protocol _api.clean.modules

# - API - rpc

protos_src := $(wildcard service/rpc/*.proto)
gen_src := $(protos_src) Makefile buf.gen.yaml $(wildcard service/gnokeymobiletypes/*.go)
gen_sum := gen.sum

_api.generate.protocol: $(gen_sum)
_api.clean.protocol:
	rm -f api/gen/go/*.pb.go
	rm -f api/gen/go/_goconnect/*.connect.go
	rm -f api/gen/es/*.{ts,js}
	rm -f $(gen_sum)

$(gen_sum): $(gen_src)
	$(call check-program, shasum buf)
	@shasum $(gen_src) | sort -k 2 > $(gen_sum).tmp
	@diff -q $(gen_sum).tmp $(gen_sum) || ( \
		buf generate api; \
		shasum $(gen_src) | sort -k 2 > $(gen_sum).tmp; \
		mv $(gen_sum).tmp $(gen_sum); \
		go mod tidy \
	)

_api.generate.modules:
	$(call check-program, yarn)
	cd api; yarn

_api.clean.modules:
	cd api; rm -fr node_modules

.PHONY: api.generate _api.generate.protocol _api.generate.modules _api.clean.protocol _api.clean.modules

# - asdf

asdf.add_plugins:
	$(call check-program, asdf)
	@echo "Installing asdf plugins..."
	@set -e; \
	for PLUGIN in $$(cut -d' ' -f1 .tool-versions | grep "^[^\#]"); do \
		asdf plugin add $$PLUGIN || [ $$?==2 ] || exit 1; \
	done

asdf.install_tools: asdf.add_plugins
	$(call check-program, asdf)
	@echo "Installing asdf tools..."
	@asdf install
