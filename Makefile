install:
	@cd client/ && npm install
	@npm install

run:
	@npm run dev

test:
	@npm run test

.PHONY: install run test
