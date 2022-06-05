install:
	@cd client/ && npm install
	@npm install

run:
	@npm run dev

.PHONY: install client server