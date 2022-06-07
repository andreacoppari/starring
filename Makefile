install:
	@cd client/ && npm install
	@cd server/ && npm install

client:
	@cd client/ && npm start
	
test:
	@npm run test

.PHONY: install client test
