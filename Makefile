install:
	npm ci

run:
	bin/gendiff.js

test:
	npm test

lint:
	npx eslint .

lint-fix:
	npx exlint . --fix


.PHONY: test
