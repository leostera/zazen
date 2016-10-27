.PHONY: all
.PHONY: flow-stop check check-coverage test lint
.PHONY: assets styles source build package
.PHONY: server clean
.PHONY: tags

DIST_DIR  =./dist
BUILD_DIR =./build
BIN_DIR   =./node_modules/.bin
SCRIPT_DIR=./scripts

DIR=.

BRANCH ?=$(shell git rev-parse --abbrev-ref HEAD)
VERSION =$(shell git describe --tags HEAD)
REVISION=$(shell git rev-parse HEAD)
STAMP   =$(REVISION).$(shell date +%s)

all: setup check lint test package

ci: all

setup:
	$(SCRIPT_DIR)/symlink.sh

flow-stop:
	$(BIN_DIR)/flow stop

check:
	$(BIN_DIR)/flow

check-coverage:
	$(SCRIPT_DIR)/check-coverage.sh

test:
	$(BIN_DIR)/jest

lint:
	$(BIN_DIR)/eslint ./src

build:
	$(BIN_DIR)/browserify \
		src/app.js \
		--debug \
		-t babelify \
		| $(BIN_DIR)/exorcist $(BUILD_DIR)/bundle.js.map \
		> $(BUILD_DIR)/_bundle.js
	mv $(BUILD_DIR)/_bundle.js $(BUILD_DIR)/bundle.js

server:
	$(BIN_DIR)/static-server -n $(DIR)/index.html -f $(DIR)

tags:
	rm tags
	ctags .

clean:
	rm -rf $(BUILD_DIR) $(DIST_DIR) tags

cleanall: clean
	rm -rf node_modules
