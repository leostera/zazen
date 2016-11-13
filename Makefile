.PHONY: all
.PHONY: bench test lint build check package
.PHONY: server clean tags

LIB_NAME   = zazen.js

COVERAGE_DIR = ./coverage
DIST_DIR     = ./dist
BUILD_DIR    = ./lib
BIN_DIR      = ./node_modules/.bin
SCRIPT_DIR   = ./scripts
TEST_DIR     = ./tests
PERF_DIR     = ./tests/perf

PERF_TESTS = $(shell find $(PERF_DIR) -name "*.perf.js")

DIR = .

BRANCH   ?= $(shell git rev-parse --abbrev-ref HEAD)
VERSION   = $(shell git describe --tags HEAD)
REVISION  = $(shell git rev-parse HEAD)
STAMP     = $(REVISION).$(shell date +%s)

all: build lint check test bench

dirs:
	mkdir -p $(DIST_DIR) $(BUILD_DIR) $(COVERAGE_DIR)

setup: dirs
	$(SCRIPT_DIR)/symlink.sh

flow-stop:
	$(BIN_DIR)/flow stop

check:
	$(BIN_DIR)/flow
	$(SCRIPT_DIR)/check-coverage.sh

bench: $(PERF_TESTS) FORCE
$(PERF_DIR)/%.perf.js:
	$(NODE) $@

test:
	NODE_ENV=test $(BIN_DIR)/jest -c .jestrc

lint:
	$(BIN_DIR)/eslint ./src

build: dirs
	$(BIN_DIR)/browserify \
		src/index.js \
		--debug \
		-t babelify \
		| $(BIN_DIR)/exorcist $(BUILD_DIR)/$(LIB_NAME).map \
		> $(BUILD_DIR)/_$(LIB_NAME)
	mv $(BUILD_DIR)/_$(LIB_NAME) $(BUILD_DIR)/$(LIB_NAME)

package: clean build
	cp -r $(BUILD_DIR) $(DIST_DIR)
	$(BIN_DIR)/uglifyjs $(DIST_DIR)/$(BUILD_DIR)/$(LIB_NAME) > $(DIST_DIR)/$(BUILD_DIR)/$(STAMP).js
	rm $(DIST_DIR)/$(BUILD_DIR)/$(LIB_NAME)
	gzip -c -9 $(DIST_DIR)/$(BUILD_DIR)/$(STAMP).js  > $(DIST_DIR)/$(BUILD_DIR)/$(STAMP).js.gz

tags: .ctagsignore
	rm -f tags
	ctags src

.ctagsignore: node_modules
	ls -fd1 node_modules/* > $@

clean:
	rm -rf $(BUILD_DIR) $(DIST_DIR) tags coverage

cleanall: clean
	rm -rf node_modules yarn.lock

FORCE:
