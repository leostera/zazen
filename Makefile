.PHONY: all
.PHONY: bench test lint build check package
.PHONY: clean tags

LIB_NAME   = zazen.js

BIN_DIR      = ./node_modules/.bin
BUILD_DIR    = lib
CACHE_DIR    = .cache
COVERAGE_DIR = coverage
DIST_DIR     = dist
PERF_DIR     = tests/perf
SCRIPT_DIR   = scripts
TEST_DIR     = tests

PERF_TESTS = $(shell find $(PERF_DIR) -name "*.perf.js")

DIR = .

BRANCH   ?= $(shell git rev-parse --abbrev-ref HEAD)
VERSION   = $(shell git describe --tags HEAD)
REVISION  = $(shell git rev-parse HEAD)
STAMP     = $(REVISION).$(shell date +%s)

all: setup build lint check test bench

dirs:
	mkdir -p $(DIST_DIR) $(BUILD_DIR) $(COVERAGE_DIR) $(CACHE_DIR)

setup: dirs .npmignore
	$(SCRIPT_DIR)/symlink.sh
	$(SCRIPT_DIR)/flow-typed.sh

.npmignore: .gitignore FORCE
	cat .gitignore | grep -v lib > $@

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
	touch $(CACHE_DIR)/browserify-cache.json
	$(BIN_DIR)/babel src -d lib
	sed -i '/require/s/zazen/./' lib/**.js
	mv $(CACHE_DIR)/browserify-cache.json browserify-cache.json
	$(BIN_DIR)/browserifyinc \
		lib/index.js \
		--debug \
		--standalone $(LIB_NAME) \
		-t babelify \
		| $(BIN_DIR)/exorcist $(BUILD_DIR)/$(LIB_NAME).map \
		> $(BUILD_DIR)/$(LIB_NAME)
	mv browserify-cache.json $(CACHE_DIR)/browserify-cache.json

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
	rm -rf $(BUILD_DIR) $(DIST_DIR) $(CACHE_DIR) tags

cleanall: clean
	rm -rf node_modules $(COVERAGE_DIR)

FORCE:
