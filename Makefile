install:
	npm ci

run:
	bin/gendiff.js

test:
	npm test

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix


.PHONY: test
